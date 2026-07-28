"""Cria as tabelas e a conta de administrador inicial.

Uso (a partir da pasta backend/, com o .env configurado):
    python -m scripts.seed
"""

from sqlalchemy import select

from app.core.config import get_settings
from app.core.security import hash_password
from app.database import Base, SessionLocal, engine
from app.models import User, UserRole


def main() -> None:
    settings = get_settings()

    Base.metadata.create_all(bind=engine)
    print("✔ Tabelas criadas/actualizadas.")

    with SessionLocal() as db:
        existing = db.scalar(select(User).where(User.email == settings.admin_email))
        if existing:
            print(f"✔ Admin já existe: {existing.email}")
            return

        admin = User(
            name=settings.admin_name,
            email=settings.admin_email,
            password_hash=hash_password(settings.admin_password),
            role=UserRole.ADMIN,
        )
        db.add(admin)
        db.commit()
        print(f"✔ Admin criado: {admin.email}")


if __name__ == "__main__":
    main()
