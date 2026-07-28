from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db, require_admin
from app.models import NotificationType, Quotation, QuotationStatus, User, UserRole
from app.schemas.quotation import QuotationCreate, QuotationOut
from app.services.notifications import notify_admins, notify_user

router = APIRouter(prefix="/quotations", tags=["Orçamentos"])


def _next_code(db: Session) -> str:
    year = datetime.now(timezone.utc).year
    count = db.scalar(select(func.count(Quotation.id))) or 0
    return f"ORC-{year}-{count + 1:03d}"


@router.get("", response_model=list[QuotationOut])
def list_quotations(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[Quotation]:
    query = select(Quotation).order_by(Quotation.created_at.desc())
    if user.role == UserRole.CLIENT:
        query = query.where(Quotation.client_id == user.id)
    return list(db.scalars(query))


@router.post("", response_model=QuotationOut, status_code=status.HTTP_201_CREATED)
def create_quotation(
    payload: QuotationCreate,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> Quotation:
    client = db.get(User, payload.client_id)
    if client is None or client.role != UserRole.CLIENT:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")

    quotation = Quotation(
        code=_next_code(db),
        client_id=payload.client_id,
        project_title=payload.project_title,
        description=payload.description,
        price_mzn=payload.price_mzn,
        estimated_time=payload.estimated_time,
        status=QuotationStatus.PENDENTE,
    )
    db.add(quotation)
    notify_user(
        db,
        client.id,
        "Novo Orçamento Disponível",
        f'O orçamento {quotation.code} ("{payload.project_title}") aguarda a sua aprovação.',
        NotificationType.QUOTATION,
        target_tab="quotations",
    )
    db.commit()
    db.refresh(quotation)
    return quotation


def _client_decision(
    quotation_id: int,
    new_status: QuotationStatus,
    user: User,
    db: Session,
) -> Quotation:
    quotation = db.get(Quotation, quotation_id)
    if quotation is None or (user.role == UserRole.CLIENT and quotation.client_id != user.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Orçamento não encontrado.")
    if quotation.status != QuotationStatus.PENDENTE:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Este orçamento já foi decidido ({quotation.status.value}).",
        )

    quotation.status = new_status
    decision = "aprovado" if new_status == QuotationStatus.APROVADO else "recusado"
    notify_admins(
        db,
        f"Orçamento {decision.capitalize()}",
        f"{user.name} {decision} o orçamento {quotation.code} ({quotation.project_title}).",
        NotificationType.QUOTATION,
        target_tab="quotations",
    )
    db.commit()
    db.refresh(quotation)
    return quotation


@router.post("/{quotation_id}/approve", response_model=QuotationOut)
def approve_quotation(
    quotation_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Quotation:
    return _client_decision(quotation_id, QuotationStatus.APROVADO, user, db)


@router.post("/{quotation_id}/reject", response_model=QuotationOut)
def reject_quotation(
    quotation_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Quotation:
    return _client_decision(quotation_id, QuotationStatus.RECUSADO, user, db)
