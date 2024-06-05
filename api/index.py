import uuid
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.dialects.postgresql import UUID as SQLAlchemyUUID
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
from dotenv import load_dotenv
from typing import List
from contextlib import asynccontextmanager

# Load environment variables from .env file
load_dotenv()

# Get the Supabase database URL from environment variables
DATABASE_URL = os.getenv("SUPABASE_DB_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment variables")

# SQLAlchemy setup with psycopg2 driver
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define the FastAPI application
app = FastAPI()

# Database model for the 'baby_names' table
class BabyNames(Base):
    __tablename__ = 'baby_names'
    id = Column(SQLAlchemyUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    child_first_name = Column(String, index=True)
    ethnicity = Column(String, index=True)
    birth_year = Column(Integer)
    gender = Column(String)
    count = Column(Integer)
    rank = Column(Integer)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Lifespan context manager for startup tasks
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    yield
    # Any teardown tasks if needed

app = FastAPI(lifespan=lifespan)
# TODO: add API endpoints that would be useful for the users
# TODO: get all baby names
# TODO: search for baby names with a particular attribute
# TODO: search with multiple attributes
# TODO: Obtaining a random baby name
# TODO: Obtaining a list of the baby names in alphabetical order
# TODO: Obtaining a list of the baby names sorted by rank
# TODO: Obtaining a list of the baby names sorted by count
# TODO: Obtainign baby names with particular count or rank
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/names", response_model=List[str])
def get_names(db: Session = Depends(get_db)):
    try:
        result = db.query(BabyNames.child_first_name).all()
        names = [name for name, in result]
        return names
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching names: {str(e)}")

@app.get("/names", response_model=List[BabyNames])
def get_names(db: Session = Depends(get_db)):
    try:
        # Obtain all of the baby names
        names = db.query(BabyNames).all()
        return names
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/names/{name_id}", response_model=str)
def get_name(name_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        name = db.query(BabyNames).filter(BabyNames.id == name_id).first()
        if name is None:
            raise HTTPException(status_code=404, detail="Name not found")
        return {"child_first_name": name.child_first_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching name with id {name_id}: {str(e)}")