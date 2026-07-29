from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_settings


def _normalize_url(url: str) -> str:
    # O Railway (e outros) fornecem URLs "mysql://..."; o SQLAlchemy precisa do driver explícito
    if url.startswith("mysql://"):
        url = "mysql+pymysql://" + url.removeprefix("mysql://")
    return url


engine = create_engine(
    _normalize_url(get_settings().effective_database_url),
    pool_pre_ping=True,
    pool_recycle=3600,
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass
