from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_admin
from app.core.security import hash_password
from app.models import User, UserRole
from app.schemas.client import ClientCreate, ClientOut, ClientUpdate

# O portal é fechado: contas de cliente são criadas pelo admin depois de
# fechar negócio (por convite), nunca por auto-registo.
router = APIRouter(prefix="/clients", tags=["Clientes"], dependencies=[Depends(require_admin)])


def _get_client_or_404(db: Session, client_id: int) -> User:
    client = db.get(User, client_id)
    if client is None or client.role != UserRole.CLIENT:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")
    return client


@router.get("", response_model=list[ClientOut])
def list_clients(search: str | None = None, db: Session = Depends(get_db)) -> list[User]:
    query = select(User).where(User.role == UserRole.CLIENT).order_by(User.created_at.desc())
    if search:
        term = f"%{search}%"
        query = query.where(or_(User.name.like(term), User.email.like(term), User.company.like(term)))
    return list(db.scalars(query))


@router.post("", response_model=ClientOut, status_code=status.HTTP_201_CREATED)
def create_client(payload: ClientCreate, db: Session = Depends(get_db)) -> User:
    if db.scalar(select(User).where(User.email == payload.email)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Já existe uma conta com este email.")

    client = User(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        company=payload.company,
        password_hash=hash_password(payload.initial_password),
        role=UserRole.CLIENT,
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@router.get("/{client_id}", response_model=ClientOut)
def get_client(client_id: int, db: Session = Depends(get_db)) -> User:
    return _get_client_or_404(db, client_id)


@router.patch("/{client_id}", response_model=ClientOut)
def update_client(client_id: int, payload: ClientUpdate, db: Session = Depends(get_db)) -> User:
    client = _get_client_or_404(db, client_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(client, field, value)
    db.commit()
    db.refresh(client)
    return client


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: int, db: Session = Depends(get_db)) -> None:
    client = _get_client_or_404(db, client_id)
    db.delete(client)
    db.commit()
