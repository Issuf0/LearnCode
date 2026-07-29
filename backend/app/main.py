from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.core.config import get_settings
from app.core.security import hash_password
from app.database import Base, SessionLocal, engine
from app.models import User, UserRole
from app.routers import (
    auth,
    clients,
    contracts,
    dashboard,
    invoices,
    meetings,
    notifications,
    projects,
    quotations,
)

@asynccontextmanager
async def lifespan(_: FastAPI):
    """Arranque: garante o esquema e a conta de administrador (idempotente).

    Permite fazer deploy (ex.: Railway) sem passos manuais de seed.
    """
    Base.metadata.create_all(bind=engine)
    settings = get_settings()
    with SessionLocal() as db:
        if db.scalar(select(User).where(User.email == settings.admin_email)) is None:
            db.add(
                User(
                    name=settings.admin_name,
                    email=settings.admin_email,
                    password_hash=hash_password(settings.admin_password),
                    role=UserRole.ADMIN,
                )
            )
            db.commit()
    yield


app = FastAPI(
    title="Learn Code API",
    description="Backend da plataforma Learn Code — clientes, projectos, orçamentos, contratos, faturas e reuniões.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api"
for router in (auth, clients, projects, quotations, contracts, invoices, meetings, notifications, dashboard):
    app.include_router(router.router, prefix=API_PREFIX)


@app.get("/", tags=["Saúde"])
def health() -> dict:
    return {"status": "ok", "service": "Learn Code API"}
