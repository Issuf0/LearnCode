from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models import InvoiceStatus


class InvoiceCreate(BaseModel):
    client_id: int
    project_id: int | None = None
    description: str | None = None
    amount_mzn: Decimal = Field(gt=0)
    issued_date: date
    due_date: date


class PaymentProofRequest(BaseModel):
    # Referência da transacção M-Pesa/transferência indicada pelo cliente
    note: str | None = Field(default=None, max_length=255)


class InvoiceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    number: str
    client_id: int
    project_id: int | None
    description: str | None
    amount_mzn: Decimal
    issued_date: date
    due_date: date
    status: InvoiceStatus
    proof_note: str | None
    proof_submitted_at: datetime | None
    paid_at: datetime | None
