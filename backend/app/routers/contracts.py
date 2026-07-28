import hashlib
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db, require_admin
from app.models import Contract, ContractStatus, NotificationType, User, UserRole
from app.schemas.contract import ContractCreate, ContractFillRequest, ContractOut, ContractSignRequest
from app.services.contract_pdf import build_contract_pdf
from app.services.notifications import notify_admins, notify_user

router = APIRouter(prefix="/contracts", tags=["Contratos"])


def _next_number(db: Session) -> str:
    year = datetime.now(timezone.utc).year
    count = db.scalar(select(func.count(Contract.id))) or 0
    return f"LC-{year}-CTR-{count + 1:03d}"


def _get_contract_or_404(db: Session, contract_id: int, user: User) -> Contract:
    contract = db.get(Contract, contract_id)
    if contract is None or (user.role == UserRole.CLIENT and contract.client_id != user.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contrato não encontrado.")
    return contract


@router.get("", response_model=list[ContractOut])
def list_contracts(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[Contract]:
    query = select(Contract).order_by(Contract.created_at.desc())
    if user.role == UserRole.CLIENT:
        query = query.where(Contract.client_id == user.id)
    return list(db.scalars(query))


@router.post("", response_model=ContractOut, status_code=status.HTTP_201_CREATED)
def create_contract(
    payload: ContractCreate,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> Contract:
    client = db.get(User, payload.client_id)
    if client is None or client.role != UserRole.CLIENT:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")

    contract = Contract(number=_next_number(db), status=ContractStatus.EM_ANALISE, **payload.model_dump())
    db.add(contract)
    db.commit()
    db.refresh(contract)
    return contract


@router.post("/{contract_id}/send", response_model=ContractOut)
def send_for_signature(
    contract_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> Contract:
    contract = _get_contract_or_404(db, contract_id, admin)
    if contract.status != ContractStatus.EM_ANALISE:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"O contrato está em estado '{contract.status.value}' e não pode ser enviado.",
        )

    contract.status = ContractStatus.PENDENTE_ASSINATURA
    notify_user(
        db,
        contract.client_id,
        "Contrato Enviado para Assinatura",
        f"O contrato {contract.number} aguarda os seus dados e assinatura digital no portal.",
        NotificationType.CONTRACT,
        target_tab="contracts",
    )
    db.commit()
    db.refresh(contract)
    return contract


@router.patch("/{contract_id}/fill", response_model=ContractOut)
def fill_contractor_details(
    contract_id: int,
    payload: ContractFillRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Contract:
    """O cliente preenche a sua identificação (nome, BI/NUIT, morada, contacto)."""
    contract = _get_contract_or_404(db, contract_id, user)
    if contract.status != ContractStatus.PENDENTE_ASSINATURA:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Os dados só podem ser preenchidos enquanto o contrato aguarda assinatura.",
        )

    for field, value in payload.model_dump().items():
        setattr(contract, field, value)
    db.commit()
    db.refresh(contract)
    return contract


@router.post("/{contract_id}/sign", response_model=ContractOut)
def sign_contract(
    contract_id: int,
    payload: ContractSignRequest,
    request: Request,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Contract:
    """Assinatura do CONTRATANTE (cliente) — exige a identificação preenchida."""
    contract = _get_contract_or_404(db, contract_id, user)
    if contract.status != ContractStatus.PENDENTE_ASSINATURA:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"O contrato está em estado '{contract.status.value}' e não pode ser assinado.",
        )
    if not (contract.contractor_full_name and contract.contractor_id_number):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Preencha primeiro a identificação do contratante (nome e BI/NUIT).",
        )

    signed_at = datetime.now(timezone.utc)
    fingerprint = f"{contract.number}|{user.id}|{payload.signed_by_name}|{signed_at.isoformat()}"

    contract.status = ContractStatus.ASSINADO
    contract.signed_at = signed_at
    contract.signed_by_name = payload.signed_by_name
    contract.signature_hash = hashlib.sha256(fingerprint.encode()).hexdigest()
    contract.signature_ip = request.client.host if request.client else None
    contract.client_signature_image = payload.signature_image

    notify_admins(
        db,
        "Contrato Assinado pelo Cliente",
        f"{payload.signed_by_name} assinou o contrato {contract.number}. Falta a contra-assinatura da Learn Code.",
        NotificationType.CONTRACT,
        target_tab="contracts",
    )
    db.commit()
    db.refresh(contract)
    return contract


@router.post("/{contract_id}/countersign", response_model=ContractOut)
def countersign_contract(
    contract_id: int,
    payload: ContractSignRequest,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> Contract:
    """Contra-assinatura do PRESTADOR (admin) — conclui o contrato."""
    contract = _get_contract_or_404(db, contract_id, admin)
    if contract.status not in (ContractStatus.PENDENTE_ASSINATURA, ContractStatus.ASSINADO):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"O contrato está em estado '{contract.status.value}' e não pode ser contra-assinado.",
        )

    contract.admin_signed_at = datetime.now(timezone.utc)
    contract.admin_signed_by_name = payload.signed_by_name
    contract.admin_signature_image = payload.signature_image

    # Quando as duas partes assinaram, o contrato fica concluído
    if contract.signed_at is not None:
        contract.status = ContractStatus.CONCLUIDO
        notify_user(
            db,
            contract.client_id,
            "Contrato Concluído",
            f"O contrato {contract.number} foi assinado por ambas as partes. Pode descarregar o PDF final no portal.",
            NotificationType.CONTRACT,
            target_tab="contracts",
        )
    db.commit()
    db.refresh(contract)
    return contract


@router.get("/{contract_id}/pdf")
def download_contract_pdf(
    contract_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    """Exporta o contrato oficial em PDF, com as assinaturas existentes."""
    contract = _get_contract_or_404(db, contract_id, user)
    pdf_bytes = build_contract_pdf(contract)
    filename = f"Contrato_{contract.number.replace('/', '-')}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
