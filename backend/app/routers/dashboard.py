from datetime import datetime, timezone
from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import extract, func, select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db, require_admin
from app.models import (
    Contract,
    ContractStatus,
    Invoice,
    InvoiceStatus,
    Meeting,
    MeetingStatus,
    Project,
    ProjectStatus,
    Quotation,
    QuotationStatus,
    User,
    UserRole,
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

ACTIVE_PROJECT_STATUSES = (ProjectStatus.PLANEAMENTO, ProjectStatus.EM_DESENVOLVIMENTO, ProjectStatus.TESTES)


@router.get("/admin")
def admin_summary(_: User = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    revenue_received = db.scalar(
        select(func.coalesce(func.sum(Invoice.amount_mzn), 0)).where(Invoice.status == InvoiceStatus.PAGA)
    ) or Decimal(0)
    revenue_pending = db.scalar(
        select(func.coalesce(func.sum(Invoice.amount_mzn), 0)).where(Invoice.status != InvoiceStatus.PAGA)
    ) or Decimal(0)

    year = datetime.now(timezone.utc).year
    monthly = db.execute(
        select(
            extract("month", Invoice.paid_at).label("month"),
            func.sum(Invoice.amount_mzn),
        )
        .where(Invoice.status == InvoiceStatus.PAGA, extract("year", Invoice.paid_at) == year)
        .group_by("month")
        .order_by("month")
    ).all()

    return {
        "active_clients": db.scalar(
            select(func.count(User.id)).where(User.role == UserRole.CLIENT, User.is_active)
        ),
        "active_projects": db.scalar(
            select(func.count(Project.id)).where(Project.status.in_(ACTIVE_PROJECT_STATUSES))
        ),
        "revenue_received_mzn": revenue_received,
        "revenue_pending_mzn": revenue_pending,
        "pending_quotations": db.scalar(
            select(func.count(Quotation.id)).where(Quotation.status == QuotationStatus.PENDENTE)
        ),
        "pending_contracts": db.scalar(
            select(func.count(Contract.id)).where(
                Contract.status.in_((ContractStatus.EM_ANALISE, ContractStatus.PENDENTE_ASSINATURA))
            )
        ),
        "awaiting_confirmation_invoices": db.scalar(
            select(func.count(Invoice.id)).where(Invoice.status == InvoiceStatus.AGUARDA_CONFIRMACAO)
        ),
        "monthly_revenue": [{"month": int(month), "total_mzn": total} for month, total in monthly],
    }


@router.get("/client")
def client_summary(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    open_invoices_total = db.scalar(
        select(func.coalesce(func.sum(Invoice.amount_mzn), 0)).where(
            Invoice.client_id == user.id,
            Invoice.status.in_((InvoiceStatus.PENDENTE, InvoiceStatus.VENCIDA)),
        )
    ) or Decimal(0)

    return {
        "active_projects": db.scalar(
            select(func.count(Project.id)).where(
                Project.client_id == user.id, Project.status.in_(ACTIVE_PROJECT_STATUSES)
            )
        ),
        "avg_progress": db.scalar(
            select(func.coalesce(func.avg(Project.progress), 0)).where(
                Project.client_id == user.id, Project.status.in_(ACTIVE_PROJECT_STATUSES)
            )
        ),
        "pending_contracts": db.scalar(
            select(func.count(Contract.id)).where(
                Contract.client_id == user.id, Contract.status == ContractStatus.PENDENTE_ASSINATURA
            )
        ),
        "pending_quotations": db.scalar(
            select(func.count(Quotation.id)).where(
                Quotation.client_id == user.id, Quotation.status == QuotationStatus.PENDENTE
            )
        ),
        "open_invoices_total_mzn": open_invoices_total,
        "next_meetings": db.scalar(
            select(func.count(Meeting.id)).where(
                Meeting.client_id == user.id, Meeting.status == MeetingStatus.AGENDADA
            )
        ),
    }
