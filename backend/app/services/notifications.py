"""Notificações internas da plataforma.

Cada transição relevante da máquina de estados (orçamento enviado, contrato
por assinar, pagamento confirmado...) gera uma notificação para o utilizador
certo. No futuro, este serviço será o ponto único de integração com o
WhatsApp Cloud API / email — sem tocar nos routers.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Notification, NotificationType, User, UserRole


def notify_user(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    type_: NotificationType,
    target_tab: str | None = None,
) -> None:
    db.add(Notification(user_id=user_id, title=title, message=message, type=type_, target_tab=target_tab))


def notify_admins(
    db: Session,
    title: str,
    message: str,
    type_: NotificationType,
    target_tab: str | None = None,
) -> None:
    admin_ids = db.scalars(select(User.id).where(User.role == UserRole.ADMIN, User.is_active)).all()
    for admin_id in admin_ids:
        notify_user(db, admin_id, title, message, type_, target_tab)
