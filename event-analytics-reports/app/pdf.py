from io import BytesIO
from typing import Any, Dict, List
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet


def build_pdf(event: Dict[str, Any], finance: Dict[str, Any], registrations: List[Dict[str, Any]], analytics: Dict[str, Any]) -> bytes:
    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=18 * mm, bottomMargin=18 * mm)

    styles = getSampleStyleSheet()
    story = []

    title = f"{event.get('event_title', 'Event')}"
    story.append(Paragraph(title, styles["Title"]))
    story.append(Spacer(1, 6))

    meta_rows = [
        ["Category", event.get("category", "")],
        ["Date", str(event.get("date", ""))],
        ["Time", str(event.get("time", ""))],
        ["Location", event.get("location", "")],
        ["Venue", event.get("venue", "")],
        ["Payment", event.get("payment", "")],
    ]
    meta_table = Table(meta_rows, hAlign="LEFT", colWidths=[30 * mm, 120 * mm])
    meta_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
        ("BOX", (0, 0), (-1, -1), 0.25, colors.grey),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.grey),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    kpis = analytics.get("kpis", {})
    kpi_rows = [
        ["Cash", str(kpis.get("cash", 0))],
        ["Online", str(kpis.get("online", 0))],
        ["Total", str(kpis.get("total", 0))],
        ["Registrations", str(kpis.get("registrations", 0))],
    ]
    kpi_table = Table(kpi_rows, hAlign="LEFT", colWidths=[40 * mm, 110 * mm])
    kpi_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.whitesmoke),
        ("BOX", (0, 0), (-1, -1), 0.25, colors.grey),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.grey),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(Paragraph("Key Metrics", styles["Heading2"]))
    story.append(kpi_table)
    story.append(Spacer(1, 10))

    summary = analytics.get("summary") or analytics.get("raw") or ""
    story.append(Paragraph("Summary", styles["Heading2"]))
    story.append(Paragraph(summary, styles["BodyText"]))
    story.append(Spacer(1, 10))

    insights = analytics.get("insights", [])
    if insights:
        story.append(Paragraph("Insights", styles["Heading2"]))
        for ins in insights:
            story.append(Paragraph(f"- {ins}", styles["BodyText"]))
        story.append(Spacer(1, 10))

    rows = [["Reg ID", "Name", "Email", "Department", "Reg Date"]]
    for r in registrations:
        rows.append([
            str(r.get("registration_id", "")),
            r.get("studentName", ""),
            r.get("studentEmail", ""),
            r.get("studentDept", ""),
            str(r.get("regDate", "")),
        ])
    reg_table = Table(rows, repeatRows=1, colWidths=[20*mm, 35*mm, 55*mm, 30*mm, 30*mm])
    reg_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
        ("BOX", (0, 0), (-1, -1), 0.25, colors.grey),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.grey),
    ]))

    story.append(Paragraph("Registrations", styles["Heading2"]))
    story.append(reg_table)

    doc.build(story)
    pdf = buf.getvalue()
    buf.close()
    return pdf
