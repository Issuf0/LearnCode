import enum
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class QuotationStatus(str, enum.Enum):
    DRAFT = "Draft"
    PENDENTE = "Pendente"
    APROVADO = "Aprovado"
    RECUSADO = "Recusado"


class Quotation(Base):
    __tablename__ = "quotations"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(30), unique=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    project_title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text)
    price_mzn: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    estimated_time: Mapped[str | None] = mapped_column(String(60))
    status: Mapped[QuotationStatus] = mapped_column(
        Enum(QuotationStatus, native_enum=False, length=15), default=QuotationStatus.PENDENTE
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    client: Mapped["User"] = relationship()  # noqa: F821
