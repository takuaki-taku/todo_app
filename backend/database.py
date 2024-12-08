from databases import Database
from sqlalchemy import create_engine, MetaData

DATABASE_URL = "mysql+pymysql://root:takuakiazuma@localhost/todo_app"

database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL)
metadata = MetaData()
