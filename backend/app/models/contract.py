import enum
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ContractStatus(str, enum.Enum):
    EM_ANALISE = "Em Análise"
    PENDENTE_ASSINATURA = "Pendente Assinatura"
    ASSINADO = "Assinado"
    CONCLUIDO = "Concluído"
    CANCELADO = "Cancelado"


class Contract(Base):
    """Contrato de Prestação de Serviços — segue o template oficial da Learn Code.

    Fluxo: admin cria (escopo/valores) → envia → cliente preenche os seus dados
    e assina → admin contra-assina → Concluído. O PDF final é gerado com as
    cláusulas oficiais e as duas assinaturas.
    """

    __tablename__ = "contracts"

    id: Mapped[int] = mapped_column(primary_key=True)
    number: Mapped[str] = mapped_column(String(40), unique=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    project_id: Mapped[int | None] = mapped_column(ForeignKey("projects.id", ondelete="SET NULL"))
    title: Mapped[str] = mapped_column(String(200))
    status: Mapped[ContractStatus] = mapped_column(
        Enum(ContractStatus, native_enum=False, length=25), default=ContractStatus.EM_ANALISE
    )

    # Cláusula 1 — Objecto (preenchido pelo admin)
    service_description: Mapped[str | None] = mapped_column(Text)
    specifications: Mapped[str | None] = mapped_column(Text)

    # Cláusula 2 — Prazo de execução
    start_date: Mapped[date | None] = mapped_column(Date)
    delivery_date: Mapped[date | None] = mapped_column(Date)

    # Cláusula 3 — Valor e condições de pagamento
    value_mzn: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    deposit_percent: Mapped[int] = mapped_column(default=50)  # sinal: 30% a 50%
    payment_method: Mapped[str | None] = mapped_column(String(120))

    # Identificação do CONTRATANTE (preenchida pelo próprio cliente antes de assinar)
    contractor_full_name: Mapped[str | None] = mapped_column(String(160))
    contractor_id_number: Mapped[str | None] = mapped_column(String(60))  # BI ou NUIT
    contractor_address: Mapped[str | None] = mapped_column(String(255))
    contractor_contact: Mapped[str | None] = mapped_column(String(60))

    # Assinatura do CONTRATANTE (cliente) — trilho de auditoria completo
    signed_at: Mapped[datetime | None] = mapped_column(DateTime)
    signed_by_name: Mapped[str | None] = mapped_column(String(120))
    signature_hash: Mapped[str | None] = mapped_column(String(64))
    signature_ip: Mapped[str | None] = mapped_column(String(45))
    client_signature_image: Mapped[str | None] = mapped_column(Text(16_000_000))  # data URL (PNG)

    # Assinatura do PRESTADOR (admin)
    admin_signed_at: Mapped[datetime | None] = mapped_column(DateTime)
    admin_signed_by_name: Mapped[str | None] = mapped_column(String(120))
    admin_signature_image: Mapped[str | None] = mapped_column(Text(16_000_000))

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    client: Mapped["User"] = relationship()  # noqa: F821
    project: Mapped["Project | None"] = relationship()  # noqa: F821
