import os
from typing import Any, Dict, List

from openai import OpenAI


def generate_analytics(event: Dict[str, Any], finance: Dict[str, Any], registrations: List[Dict[str, Any]]):
    api_key = os.getenv("OPENAI_API_KEY")
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    basics = {
        "event_title": event.get("event_title"),
        "category": event.get("category"),
        "date": str(event.get("date")),
        "time": str(event.get("time")),
        "location": event.get("location"),
        "venue": event.get("venue"),
        "payment": event.get("payment"),
        "cashCollected": finance.get("cashCollected", 0) or 0,
        "onlineCollected": finance.get("onlineCollected", 0) or 0,
        "totalCollected": finance.get("totalCollected", 0) or 0,
        "registrations_count": len(registrations),
        "departments": {},
    }

    for r in registrations:
        dept = r.get("studentDept") or "Unknown"
        basics["departments"][dept] = basics["departments"].get(dept, 0) + 1

    def heuristic():
        insights = []
        if basics["totalCollected"] > 0:
            insights.append("Revenue was collected; compare to targets to assess performance.")
        else:
            insights.append("No revenue recorded; review payment setup and event goals.")
        if basics["registrations_count"] == 0:
            insights.append("No registrations; check outreach and timing.")
        else:
            top_dept = max(basics["departments"], key=basics["departments"].get)
            insights.append(f"Top participating department: {top_dept}.")
            if basics["registrations_count"] >= 50:
                insights.append("Strong attendance; consider larger venue or tiered pricing next time.")
        return {
            "summary": f"{basics['event_title']} had {basics['registrations_count']} registrations and collected {basics['totalCollected']} total.",
            "kpis": {
                "cash": basics["cashCollected"],
                "online": basics["onlineCollected"],
                "total": basics["totalCollected"],
                "registrations": basics["registrations_count"],
            },
            "insights": insights,
        }

    if not api_key:
        return heuristic()

    try:
        client = OpenAI(api_key=api_key)
        prompt = (
            "You are a concise analytics assistant. Given event info, finance totals, and registrations by department, "
            "produce: 1) a 2-3 sentence summary, 2) 3-5 bullet insights, 3) key KPIs as short labels."
        )
        content = {"event": basics}
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": str(content)},
            ],
            temperature=0.2,
        )
        text = resp.choices[0].message.content or ""
        return {
            "raw": text,
            "kpis": {
                "cash": basics["cashCollected"],
                "online": basics["onlineCollected"],
                "total": basics["totalCollected"],
                "registrations": basics["registrations_count"],
            },
            "summary": text.split("\n")[0][:400],
            "insights": [line.strip("- ") for line in text.split("\n") if line.strip().startswith("-")][:5],
        }
    except Exception:
        return heuristic()
