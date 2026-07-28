import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class NotificationType(str, enum.Enum):
    PROJECT = "project"
    CONTRACT = "contract"
    INVOICE = "invoice"
    QUOTATION = "quotation"
    MEETING = "meeting"


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    message: Mapped[str] = mapped_column(String(500))
    type: Mapped[NotificationType] = mapped_column(Enum(NotificationType, native_enum=False, length=15))
    target_tab: Mapped[str | None] = mapped_column(String(30))
    read: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
