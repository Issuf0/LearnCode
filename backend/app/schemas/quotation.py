from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models import QuotationStatus


class QuotationCreate(BaseModel):
    client_id: int
    project_title: str = Field(min_length=2, max_length=200)
    description: str | None = None
    price_mzn: Decimal = Field(gt=0)
    estimated_time: str | None = None


class QuotationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    client_id: int
    project_title: str
    description: str | None
    price_mzn: Decimal
    estimated_time: str | None
    status: QuotationStatus
    created_at: datetime
