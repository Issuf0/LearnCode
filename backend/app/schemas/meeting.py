from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models import MeetingStatus


class MeetingCreate(BaseModel):
    client_id: int
    project_id: int | None = None
    title: str = Field(min_length=2, max_length=200)
    scheduled_at: datetime
    meet_link: str | None = None


class MeetingStatusUpdate(BaseModel):
    status: MeetingStatus


class MeetingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    client_id: int
    project_id: int | None
    title: str
    scheduled_at: datetime
    meet_link: str | None
    status: MeetingStatus
    created_at: datetime
