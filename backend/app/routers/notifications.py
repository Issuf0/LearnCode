from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models import Notification, User
from app.schemas.notification import NotificationOut

router = APIRouter(prefix="/notifications", tags=["Notificações"])


@router.get("", response_model=list[NotificationOut])
def list_notifications(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 50,
) -> list[Notification]:
    return list(
        db.scalars(
            select(Notification)
            .where(Notification.user_id == user.id)
            .order_by(Notification.created_at.desc())
            .limit(min(limit, 200))
        )
    )


@router.post("/read-all", status_code=status.HTTP_204_NO_CONTENT)
def mark_all_read(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> None:
    db.execute(update(Notification).where(Notification.user_id == user.id).values(read=True))
    db.commit()


@router.post("/{notification_id}/read", response_model=NotificationOut)
def mark_read(
    notification_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Notification:
    notification = db.get(Notification, notification_id)
    if notification is None or notification.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notificação não encontrada.")
    notification.read = True
    db.commit()
    db.refresh(notification)
    return notification
