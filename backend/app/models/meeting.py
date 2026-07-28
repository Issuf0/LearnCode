import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MeetingStatus(str, enum.Enum):
    AGENDADA = "Agendada"
    CONCLUIDA = "Concluída"
    CANCELADA = "Cancelada"


class Meeting(Base):
    __tablename__ = "meetings"

    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    project_id: Mapped[int | None] = mapped_column(ForeignKey("projects.id", ondelete="SET NULL"))
    title: Mapped[str] = mapped_column(String(200))
    scheduled_at: Mapped[datetime] = mapped_column(DateTime)
    meet_link: Mapped[str | None] = mapped_column(String(500))
    status: Mapped[MeetingStatus] = mapped_column(
        Enum(MeetingStatus, native_enum=False, length=15), default=MeetingStatus.AGENDADA
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    client: Mapped["User"] = relationship()  # noqa: F821
    project: Mapped["Project | None"] = relationship()  # noqa: F821
