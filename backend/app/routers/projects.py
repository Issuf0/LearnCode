from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.deps import get_current_user, get_db, require_admin
from app.models import (
    Milestone,
    NotificationType,
    Project,
    ProjectComment,
    ProjectTask,
    TaskStatus,
    User,
    UserRole,
)
from app.schemas.project import (
    CommentCreate,
    CommentOut,
    MilestoneOut,
    ProjectCreate,
    ProjectDetailOut,
    ProjectOut,
    ProjectUpdate,
    TaskOut,
)
from app.services.notifications import notify_user

router = APIRouter(prefix="/projects", tags=["Projectos"])


def _get_project_or_404(db: Session, project_id: int, user: User) -> Project:
    project = db.scalar(
        select(Project)
        .options(selectinload(Project.milestones), selectinload(Project.tasks))
        .where(Project.id == project_id)
    )
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Projecto não encontrado.")
    # Um cliente só acede aos seus próprios projectos
    if user.role == UserRole.CLIENT and project.client_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Projecto não encontrado.")
    return project


def _comment_out(comment: ProjectComment) -> CommentOut:
    return CommentOut(
        id=comment.id,
        text=comment.text,
        created_at=comment.created_at,
        author_name=comment.author.name,
        is_client=comment.author.role == UserRole.CLIENT,
    )


@router.get("", response_model=list[ProjectOut])
def list_projects(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[Project]:
    query = (
        select(Project)
        .options(selectinload(Project.milestones), selectinload(Project.tasks))
        .order_by(Project.created_at.desc())
    )
    if user.role == UserRole.CLIENT:
        query = query.where(Project.client_id == user.id)
    return list(db.scalars(query))


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> Project:
    client = db.get(User, payload.client_id)
    if client is None or client.role != UserRole.CLIENT:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")

    project = Project(
        client_id=payload.client_id,
        name=payload.name,
        category=payload.category,
        description=payload.description,
        manager_name=payload.manager_name,
        start_date=payload.start_date,
        deadline=payload.deadline,
        milestones=[Milestone(title=m.title, due_date=m.due_date) for m in payload.milestones],
        tasks=[ProjectTask(title=t.title, assigned_to=t.assigned_to) for t in payload.tasks],
    )
    db.add(project)
    notify_user(
        db,
        client.id,
        "Novo Projecto Criado",
        f'O projecto "{payload.name}" foi registado e já pode acompanhá-lo no portal.',
        NotificationType.PROJECT,
        target_tab="projects",
    )
    db.commit()
    db.refresh(project)
    return project


@router.get("/{project_id}", response_model=ProjectDetailOut)
def get_project(
    project_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProjectDetailOut:
    project = _get_project_or_404(db, project_id, user)
    comments = db.scalars(
        select(ProjectComment)
        .options(selectinload(ProjectComment.author))
        .where(ProjectComment.project_id == project.id)
        .order_by(ProjectComment.created_at)
    ).all()

    return ProjectDetailOut(
        **ProjectOut.model_validate(project).model_dump(),
        comments=[_comment_out(c) for c in comments],
    )


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> Project:
    project = _get_project_or_404(db, project_id, admin)
    changes = payload.model_dump(exclude_unset=True)
    for field, value in changes.items():
        setattr(project, field, value)

    if "status" in changes or "progress" in changes:
        notify_user(
            db,
            project.client_id,
            "Projecto Actualizado",
            f'"{project.name}" — estado: {project.status.value}, progresso: {project.progress}%.',
            NotificationType.PROJECT,
            target_tab="projects",
        )
    db.commit()
    db.refresh(project)
    return project


@router.post("/{project_id}/comments", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
def add_comment(
    project_id: int,
    payload: CommentCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CommentOut:
    project = _get_project_or_404(db, project_id, user)
    comment = ProjectComment(project_id=project.id, author_id=user.id, text=payload.text)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return _comment_out(comment)


@router.patch("/{project_id}/tasks/{task_id}", response_model=TaskOut)
def toggle_task(
    project_id: int,
    task_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProjectTask:
    project = _get_project_or_404(db, project_id, user)
    task = db.get(ProjectTask, task_id)
    if task is None or task.project_id != project.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarefa não encontrada.")

    task.status = TaskStatus.COMPLETED if task.status != TaskStatus.COMPLETED else TaskStatus.IN_PROGRESS
    db.commit()
    db.refresh(task)
    return task


@router.patch("/{project_id}/milestones/{milestone_id}", response_model=MilestoneOut)
def toggle_milestone(
    project_id: int,
    milestone_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> Milestone:
    project = _get_project_or_404(db, project_id, admin)
    milestone = db.get(Milestone, milestone_id)
    if milestone is None or milestone.project_id != project.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Milestone não encontrada.")

    milestone.completed = not milestone.completed
    db.commit()
    db.refresh(milestone)
    return milestone
