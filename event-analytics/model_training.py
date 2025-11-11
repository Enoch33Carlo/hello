import pandas as pd
import matplotlib.pyplot as plt
from sqlalchemy import create_engine
from urllib.parse import quote_plus
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
from textblob import TextBlob

# --- Database setup ---
username = "root"
password = quote_plus("M@rtes2121")
database = "AI_Campus"
engine = create_engine(f"mysql+mysqlconnector://{username}:{password}@localhost/{database}")

# --- Load data ---
df = pd.read_sql("""
SELECT
    e.id AS event_id,
    e.title AS event_title,
    COALESCE(SUM(f.cashCollected), 0) + COALESCE(SUM(f.onlineCollected), 0) AS total_collected,
    COUNT(r.id) AS total_registrations
FROM events e
LEFT JOIN finance f ON e.id = f.eventId
LEFT JOIN registrations r ON e.id = r.eventId
GROUP BY e.id, e.title
""", engine)

print("✅ Data loaded successfully:")
print(df.head())

# --- Visualization 1: Total revenue per event ---

plt.figure(figsize=(5, 4))
plt.bar(df["event_title"], df["total_collected"], color="skyblue", edgecolor="black")
plt.title("Total Revenue by Event")
plt.xlabel("Event Title")
plt.ylabel("Total Collected (₹)")
plt.xticks(rotation=45, ha="right")
plt.tight_layout()
plt.savefig("static/revenue_by_event.png")
plt.close()

# --- Visualization 2: Total registrations per event ---
plt.figure(figsize=(5, 3))
plt.bar(df["event_title"], df["total_registrations"], color="orange", edgecolor="black")
plt.title("Total Registrations by Event")
plt.xlabel("Event Title")
plt.ylabel("Registrations")
plt.xticks(rotation=45, ha="right")
plt.tight_layout()
plt.savefig("static/registrations_by_dept.png")
plt.close()

print("📊 Visualizations saved to /static/")

plt.figure(figsize=(5, 4))
plt.scatter(df["total_registrations"], df["total_collected"], color="purple", edgecolor="black")
plt.title("Revenue vs Registrations")
plt.xlabel("Total Registrations")
plt.ylabel("Total Collected (₹)")
plt.tight_layout()
plt.savefig("static/revenue_vs_registrations.png")
plt.close()

sorted_df = df.sort_values("total_collected", ascending=False)
plt.figure(figsize=(6, 3))
plt.plot(sorted_df["event_title"], sorted_df["total_collected"], marker="o", color="green")
plt.title("Revenue Trend by Event")
plt.xlabel("Event Title")
plt.ylabel("Total Collected (₹)")
plt.xticks(rotation=45, ha="right")
plt.tight_layout()
plt.savefig("static/revenue_trend.png")
plt.close()

top5 = df.sort_values("total_registrations", ascending=False).head(5)
plt.figure(figsize=(5, 3))
plt.barh(top5["event_title"], top5["total_registrations"], color="teal", edgecolor="black")
plt.title("Top 5 Events by Registrations")
plt.xlabel("Registrations")
plt.tight_layout()
plt.savefig("static/top5_registrations.png")
plt.close()

plt.figure(figsize=(4, 4))
plt.pie(df["total_collected"], labels=df["event_title"], autopct="%1.1f%%", startangle=140)
plt.title("Revenue Share by Event")
plt.tight_layout()
plt.savefig("static/revenue_share.png")
plt.close()

x = np.arange(len(df["event_title"]))
width = 0.35

plt.figure(figsize=(6, 4))
plt.bar(x - width/2, df["total_collected"], width, label="Revenue (₹)", color="skyblue", edgecolor="black")
plt.bar(x + width/2, df["total_registrations"], width, label="Registrations", color="orange", edgecolor="black")

plt.title("Revenue vs Registrations per Event")
plt.xlabel("Event Title")
plt.ylabel("Values")
plt.xticks(x, df["event_title"], rotation=45, ha="right")
plt.legend()
plt.tight_layout()
plt.savefig("static/revenue_vs_registrations_bar.png")
plt.close()




