from sqlalchemy import Column, Integer, String, Float
from db import Base

class Users(Base):
    __tablename__ = "Users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    hashed_pwd = Column(String)



class Employee(Base):
    __tablename__ = "Employee"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    role = Column(String)
    email = Column(String)
    salary = Column(Float)
    city = Column(String)
