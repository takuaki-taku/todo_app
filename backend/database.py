import os

from databases import Database
from sqlalchemy import create_engine, MetaData

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/todo_app",
)

database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL)
metadata = MetaData()
