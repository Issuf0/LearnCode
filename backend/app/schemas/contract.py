from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models import ContractStatus


class ContractCreate(BaseModel):
    client_id: int
    project_id: int | None = None
    title: str = Field(min_length=2, max_length=200)
    service_description: str | None = None
    specifications: str | None = None
    start_date: date | None = None
    delivery_date: date | None = None
    value_mzn: Decimal = Field(gt=0)
    deposit_percent: int = Field(default=50, ge=30, le=50)
    payment_method: str | None = None


class ContractFillRequest(BaseModel):
    """Identificação do contratante — preenchida pelo cliente antes de assinar."""

    contractor_full_name: str = Field(min_length=3, max_length=160)
    contractor_id_number: str = Field(min_length=3, max_length=60)
    contractor_address: str = Field(min_length=3, max_length=255)
    contractor_contact: str = Field(min_length=3, max_length=60)


class ContractSignRequest(BaseModel):
    signed_by_name: str = Field(min_length=2, max_length=120)
    signature_image: str | None = Field(default=None, description="Assinatura desenhada (data URL PNG)")


class ContractOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    number: str
    client_id: int
    project_id: int | None
    title: str
    status: ContractStatus
    service_description: str | None
    specifications: str | None
    start_date: date | None
    delivery_date: date | None
    value_mzn: Decimal
    deposit_percent: int
    payment_method: str | None
    contractor_full_name: str | None
    contractor_id_number: str | None
    contractor_address: str | None
    contractor_contact: str | None
    signed_at: datetime | None
    signed_by_name: str | None
    signature_hash: str | None
    admin_signed_at: datetime | None
    admin_signed_by_name: str | None
    created_at: datetime
