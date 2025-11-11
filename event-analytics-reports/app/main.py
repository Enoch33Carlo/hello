import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from jinja2 import Environment, FileSystemLoader, select_autoescape
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error
from .ai import generate_analytics
from .pdf import build_pdf
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Ensure environment variables are loaded from project root, even if server started elsewhere
ENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(ENV_PATH)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Allow local dev frontends to call these APIs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://127.0.0.1", "http://localhost:3000", "http://localhost:5000", "http://localhost:6000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Environment(
    loader=FileSystemLoader(TEMPLATES_DIR),
    autoescape=select_autoescape(["html", "xml"]),
)

def get_db():
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "M@rtes2121"),
            database=os.getenv("DB_NAME", "AI_Campus"),
        )
        return conn
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")

@app.get("/", response_class=HTMLResponse)
def index():
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT id, title, category, date, time, location, venue, payment, description
            FROM events
            ORDER BY id
            """
        )
        events = cursor.fetchall()
    finally:
        conn.close()
    template = templates.get_template("index.html")
    return template.render(events=events)

@app.get("/events/{event_id}", response_class=HTMLResponse)
def event_detail(event_id: int):
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT
              e.id AS event_id,
              e.title AS event_title,
              e.category,
              e.date,
              e.time,
              e.location,
              e.venue,
              e.payment,
              e.description
            FROM events e
            WHERE e.id = %s
            """,
            (event_id,),
        )
        event = cursor.fetchone()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        cursor.execute(
            """
            SELECT cashCollected, onlineCollected,
                   (cashCollected + onlineCollected) AS totalCollected
            FROM finance
            WHERE eventId = %s
            """,
            (event_id,),
        )
        finance = cursor.fetchone() or {"cashCollected": 0, "onlineCollected": 0, "totalCollected": 0}

        cursor.execute(
            """
            SELECT id AS registration_id, studentName, studentEmail, studentDept, regDate
            FROM registrations
            WHERE eventId = %s
            ORDER BY regDate
            """,
            (event_id,),
        )
        registrations = cursor.fetchall()
    finally:
        conn.close()

    analytics = generate_analytics(event, finance, registrations)

    template = templates.get_template("event.html")
    return template.render(event=event, finance=finance, registrations=registrations, analytics=analytics)

@app.get("/events/{event_id}/report.pdf")
def event_report_pdf(event_id: int):
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT
              e.id AS event_id,
              e.title AS event_title,
              e.category,
              e.date,
              e.time,
              e.location,
              e.venue,
              e.payment,
              e.description
            FROM events e
            WHERE e.id = %s
            """,
            (event_id,),
        )
        event = cursor.fetchone()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")








        cursor.execute(
            """
            SELECT cashCollected, onlineCollected,
                   (cashCollected + onlineCollected) AS totalCollected
            FROM finance
            WHERE eventId = %s
            """,
            (event_id,),
        )
        finance = cursor.fetchone() or {"cashCollected": 0, "onlineCollected": 0, "totalCollected": 0}

        cursor.execute(
            """
            SELECT id AS registration_id, studentName, studentEmail, studentDept, regDate
            FROM registrations
            WHERE eventId = %s
            ORDER BY regDate
            """,
            (event_id,),
        )
        registrations = cursor.fetchall()
    finally:
        conn.close()

    analytics = generate_analytics(event, finance, registrations)
    pdf_bytes = build_pdf(event, finance, registrations, analytics)

    return StreamingResponse(iter([pdf_bytes]), media_type="application/pdf", headers={"Content-Disposition": f"inline; filename=event_{event_id}_report.pdf"})


# JSON API for integration with external frontends
@app.get("/api/events")
def api_events():
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT id, title, category, date, time, location, venue, payment, description
            FROM events
            ORDER BY id
            """
        )
        events = cursor.fetchall()
    finally:
        conn.close()
    return events


class ReportRequest(BaseModel):
    eventId: int


@app.post("/api/reports/generate")
def api_generate_report(payload: ReportRequest):
    event_id = payload.eventId
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT
              e.id AS event_id,
              e.title AS event_title,
              e.category,
              e.date,
              e.time,
              e.location,
              e.venue,
              e.payment,
              e.description
            FROM events e
            WHERE e.id = %s
            """,
            (event_id,),
        )
        event = cursor.fetchone()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        cursor.execute(
            """
            SELECT cashCollected, onlineCollected,
                   (cashCollected + onlineCollected) AS totalCollected
            FROM finance
            WHERE eventId = %s
            """,
            (event_id,),
        )
        finance = cursor.fetchone() or {"cashCollected": 0, "onlineCollected": 0, "totalCollected": 0}

        cursor.execute(
            """
            SELECT id AS registration_id, studentName, studentEmail, studentDept, regDate
            FROM registrations
            WHERE eventId = %s
            ORDER BY regDate
            """,
            (event_id,),
        )
        registrations = cursor.fetchall()
    finally:
        conn.close()

    analytics = generate_analytics(event, finance, registrations)
    pdf_bytes = build_pdf(event, finance, registrations, analytics)
    return StreamingResponse(iter([pdf_bytes]), media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=event_{event_id}_report.pdf"})
