import pandas as pd
from sqlalchemy import create_engine
from urllib.parse import quote_plus

# Database credentials
username = "root"
password = quote_plus("M@rtes2121")  # ✅ encode special characters like '@'
database = "AI_Campus"

# Create SQLAlchemy engine safely
engine = create_engine(f"mysql+mysqlconnector://{username}:{password}@localhost/{database}")

# Test query
df = pd.read_sql("SELECT * FROM events LIMIT 10", engine)
print(df.head())
