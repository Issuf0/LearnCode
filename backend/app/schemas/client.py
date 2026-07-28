from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ClientCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str | None = None
    company: str | None = None
    # Senha temporária definida pelo admin; o cliente troca-a no primeiro acesso
    initial_password: str = Field(min_length=6)


class ClientUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    company: str | None = None
    is_active: bool | None = None


class ClientOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    phone: str | None
    company: str | None
    avatar_url: str | None
    is_active: bool
    created_at: datetime
