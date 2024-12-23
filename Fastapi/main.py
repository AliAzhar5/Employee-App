from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models
from db import SessionLocal, engine
from authentication import (
    router as auth_router,
    get_current_user,
)

crud_app = FastAPI()

origins = ["http://localhost:3000"]
crud_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

crud_app.include_router(auth_router)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

class Employee(BaseModel):
    first_name: str
    last_name: str
    role: str
    email: str
    salary: float
    city: str

class EmployeeModel(Employee):
    id: int

    class Config:
        form_attributes = True

models.Base.metadata.create_all(bind=engine)


@crud_app.post("/employees/", response_model=EmployeeModel, dependencies=[Depends(get_current_user)])
async def create_employee(employee: Employee, db: db_dependency):
    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


@crud_app.get("/employees/", response_model=List[EmployeeModel], dependencies=[Depends(get_current_user)])
async def read_employees(db: db_dependency, skip: int = 0, limit: int = 100):
    employees = db.query(models.Employee).offset(skip).limit(limit).all()
    return employees


@crud_app.put("/employees/{employee_id}", response_model=EmployeeModel, dependencies=[Depends(get_current_user)])
async def update_employee(employee_id: int, employee: Employee, db: db_dependency):
    db_employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    for key, value in employee.dict().items():
        setattr(db_employee, key, value)
    db.commit()
    db.refresh(db_employee)
    return db_employee


@crud_app.delete("/employees/{employee_id}", response_model=EmployeeModel, dependencies=[Depends(get_current_user)])
async def delete_employee(employee_id: int, db: db_dependency):
    db_employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(db_employee)
    db.commit()
    return db_employee