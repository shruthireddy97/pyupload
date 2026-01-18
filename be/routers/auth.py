from fastapi import HTTPException, Depends, APIRouter
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, DateTime, select
from jose import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import bcrypt

load_dotenv()

# -------------------- Config --------------------

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM") or "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or 60)

router = APIRouter(prefix="/auth", tags=["Authentication"])

# SQLAlchemy async configuration (MySQL + aiomysql)
def _env_clean(key: str) -> str | None:
    v = os.getenv(key)
    if not v:
        return None
    return v.strip().strip('"').strip("'")

# Allow either a full URL via MYSQL_DATABASE_URL or individual MYSQL_* vars
MYSQL_DATABASE_URL = _env_clean("MYSQL_DATABASE_URL")
if MYSQL_DATABASE_URL:
    DATABASE_URL = MYSQL_DATABASE_URL.replace("pymysql", "aiomysql") if "pymysql" in MYSQL_DATABASE_URL else MYSQL_DATABASE_URL
else:
    MYSQL_USER = _env_clean("MYSQL_USER")
    MYSQL_PASSWORD = _env_clean("MYSQL_PASSWORD")
    MYSQL_HOST = _env_clean("MYSQL_HOST") or "localhost"
    MYSQL_PORT = _env_clean("MYSQL_PORT") or "3306"
    MYSQL_DB = _env_clean("MYSQL_DB")

    if not (MYSQL_USER and MYSQL_PASSWORD and MYSQL_DB):
        raise RuntimeError("MySQL configuration missing. Set MYSQL_DATABASE_URL or MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB in .env")

    DATABASE_URL = f"mysql+aiomysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

engine = create_async_engine(DATABASE_URL, future=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False)


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


def normalize_password(password: str) -> bytes:
    return password.encode("utf-8")[:72]


def hash_password(password: str) -> str:
    pw = normalize_password(password)
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pw, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(normalize_password(plain_password), hashed_password.encode('utf-8'))


# -------------------- Pydantic Models --------------------


class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str


# -------------------- DB Dependency --------------------


async def get_db() -> AsyncSession:
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


# -------------------- Helpers --------------------


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


# -------------------- Routes --------------------


@router.post("/signup", status_code=201)
async def signup(user: UserSignup, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.email == user.email)
    res = await db.execute(stmt)
    existing = res.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    created_at = datetime.utcnow()
    hashed = hash_password(user.password)
    new_user = User(username=user.username, email=user.email, password=hashed, created_at=created_at)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": str(new_user.id)}


@router.post("/login", response_model=Token)
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.email == user.email)
    res = await db.execute(stmt)
    db_user = res.scalar_one_or_none()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(
        data={"sub": db_user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": access_token, "token_type": "bearer", "user_id": str(db_user.id)}

