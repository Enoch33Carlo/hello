// services/pdfGenerator.js
import PDFDocument from "pdfkit";

export async function generateEventPDFStream({ event, finance, registrations, analysisText, charts }, res) {
  // charts: { bar, pie, line } as Buffers
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  // stream directly to response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="EventReport_${sanitize(event.title)}.pdf"`);
  doc.pipe(res);

  // header
  doc.fontSize(22).text(`Event Report — ${event.title}`, { align: "center" });
  doc.moveDown();

  // event meta
  doc.fontSize(12).text(`Category: ${event.category || "N/A"}`);
  doc.text(`Date: ${formatDate(event.date)}`);
  doc.text(`Venue: ${event.venue || event.location || "N/A"}`);
  doc.moveDown();

  // charts
  if (charts.bar) {
    doc.fontSize(14).text("Financial Breakdown", { underline: true });
    doc.image(charts.bar, { fit: [500, 260], align: "center" });
    doc.moveDown();
  }

  if (charts.pie) {
    doc.fontSize(14).text("Payment Split", { underline: true });
    doc.image(charts.pie, { fit: [300, 200] });
    doc.moveDown();
  }

  // analysis (Gemini)
  doc.addPage();
  doc.fontSize(16).text("AI Analysis", { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(analysisText, { align: "justify" });

  // registrations table (simple)
  doc.addPage();
  doc.fontSize(14).text("Registrations", { underline: true });
  doc.moveDown();
  registrations.forEach((r, i) => {
    doc.fontSize(10).text(`${i+1}. ${r.studentName} — ${r.studentEmail} — ${r.studentDept || "N/A"}`);
  });

  doc.end();
}

// helper sanitize / formatDate omitted for brevity — implement simple replacements
