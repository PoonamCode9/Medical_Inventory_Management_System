import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* ─────────────────────────────────────────────────────────────────────────────
   Brand colour palette (RGB)
───────────────────────────────────────────────────────────────────────────── */
const C = {
  primary:      [14, 165, 233],
  primaryDark:  [2,  132, 199],
  emerald:      [16, 185, 129],
  amber:        [245, 158, 11],
  rose:         [244, 63,  94],
  red:          [239, 68,  68],
  bgPage:       [15,  23,  42],
  bgCard:       [30,  41,  59],
  bgCardLight:  [51,  65,  85],
  border:       [71,  85, 105],
  white:        [255, 255, 255],
  textPrimary:  [248, 250, 252],
  textMuted:    [148, 163, 184],
};

/* ── helpers ─────────────────────────────────────────────────────────────── */
const setFill   = (doc, c) => doc.setFillColor(...c);
const setStroke = (doc, c) => doc.setDrawColor(...c);
const setFont   = (doc, c) => doc.setTextColor(...c);

function fmtCurrency(val) {
  if (!val && val !== 0) return '—';
  if (val >= 1_000_000) return `Rs.${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000)     return `Rs.${(val / 1_000).toFixed(2)}K`;
  return `Rs.${Number(val).toFixed(2)}`;
}

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

function shortDate(isoStr) {
  return new Date(isoStr + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function fmtTimestamp(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const CONTENT = PAGE_W - MARGIN * 2;

function addPage(doc) {
  doc.addPage();
  setFill(doc, C.bgPage);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');
  return MARGIN + 10;
}

function tableY(doc) {
  return (doc.lastAutoTable?.finalY ?? 0) + 6;
}

function sectionTitle(doc, y, title, num) {
  setFill(doc, C.primary);
  doc.roundedRect(MARGIN, y, 3, 7, 1, 1, 'F');
  setFont(doc, C.textPrimary);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`${num}  ${title}`, MARGIN + 6, y + 5.5);
  setStroke(doc, C.border);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, y + 9, PAGE_W - MARGIN, y + 9);
  return y + 14;
}

function statBox(doc, x, y, w, h, label, value, color) {
  setFill(doc, C.bgCard);
  doc.roundedRect(x, y, w, h, 3, 3, 'F');
  setFill(doc, color);
  doc.roundedRect(x, y, w, 2, 1, 1, 'F');
  setFont(doc, C.textPrimary);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(String(value), x + w / 2, y + h / 2 + 1, { align: 'center' });
  setFont(doc, C.textMuted);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text(label, x + w / 2, y + h - 3.5, { align: 'center' });
}

function progressBar(doc, x, y, w, h, pct, fillColor, bgColor = C.bgCardLight) {
  setFill(doc, bgColor);
  doc.roundedRect(x, y, w, h, h / 2, h / 2, 'F');
  if (pct > 0) {
    setFill(doc, fillColor);
    doc.roundedRect(x, y, Math.max(w * (pct / 100), h), h, h / 2, h / 2, 'F');
  }
}

function addFooter(doc, pageNum, total, generatedAt) {
  const y = PAGE_H - 8;
  setStroke(doc, C.border);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, y - 3, PAGE_W - MARGIN, y - 3);
  setFont(doc, C.textMuted);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('MediStock — Confidential Inventory Report', MARGIN, y);
  doc.text(`Generated: ${generatedAt}`, PAGE_W / 2, y, { align: 'center' });
  doc.text(`Page ${pageNum} of ${total}`, PAGE_W - MARGIN, y, { align: 'right' });
}

/* ── COVER PAGE ──────────────────────────────────────────────────────────── */
function drawCoverPage(doc, generatedAt) {
  setFill(doc, C.bgPage);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  // top band
  setFill(doc, C.primaryDark);
  doc.rect(0, 0, PAGE_W, 60, 'F');
  setFill(doc, C.primary);
  doc.rect(0, 42, PAGE_W, 28, 'F');

  // logo circle
  setFill(doc, C.white);
  doc.circle(PAGE_W / 2, 34, 13, 'F');
  setFont(doc, C.primaryDark);
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.text('M', PAGE_W / 2, 39, { align: 'center' });

  // title
  setFont(doc, C.white);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('MediStock', PAGE_W / 2, 77, { align: 'center' });
  setFont(doc, [186, 230, 253]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Medical Inventory Management System', PAGE_W / 2, 85, { align: 'center' });

  // report label
  setFill(doc, C.bgCard);
  doc.roundedRect(MARGIN, 98, CONTENT, 20, 3, 3, 'F');
  setFill(doc, C.primary);
  doc.roundedRect(MARGIN, 98, 4, 20, 2, 2, 'F');
  setFont(doc, C.textPrimary);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Inventory Analytics & Audit Report', MARGIN + 9, 110);

  // meta cards
  const metas = [
    { label: 'Report Type',   value: 'Full Analytics' },
    { label: 'Generated On',  value: generatedAt       },
    { label: 'Classification',value: 'Confidential'    },
  ];
  metas.forEach((m, i) => {
    const bx = MARGIN + i * (CONTENT / 3 + 1.5);
    const bw = CONTENT / 3 - 1;
    setFill(doc, C.bgCard);
    doc.roundedRect(bx, 130, bw, 20, 3, 3, 'F');
    setFont(doc, C.textMuted);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text(m.label.toUpperCase(), bx + bw / 2, 137, { align: 'center' });
    setFont(doc, C.textPrimary);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(m.value, bx + bw / 2, 145, { align: 'center' });
  });

  // TOC
  setFont(doc, C.textPrimary);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('TABLE OF CONTENTS', MARGIN, 166);
  setStroke(doc, C.border);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, 169, PAGE_W - MARGIN, 169);

  const sections = [
    '01  Executive Summary — Inventory KPIs',
    '02  Category Breakdown',
    '03  Supplier Distribution',
    '04  Stock Movement Analytics',
    '05  7-Day Daily Movement Trend',
    '06  Critical Low-Stock Alert',
    '07  Expiry Timeline',
    '08  Stock Adjustment Audit Log',
  ];
  sections.forEach((s, i) => {
    const ty = 175 + i * 9;
    setFill(doc, i % 2 === 0 ? C.bgCard : C.bgPage);
    doc.rect(MARGIN, ty - 4, CONTENT, 8, 'F');
    setFont(doc, C.textMuted);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(s, MARGIN + 3, ty + 0.5);
  });

  setFont(doc, C.textMuted);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'This report contains real-time data exported directly from the MediStock database.',
    PAGE_W / 2, PAGE_H - 12, { align: 'center' },
  );
}

/* ── SECTION 1: Executive Summary ────────────────────────────────────────── */
function drawSummary(doc, analytics) {
  let y = addPage(doc);
  y = sectionTitle(doc, y, 'Executive Summary — Inventory KPIs', '01');

  const stats = [
    { label: 'Total Medicines',   value: analytics?.totalMedicines  ?? 0, color: C.primary },
    { label: 'Low Stock',         value: analytics?.lowStockCount   ?? 0, color: C.amber   },
    { label: 'Expiring ≤30 Days', value: analytics?.expiringCount   ?? 0, color: C.rose    },
    { label: 'Expired',           value: analytics?.expiredCount    ?? 0, color: C.red     },
    { label: 'Inventory Value',   value: fmtCurrency(analytics?.totalInventoryValue ?? 0), color: C.emerald },
  ];
  const bw = (CONTENT - 4 * 3) / 5;
  stats.forEach((s, i) => statBox(doc, MARGIN + i * (bw + 3), y, bw, 28, s.label, s.value, s.color));
  y += 34;

  // insight tiles
  const net = (analytics?.totalStockIn ?? 0) - (analytics?.totalStockOut ?? 0);
  const insights = [
    { label: 'Total Stock IN',      value: (analytics?.totalStockIn  ?? 0).toLocaleString(), color: C.emerald },
    { label: 'Total Stock OUT',     value: (analytics?.totalStockOut ?? 0).toLocaleString(), color: C.rose    },
    { label: 'Net Stock Change',    value: (net >= 0 ? '+' : '') + net,                      color: net >= 0 ? C.emerald : C.rose },
    { label: 'Total Movements',     value: ((analytics?.totalStockIn ?? 0) + (analytics?.totalStockOut ?? 0)).toLocaleString(), color: C.primary },
  ];
  const iw = (CONTENT - 3 * 4) / 4;
  insights.forEach((ins, i) => {
    const ix = MARGIN + i * (iw + 4);
    setFill(doc, C.bgCard);
    doc.roundedRect(ix, y, iw, 18, 2, 2, 'F');
    setFill(doc, ins.color);
    doc.roundedRect(ix, y + 14, iw, 4, 1, 1, 'F');
    setFont(doc, C.textMuted);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text(ins.label, ix + iw / 2, y + 7, { align: 'center' });
    setFont(doc, C.textPrimary);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(ins.value, ix + iw / 2, y + 13, { align: 'center' });
  });
}

/* ── SECTION 2: Category Breakdown ──────────────────────────────────────── */
function drawCategories(doc, analytics) {
  let y = sectionTitle(doc, tableY(doc) + 10, 'Category Breakdown', '02');
  const cats = analytics?.categoryBreakdown || [];
  if (!cats.length) {
    setFont(doc, C.textMuted); doc.setFontSize(8);
    doc.text('No category data.', MARGIN, y);
    return;
  }
  const COLS = [
    [56,189,248],[129,140,248],[52,211,153],[251,146,60],[244,114,182],
    [167,139,250],[34,211,238],[250,204,21],[74,222,128],[248,113,113],
  ];
  const max = Math.max(...cats.map(c => c.count), 1);
  const rowH = 8.5;
  const barAreaW = 82;
  const labelW   = 52;

  cats.forEach((cat, i) => {
    if (y > PAGE_H - 30) { y = addPage(doc) + 4; }
    const pct   = (cat.count / max) * 100;
    const color = COLS[i % COLS.length];
    if (i % 2 === 0) {
      setFill(doc, C.bgCard);
      doc.roundedRect(MARGIN, y - 1.5, CONTENT, rowH, 1.5, 1.5, 'F');
    }
    setFill(doc, color);
    doc.circle(MARGIN + 3, y + 2.5, 2, 'F');
    setFont(doc, C.textPrimary);
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    doc.text(cat.categoryName, MARGIN + 8, y + 4);
    progressBar(doc, MARGIN + labelW, y + 1.5, barAreaW, 4, pct, color);
    setFont(doc, C.textPrimary);
    doc.setFontSize(7); doc.setFont('helvetica', 'bold');
    doc.text(String(cat.count), MARGIN + labelW + barAreaW + 5, y + 4.5);
    setFont(doc, C.textMuted);
    doc.setFontSize(6); doc.setFont('helvetica', 'normal');
    doc.text(`${pct.toFixed(0)}%`, MARGIN + labelW + barAreaW + 16, y + 4.5);
    y += rowH + 1;
  });
}

/* ── SECTION 3: Supplier Distribution ───────────────────────────────────── */
function drawSuppliers(doc, analytics) {
  const y = sectionTitle(doc, tableY(doc) + 10, 'Supplier Distribution', '03');
  const sups = analytics?.supplierBreakdown || [];
  if (!sups.length) {
    setFont(doc, C.textMuted); doc.setFontSize(8);
    doc.text('No supplier data.', MARGIN, y);
    return;
  }
  const COLS = [[129,140,248],[34,211,238],[244,114,182],[251,146,60],[167,139,250],[250,204,21]];
  const total  = sups.reduce((s, r) => s + r.count, 0) || 1;
  const maxCnt = Math.max(...sups.map(s => s.count), 1);

  autoTable(doc, {
    startY: y, margin: { left: MARGIN, right: MARGIN },
    head: [['#', 'Supplier', 'Medicines', 'Share', 'Proportion']],
    body: sups.map((s, i) => [i+1, s.supplierName, s.count, `${((s.count/total)*100).toFixed(1)}%`, '']),
    theme: 'plain',
    headStyles: { fillColor: C.bgCardLight, textColor: C.textMuted, fontStyle: 'bold', fontSize: 7, cellPadding: {top:3,bottom:3,left:4,right:4} },
    bodyStyles: { fillColor: C.bgCard, textColor: C.textPrimary, fontSize: 7.5, cellPadding: {top:3.5,bottom:3.5,left:4,right:4} },
    alternateRowStyles: { fillColor: C.bgPage },
    columnStyles: { 0:{cellWidth:8,halign:'center'}, 1:{cellWidth:55}, 2:{cellWidth:22,halign:'center'}, 3:{cellWidth:20,halign:'center'}, 4:{cellWidth:'auto'} },
    didDrawCell(data) {
      if (data.section === 'body' && data.column.index === 4) {
        progressBar(doc, data.cell.x+2, data.cell.y+(data.cell.height-3)/2, data.cell.width-4, 3,
          (sups[data.row.index].count/maxCnt)*100, COLS[data.row.index % COLS.length]);
      }
    },
  });
}

/* ── SECTION 4: Stock Movement Analytics ────────────────────────────────── */
function drawStockMovement(doc, analytics) {
  const y = sectionTitle(doc, tableY(doc) + 8, 'Stock Movement Analytics', '04');
  const stockIn  = analytics?.totalStockIn  ?? 0;
  const stockOut = analytics?.totalStockOut ?? 0;
  const total    = stockIn + stockOut;
  const net      = stockIn - stockOut;
  const inPct    = total > 0 ? Math.round((stockIn / total) * 100) : 0;

  const tw = (CONTENT - 3*4) / 4;
  const tiles = [
    { label: 'Units Received (IN)',   value: stockIn.toLocaleString(),                          color: C.emerald },
    { label: 'Units Dispensed (OUT)', value: stockOut.toLocaleString(),                         color: C.rose    },
    { label: 'Net Stock Change',      value: (net >= 0 ? '+' : '') + net.toLocaleString(),      color: net >= 0 ? C.emerald : C.rose },
    { label: 'Total Movements',       value: total.toLocaleString(),                            color: C.primary },
  ];
  tiles.forEach((t, i) => statBox(doc, MARGIN + i*(tw+4), y, tw, 22, t.label, t.value, t.color));

  let barY = y + 28;
  if (total === 0) {
    setFont(doc, C.textMuted); doc.setFontSize(8); doc.setFont('helvetica', 'italic');
    doc.text('No stock movements recorded yet.', MARGIN, barY + 4);
    return;
  }

  setFont(doc, C.textMuted); doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
  doc.text('STOCK IN vs OUT PROPORTION', MARGIN, barY);
  barY += 4;

  const barH = 8;
  setFill(doc, C.bgCardLight);
  doc.roundedRect(MARGIN, barY, CONTENT, barH, 4, 4, 'F');
  const inW = CONTENT * (inPct / 100);
  if (inW > 0) { setFill(doc, C.emerald); doc.roundedRect(MARGIN, barY, inW, barH, 4, 4, 'F'); }
  const outW = CONTENT * ((100-inPct) / 100);
  if (outW > 0) { setFill(doc, C.rose); doc.roundedRect(MARGIN+inW, barY, outW, barH, 4, 4, 'F'); }

  setFont(doc, C.emerald); doc.setFontSize(7); doc.setFont('helvetica', 'bold');
  doc.text(`IN  ${inPct}%`, MARGIN, barY + barH + 5);
  setFont(doc, C.rose);
  doc.text(`OUT  ${100-inPct}%`, PAGE_W-MARGIN, barY + barH + 5, { align: 'right' });
}

/* ── SECTION 5: 7-Day Trend ──────────────────────────────────────────────── */
function drawDailyTrend(doc, analytics) {
  const y = sectionTitle(doc, tableY(doc) + 16, '7-Day Daily Movement Trend', '05');
  const days = analytics?.dailyMovements || [];
  if (!days.length) {
    setFont(doc, C.textMuted); doc.setFontSize(8);
    doc.text('No movement data.', MARGIN, y);
    return;
  }
  autoTable(doc, {
    startY: y, margin: { left: MARGIN, right: MARGIN },
    head: [['Date', 'Day', 'Stock IN', 'Stock OUT', 'Net Change', 'Status']],
    body: days.map(d => {
      const net = d.stockIn - d.stockOut;
      const noAct = d.stockIn === 0 && d.stockOut === 0;
      return [
        shortDate(d.date),
        new Date(d.date+'T00:00:00').toLocaleDateString('en-IN',{weekday:'short'}),
        d.stockIn, d.stockOut,
        (net>=0?'+':'') + net,
        noAct ? 'No activity' : net>=0 ? '↑ Positive' : '↓ Negative',
      ];
    }),
    theme: 'plain',
    headStyles: { fillColor: C.bgCardLight, textColor: C.textMuted, fontStyle:'bold', fontSize:7, cellPadding:{top:3,bottom:3,left:4,right:4} },
    bodyStyles: { fillColor: C.bgCard, textColor: C.textPrimary, fontSize:7.5, cellPadding:{top:3.5,bottom:3.5,left:4,right:4} },
    alternateRowStyles: { fillColor: C.bgPage },
    columnStyles: { 0:{cellWidth:32}, 1:{cellWidth:20,halign:'center'}, 2:{cellWidth:25,halign:'center'}, 3:{cellWidth:25,halign:'center'}, 4:{cellWidth:28,halign:'center'}, 5:{cellWidth:'auto'} },
    didParseCell(data) {
      if (data.section !== 'body') return;
      const d   = days[data.row.index];
      const net = d.stockIn - d.stockOut;
      const noAct = d.stockIn === 0 && d.stockOut === 0;
      if (data.column.index === 2) data.cell.styles.textColor = C.emerald;
      if (data.column.index === 3) data.cell.styles.textColor = C.rose;
      if (data.column.index === 4) data.cell.styles.textColor = net >= 0 ? C.emerald : C.rose;
      if (data.column.index === 5) data.cell.styles.textColor = noAct ? C.textMuted : net >= 0 ? C.emerald : C.rose;
    },
  });
}

/* ── SECTION 6: Low-Stock ────────────────────────────────────────────────── */
function drawLowStock(doc, analytics) {
  const y = sectionTitle(doc, tableY(doc) + 8, 'Critical Low-Stock Alert', '06');
  const items = analytics?.topLowStockItems || [];
  if (!items.length) {
    setFont(doc, C.emerald); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.text('✓  All stock levels healthy — no medicines below the threshold.', MARGIN, y + 6);
    return;
  }
  autoTable(doc, {
    startY: y, margin: { left: MARGIN, right: MARGIN },
    head: [['#', 'Medicine Name', 'Category', 'Qty Remaining', 'Status', 'Stock Level']],
    body: items.map((item, i) => {
      const urgency = item.quantity === 0 ? 'OUT OF STOCK' : item.quantity <= 3 ? 'CRITICAL' : 'LOW';
      return [i+1, item.name, item.categoryName, item.quantity, urgency, ''];
    }),
    theme: 'plain',
    headStyles: { fillColor: [80,20,20], textColor: [254,202,202], fontStyle:'bold', fontSize:7, cellPadding:{top:3,bottom:3,left:4,right:4} },
    bodyStyles: { fillColor: C.bgCard, textColor: C.textPrimary, fontSize:7.5, cellPadding:{top:3.5,bottom:3.5,left:4,right:4} },
    alternateRowStyles: { fillColor: C.bgPage },
    columnStyles: { 0:{cellWidth:8,halign:'center'}, 1:{cellWidth:52}, 2:{cellWidth:38}, 3:{cellWidth:25,halign:'center'}, 4:{cellWidth:24,halign:'center'}, 5:{cellWidth:'auto'} },
    didParseCell(data) {
      if (data.section !== 'body') return;
      const qty = items[data.row.index].quantity;
      const color = qty === 0 ? C.red : qty <= 3 ? C.rose : C.amber;
      if (data.column.index === 3 || data.column.index === 4) {
        data.cell.styles.textColor = color;
        data.cell.styles.fontStyle = 'bold';
      }
    },
    didDrawCell(data) {
      if (data.section === 'body' && data.column.index === 5) {
        const qty   = items[data.row.index].quantity;
        const pct   = Math.min((qty / 10) * 100, 100);
        const color = qty === 0 ? C.red : qty <= 3 ? C.rose : C.amber;
        progressBar(doc, data.cell.x+2, data.cell.y+(data.cell.height-3)/2, data.cell.width-4, 3, pct, color);
      }
    },
  });
}

/* ── SECTION 7: Expiry Timeline ──────────────────────────────────────────── */
function drawExpiry(doc, expiringMeds) {
  const y = sectionTitle(doc, tableY(doc) + 8, 'Expiry Timeline (Next 30 Days)', '07');
  if (!expiringMeds?.length) {
    setFont(doc, C.emerald); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.text('✓  No medicines expiring within 30 days.', MARGIN, y + 6);
    return;
  }
  autoTable(doc, {
    startY: y, margin: { left: MARGIN, right: MARGIN },
    head: [['Medicine', 'Batch', 'Category', 'Supplier', 'Expiry Date', 'Days', 'Qty', 'Urgency']],
    body: expiringMeds.map(med => {
      const days    = daysUntil(med.expiryDate);
      const urgency = days <= 7 ? 'CRITICAL' : days <= 15 ? 'HIGH' : 'MEDIUM';
      return [med.name, med.batchNumber||'—', med.categoryName||'—', med.supplierName||'—', shortDate(med.expiryDate), days, med.quantity, urgency];
    }),
    theme: 'plain',
    headStyles: { fillColor: [60,20,20], textColor: [254,202,202], fontStyle:'bold', fontSize:6.5, cellPadding:{top:3,bottom:3,left:3,right:3} },
    bodyStyles: { fillColor: C.bgCard, textColor: C.textPrimary, fontSize:7, cellPadding:{top:3,bottom:3,left:3,right:3} },
    alternateRowStyles: { fillColor: C.bgPage },
    columnStyles: { 0:{cellWidth:38}, 1:{cellWidth:22}, 2:{cellWidth:25}, 3:{cellWidth:28}, 4:{cellWidth:24}, 5:{cellWidth:13,halign:'center'}, 6:{cellWidth:10,halign:'center'}, 7:{cellWidth:17,halign:'center'} },
    didParseCell(data) {
      if (data.section !== 'body') return;
      const days  = daysUntil(expiringMeds[data.row.index].expiryDate);
      const color = days <= 7 ? C.red : days <= 15 ? C.rose : C.amber;
      if (data.column.index === 5 || data.column.index === 7) {
        data.cell.styles.textColor = color;
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });
}

/* ── SECTION 8: Audit Log ────────────────────────────────────────────────── */
function drawAuditLog(doc, logs) {
  const y = addPage(doc);
  sectionTitle(doc, y, 'Stock Adjustment Audit Log', '08');
  if (!logs?.length) {
    setFont(doc, C.textMuted); doc.setFontSize(8);
    doc.text('No stock adjustments recorded yet.', MARGIN, tableY(doc) + 10);
    return;
  }
  autoTable(doc, {
    startY: tableY(doc) + 2, margin: { left: MARGIN, right: MARGIN },
    head: [['#', 'Medicine', 'Batch', 'Type', 'Qty', 'Reason', 'Adjusted By', 'Date & Time']],
    body: logs.map((log, i) => [
      i+1, log.medicineName, log.batchNumber||'—', log.movementType,
      (log.movementType==='IN'?'+':'-') + log.quantity,
      log.reason||'—', log.username, fmtTimestamp(log.timestamp),
    ]),
    theme: 'plain',
    headStyles: { fillColor: C.bgCardLight, textColor: C.textMuted, fontStyle:'bold', fontSize:6.5, cellPadding:{top:3,bottom:3,left:3,right:3} },
    bodyStyles: { fillColor: C.bgCard, textColor: C.textPrimary, fontSize:7, cellPadding:{top:3,bottom:3,left:3,right:3} },
    alternateRowStyles: { fillColor: C.bgPage },
    columnStyles: { 0:{cellWidth:7,halign:'center'}, 1:{cellWidth:35}, 2:{cellWidth:20}, 3:{cellWidth:13,halign:'center'}, 4:{cellWidth:14,halign:'center'}, 5:{cellWidth:38}, 6:{cellWidth:22}, 7:{cellWidth:'auto'} },
    didParseCell(data) {
      if (data.section !== 'body') return;
      const log = logs[data.row.index];
      if (data.column.index === 3 || data.column.index === 4) {
        data.cell.styles.textColor = log.movementType === 'IN' ? C.emerald : C.rose;
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────────────────── */
/**
 * Generates and downloads the full MediStock analytics PDF.
 * @param {object}  analytics    – Full AnalyticsDTO from /api/analytics
 * @param {Array}   expiringMeds – Expiring medicine list
 * @param {Array}   allLogs      – All stock log entries (fetched at full size)
 */
export async function exportReportAsPDF({ analytics, expiringMeds, allLogs }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const generatedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  // Dark background on page 1
  setFill(doc, C.bgPage);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  drawCoverPage(doc, generatedAt);
  drawSummary(doc, analytics);
  drawCategories(doc, analytics);
  drawSuppliers(doc, analytics);
  drawStockMovement(doc, analytics);
  drawDailyTrend(doc, analytics);
  drawLowStock(doc, analytics);
  drawExpiry(doc, expiringMeds);
  drawAuditLog(doc, allLogs);

  // Stamp footers on all pages
  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    addFooter(doc, i, total, generatedAt);
  }

  doc.save(`MediStock_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}
