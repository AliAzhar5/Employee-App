from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Annotated
from starlette import status
from datetime import datetime, timedelta
from db import SessionLocal
from models import Users

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

SecretKey = "bafb51192881bc64aa9abb7e36a35cfa34786013dbb0a3121c42e60df84461b7"
Algorithm = "HS256"
minutes = 15

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

class CreateUser(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, user: CreateUser):
    existing_user = db.query(Users).filter(Users.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username is already registered. Try another username.")
    
    new_user = Users(username=user.username, hashed_pwd=bcrypt_context.hash(user.password))
    db.add(new_user)
    db.commit()


@router.post("/token", response_model=Token)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could Not Validate User")
    
    token = create_access_token(user.username, user.user_id, timedelta(minutes))
    return {"access_token": token, "token_type": "bearer"}


def authenticate_user(username: str, password: str, db):
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not bcrypt_context.verify(password, user.hashed_pwd):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return user


def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {"username": username, "user_id": user_id}
    expires = datetime.utcnow() + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, SecretKey, algorithm=Algorithm)


async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SecretKey, algorithms=[Algorithm])
        username: str = payload.get("username")
        user_id: int = payload.get("user_id")
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could Not Validate User")
        return {"username": username, "user_id": user_id}
    
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could Not Validate User")


@router.delete("/delete/{username}", status_code=status.HTTP_200_OK)
async def delete_user(username: str, current_user: Annotated[dict, Depends(get_current_user)], db: db_dependency):
    if current_user:
        target_user = db.query(Users).filter(Users.username == username).first()
        if not target_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        db.delete(target_user)
        db.commit()
        return {"message": f"User with username '{username}' successfully deleted"}


