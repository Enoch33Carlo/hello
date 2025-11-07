# Event Analytics & PDF Reports

FastAPI app that fetches event, finance, and registrations from MySQL, generates AI analytics, and renders downloadable PDF reports per event.

## Prerequisites
- Python 3.10+
- MySQL server with database `AI_Campus`

## Setup
1. Create `.env` from example:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=YOUR_PASSWORD
   DB_NAME=AI_Campus
   OPENAI_API_KEY= # optional; if empty, fallback analytics are used
   OPENAI_MODEL=gpt-4o-mini
   ```
2. Install dependencies (preferably in a venv):
   ```bash
   python3 -m venv .venv
   . .venv/bin/activate
   pip install -r requirements.txt
   ```

## Run
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open http://localhost:8000 to view events. Click an event to see analytics and download the PDF.

## Notes
- Without `OPENAI_API_KEY`, analytics use simple heuristics.
- Tables expected:
  - `events(id, title, category, date, time, location, venue, payment, description)`
  - `finance(eventId, cashCollected, onlineCollected)`
  - `registrations(id, eventId, studentName, studentEmail, studentDept, regDate)`
