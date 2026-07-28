from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
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

app = FastAPI(
    title="Learn Code API",
    description="Backend da plataforma Learn Code — clientes, projectos, orçamentos, contratos, faturas e reuniões.",
    version="1.0.0",
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
