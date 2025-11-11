# generate_analysis_pdf.py

import matplotlib.pyplot as plt
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet

def create_charts(df, event_id: int):
    """
    Generates revenue and registration charts for a given event.
    Saves charts in 'static/' folder.
    """
    # Revenue chart
    plt.figure(figsize=(6,4))
    plt.bar(df["event_title"], df["total_collected"], color="skyblue")
    plt.title("Revenue by Event")
    plt.xticks(rotation=45)
    plt.tight_layout()
    revenue_path = f"static/revenue_{event_id}.png"
    plt.savefig(revenue_path)
    plt.close()

    # Registrations chart
    plt.figure(figsize=(6,4))
    plt.bar(df["event_title"], df["total_registrations"], color="orange")
    plt.title("Registrations by Event")
    plt.xticks(rotation=45)
    plt.tight_layout()
    registrations_path = f"static/registrations_{event_id}.png"
    plt.savefig(registrations_path)
    plt.close()

    return revenue_path, registrations_path


def build_analysis_pdf(charts: dict, title: str = "Data Analysis") -> bytes:
    """
    charts: dict {chart_title: chart_file_path}
    Returns PDF as bytes.
    """
    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4,
                            leftMargin=15*mm, rightMargin=15*mm,
                            topMargin=15*mm, bottomMargin=15*mm)
    
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph(title, styles["Title"]))
    story.append(Spacer(1, 10))

    for chart_title, chart_path in charts.items():
        story.append(Paragraph(chart_title, styles["Heading2"]))
        story.append(Spacer(1, 5))
        img = Image(chart_path, width=160*mm, height=90*mm)
        story.append(img)
        story.append(Spacer(1, 15))

    doc.build(story)
    pdf = buf.getvalue()
    buf.close()
    return pdf
