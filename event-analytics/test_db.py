from db_config import get_connection
import pandas as pd

conn = get_connection()
df = pd.read_sql("SELECT * FROM events LIMIT 5", conn)
print(df.head())
conn.close()
