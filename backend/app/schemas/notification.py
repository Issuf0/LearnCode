from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models import NotificationType


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    message: str
    type: NotificationType
    target_tab: str | None
    read: bool
    created_at: datetime
