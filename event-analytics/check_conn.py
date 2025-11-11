import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="M@rtes2121",
    database="AI_Campus"
)

cursor = conn.cursor()
cursor.execute("SHOW TABLES;")
for x in cursor:
    print(x)

conn.close()

df = pd.read_sql("SELECT * FROM events LIMIT 10", conn)
print(df)