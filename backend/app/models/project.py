import enum
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ProjectStatus(str, enum.Enum):
    PLANEAMENTO = "Planeamento"
    EM_DESENVOLVIMENTO = "Em Desenvolvimento"
    TESTES = "Testes"
    CONCLUIDO = "Concluído"
    PAUSADO = "Pausado"


class TaskStatus(str, enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(200))
    category: Mapped[str | None] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[ProjectStatus] = mapped_column(
        Enum(ProjectStatus, native_enum=False, length=30), default=ProjectStatus.PLANEAMENTO
    )
    progress: Mapped[int] = mapped_column(default=0)
    manager_name: Mapped[str | None] = mapped_column(String(120))
    start_date: Mapped[date | None] = mapped_column(Date)
    deadline: Mapped[date | None] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    milestones: Mapped[list["Milestone"]] = relationship(
        back_populates="project", cascade="all, delete-orphan", order_by="Milestone.due_date"
    )
    tasks: Mapped[list["ProjectTask"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    comments: Mapped[list["ProjectComment"]] = relationship(
        back_populates="project", cascade="all, delete-orphan", order_by="ProjectComment.created_at"
    )


class Milestone(Base):
    __tablename__ = "milestones"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    due_date: Mapped[date | None] = mapped_column(Date)
    completed: Mapped[bool] = mapped_column(default=False)

    project: Mapped[Project] = relationship(back_populates="milestones")


class ProjectTask(Base):
    __tablename__ = "project_tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus, native_enum=False, length=15), default=TaskStatus.TODO
    )
    assigned_to: Mapped[str | None] = mapped_column(String(120))

    project: Mapped[Project] = relationship(back_populates="tasks")


class ProjectComment(Base):
    __tablename__ = "project_comments"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    text: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    project: Mapped[Project] = relationship(back_populates="comments")
    author: Mapped["User"] = relationship()  # noqa: F821
