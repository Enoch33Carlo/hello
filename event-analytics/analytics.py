# analytics.py
import os
import pandas as pd
import matplotlib.pyplot as plt
from sqlalchemy import create_engine
from urllib.parse import quote_plus

username = "root"
password = quote_plus("M@rtes2121")
database = "AI_Campus"
engine = create_engine(f"mysql+mysqlconnector://{username}:{password}@localhost/{database}")

def generate_event_visuals(event_id):
    os.makedirs("static", exist_ok=True)

    df = pd.read_sql(f"""
        SELECT e.id AS event_id, e.title AS event_title,
               COALESCE(SUM(f.cashCollected), 0) + COALESCE(SUM(f.onlineCollected), 0) AS total_collected,
               COUNT(r.id) AS total_registrations
        FROM events e
        LEFT JOIN finance f ON e.id = f.eventId
        LEFT JOIN registrations r ON e.id = r.eventId
        WHERE e.id = {event_id}
        GROUP BY e.id, e.title
    """, engine)

    if df.empty:
        print(f"❌ Event {event_id} not found")
        return

    event_title = df.iloc[0]["event_title"]

    # Overview chart
    plt.bar(["Revenue (₹)", "Registrations"],
            [df["total_collected"].iloc[0], df["total_registrations"].iloc[0]],
            color=["#66b3ff", "#ffb366"])
    plt.title(f"Overview – {event_title}")
    plt.tight_layout()
    plt.savefig(f"static/event_{event_id}_overview.png")
    plt.close()

    # Dept chart
    df_dept = pd.read_sql(f"""
        SELECT studentDept, COUNT(id) AS registrations
        FROM registrations
        WHERE eventId = {event_id}
        GROUP BY studentDept
    """, engine)

    if not df_dept.empty:
        plt.bar(df_dept["studentDept"], df_dept["registrations"], color="teal")
        plt.title(f"Registrations by Dept – {event_title}")
        plt.tight_layout()
        plt.savefig(f"static/event_{event_id}_registrations.png")
        plt.close()

    print(f"✅ Charts generated for event {event_id}: {event_title}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        generate_event_visuals(sys.argv[1])
    else:
        print("Usage: python analytics.py <event_id>")
