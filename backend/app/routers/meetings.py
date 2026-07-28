from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db, require_admin
from app.models import Meeting, MeetingStatus, NotificationType, User, UserRole
from app.schemas.meeting import MeetingCreate, MeetingOut, MeetingStatusUpdate
from app.services.notifications import notify_user

router = APIRouter(prefix="/meetings", tags=["Reuniões"])


@router.get("", response_model=list[MeetingOut])
def list_meetings(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[Meeting]:
    query = select(Meeting).order_by(Meeting.scheduled_at.desc())
    if user.role == UserRole.CLIENT:
        query = query.where(Meeting.client_id == user.id)
    return list(db.scalars(query))


@router.post("", response_model=MeetingOut, status_code=status.HTTP_201_CREATED)
def create_meeting(
    payload: MeetingCreate,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> Meeting:
    client = db.get(User, payload.client_id)
    if client is None or client.role != UserRole.CLIENT:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")

    meeting = Meeting(**payload.model_dump())
    db.add(meeting)
    notify_user(
        db,
        client.id,
        "Nova Reunião Agendada",
        f'"{payload.title}" — {payload.scheduled_at:%d/%m/%Y às %H:%M}. O link está na área de Reuniões.',
        NotificationType.MEETING,
        target_tab="meetings",
    )
    db.commit()
    db.refresh(meeting)
    return meeting


@router.patch("/{meeting_id}/status", response_model=MeetingOut)
def update_meeting_status(
    meeting_id: int,
    payload: MeetingStatusUpdate,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> Meeting:
    meeting = db.get(Meeting, meeting_id)
    if meeting is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reunião não encontrada.")

    meeting.status = payload.status
    if payload.status == MeetingStatus.CANCELADA:
        notify_user(
            db,
            meeting.client_id,
            "Reunião Cancelada",
            f'"{meeting.title}" de {meeting.scheduled_at:%d/%m/%Y} foi cancelada. Entraremos em contacto para reagendar.',
            NotificationType.MEETING,
            target_tab="meetings",
        )
    db.commit()
    db.refresh(meeting)
    return meeting
