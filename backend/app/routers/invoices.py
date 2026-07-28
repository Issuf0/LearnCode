from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db, require_admin
from app.models import Invoice, InvoiceStatus, NotificationType, User, UserRole
from app.schemas.invoice import InvoiceCreate, InvoiceOut, PaymentProofRequest
from app.services.notifications import notify_admins, notify_user

router = APIRouter(prefix="/invoices", tags=["Faturas"])


def _next_number(db: Session) -> str:
    year = datetime.now(timezone.utc).year
    count = db.scalar(select(func.count(Invoice.id))) or 0
    return f"FT {year}/{count + 1:03d}"


@router.get("", response_model=list[InvoiceOut])
def list_invoices(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[Invoice]:
    query = select(Invoice).order_by(Invoice.created_at.desc())
    if user.role == UserRole.CLIENT:
        query = query.where(Invoice.client_id == user.id)
    return list(db.scalars(query))


@router.post("", response_model=InvoiceOut, status_code=status.HTTP_201_CREATED)
def create_invoice(
    payload: InvoiceCreate,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> Invoice:
    client = db.get(User, payload.client_id)
    if client is None or client.role != UserRole.CLIENT:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")

    invoice = Invoice(number=_next_number(db), **payload.model_dump())
    db.add(invoice)
    notify_user(
        db,
        client.id,
        "Nova Factura Emitida",
        f"A factura {invoice.number} no valor de {payload.amount_mzn:,.2f} MZN vence a {payload.due_date:%d/%m/%Y}.",
        NotificationType.INVOICE,
        target_tab="dashboard",
    )
    db.commit()
    db.refresh(invoice)
    return invoice


@router.post("/{invoice_id}/submit-proof", response_model=InvoiceOut)
def submit_payment_proof(
    invoice_id: int,
    payload: PaymentProofRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Invoice:
    """O cliente pagou por M-Pesa/transferência e submete a referência do comprovativo."""
    invoice = db.get(Invoice, invoice_id)
    if invoice is None or (user.role == UserRole.CLIENT and invoice.client_id != user.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Factura não encontrada.")
    if invoice.status not in (InvoiceStatus.PENDENTE, InvoiceStatus.VENCIDA):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A factura está em estado '{invoice.status.value}'.",
        )

    invoice.status = InvoiceStatus.AGUARDA_CONFIRMACAO
    invoice.proof_note = payload.note
    invoice.proof_submitted_at = datetime.now(timezone.utc)

    notify_admins(
        db,
        "Comprovativo de Pagamento Recebido",
        f"{user.name} submeteu comprovativo da factura {invoice.number}. Confirme o pagamento.",
        NotificationType.INVOICE,
        target_tab="finance",
    )
    db.commit()
    db.refresh(invoice)
    return invoice


@router.post("/{invoice_id}/confirm", response_model=InvoiceOut)
def confirm_payment(
    invoice_id: int,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> Invoice:
    """O admin verificou o comprovativo — a factura passa a Paga e o recibo fica disponível."""
    invoice = db.get(Invoice, invoice_id)
    if invoice is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Factura não encontrada.")
    if invoice.status == InvoiceStatus.PAGA:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A factura já está paga.")

    invoice.status = InvoiceStatus.PAGA
    invoice.paid_at = datetime.now(timezone.utc)

    notify_user(
        db,
        invoice.client_id,
        "Pagamento Confirmado",
        f"O pagamento da factura {invoice.number} foi confirmado. Obrigado!",
        NotificationType.INVOICE,
        target_tab="dashboard",
    )
    db.commit()
    db.refresh(invoice)
    return invoice
