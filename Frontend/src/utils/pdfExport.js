import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Generate a PDF report with company branding, title, and a data table.
 *
 * @param {Object} options
 * @param {string} options.title         - Report title (e.g. "Current Stock Report")
 * @param {string} options.subtitle      - Optional subtitle / date range
 * @param {string[]} options.columns     - Column headers
 * @param {Array<Array<string|number>>} options.rows - Table rows (arrays of values)
 * @param {string} [options.filename]    - Output filename (default: "report.pdf")
 * @param {'landscape'|'portrait'} [options.orientation] - Page orientation
 */
export function generatePdf({ title, subtitle, columns, rows, filename = 'report.pdf', orientation = 'landscape' }) {
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14

  // ── Header bar ────────────────────────────────────────
  doc.setFillColor(11, 59, 111)   // #0b3b6f
  doc.rect(0, 0, pageWidth, 32, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('MediStock', margin, 16)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Pharmacy Management System', margin, 24)

  // ── Report Title ───────────────────────────────────────
  doc.setTextColor(11, 59, 111)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(title, margin, 48)

  if (subtitle) {
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(subtitle, margin, 56)
  }

  // ── Generation Info ────────────────────────────────────
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  doc.setTextColor(148, 163, 184)
  doc.setFontSize(8)
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, 48, { align: 'right' })

  // ── Table ──────────────────────────────────────────────
  const startY = subtitle ? 62 : 56

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [200, 200, 200],
      lineWidth: 0.25,
      textColor: [15, 23, 42],
    },
    headStyles: {
      fillColor: [11, 59, 111],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {},
  })

  // ── Footer ─────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text(
      `Page ${i} of ${pageCount} — MediStock Report`,
      margin,
      doc.internal.pageSize.getHeight() - 10
    )
  }

  doc.save(filename)
}

