from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models import ProjectStatus, TaskStatus


class MilestoneCreate(BaseModel):
    title: str
    due_date: date | None = None


class MilestoneOut(MilestoneCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    completed: bool


class TaskCreate(BaseModel):
    title: str
    assigned_to: str | None = None


class TaskOut(TaskCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: TaskStatus


class CommentCreate(BaseModel):
    text: str = Field(min_length=1, max_length=2000)


class CommentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str
    created_at: datetime
    author_name: str
    is_client: bool


class ProjectCreate(BaseModel):
    client_id: int
    name: str = Field(min_length=2, max_length=200)
    category: str | None = None
    description: str | None = None
    manager_name: str | None = None
    start_date: date | None = None
    deadline: date | None = None
    milestones: list[MilestoneCreate] = []
    tasks: list[TaskCreate] = []


class ProjectUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    description: str | None = None
    status: ProjectStatus | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    manager_name: str | None = None
    start_date: date | None = None
    deadline: date | None = None


class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    client_id: int
    name: str
    category: str | None
    description: str | None
    status: ProjectStatus
    progress: int
    manager_name: str | None
    start_date: date | None
    deadline: date | None
    created_at: datetime
    milestones: list[MilestoneOut]
    tasks: list[TaskOut]


class ProjectDetailOut(ProjectOut):
    comments: list[CommentOut]
