import enum
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class InvoiceStatus(str, enum.Enum):
    PENDENTE = "Pendente"
    AGUARDA_CONFIRMACAO = "Aguarda Confirmação"
    PAGA = "Paga"
    VENCIDA = "Vencida"


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(primary_key=True)
    number: Mapped[str] = mapped_column(String(30), unique=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    project_id: Mapped[int | None] = mapped_column(ForeignKey("projects.id", ondelete="SET NULL"))
    description: Mapped[str | None] = mapped_column(String(255))
    amount_mzn: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    issued_date: Mapped[date] = mapped_column(Date)
    due_date: Mapped[date] = mapped_column(Date)
    status: Mapped[InvoiceStatus] = mapped_column(
        Enum(InvoiceStatus, native_enum=False, length=25), default=InvoiceStatus.PENDENTE
    )
    # Fluxo de comprovativo manual: cliente paga por M-Pesa/transferência e submete;
    # o admin confirma e a factura passa a Paga.
    proof_note: Mapped[str | None] = mapped_column(String(255))
    proof_submitted_at: Mapped[datetime | None] = mapped_column(DateTime)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    client: Mapped["User"] = relationship()  # noqa: F821
    project: Mapped["Project | None"] = relationship()  # noqa: F821
