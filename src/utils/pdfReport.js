import jsPDF from 'jspdf';

const COLORS = {
  primary: [30, 58, 95],
  accent: [37, 99, 235],
  text: [17, 24, 39],
  textSecondary: [107, 114, 128],
  border: [229, 231, 235],
  positive: [22, 163, 74],
  negative: [220, 38, 38],
  bg: [249, 250, 251],
};

function drawHeader(doc, result) {
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, 210, 48, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Political Ideology Report', 20, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 20, 32);

  if (result.country) {
    doc.text(`Country: ${result.country}`, 20, 40);
  }
}

function drawScoreBox(doc, x, y, label, value, descriptor) {
  doc.setFillColor(...COLORS.bg);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(x, y, 80, 36, 3, 3, 'FD');

  doc.setTextColor(...COLORS.textSecondary);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(label.toUpperCase(), x + 40, y + 10, { align: 'center' });

  const color = value < 0 ? COLORS.negative : COLORS.positive;
  doc.setTextColor(...color);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(`${value > 0 ? '+' : ''}${value}`, x + 40, y + 24, { align: 'center' });

  doc.setTextColor(...COLORS.textSecondary);
  doc.setFontSize(8);
  doc.text(descriptor, x + 40, y + 32, { align: 'center' });
}

function drawRadarTable(doc, y, radarScores) {
  if (!radarScores || radarScores.length === 0) return y;

  doc.setTextColor(...COLORS.text);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Political Dimensions', 20, y);
  y += 8;

  for (const score of radarScores) {
    doc.setFillColor(...COLORS.bg);
    doc.rect(20, y, 170, 10, 'F');

    doc.setTextColor(...COLORS.text);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(score.dimension, 24, y + 7);

    // Bar
    const barWidth = 80;
    const barX = 90;
    doc.setFillColor(...COLORS.border);
    doc.rect(barX, y + 3, barWidth, 4, 'F');
    doc.setFillColor(...COLORS.accent);
    doc.rect(barX, y + 3, (score.value / 100) * barWidth, 4, 'F');

    doc.setTextColor(...COLORS.accent);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${score.value}`, 174, y + 7, { align: 'right' });

    y += 12;
  }

  return y;
}

function drawFigures(doc, y, closestFigures) {
  if (!closestFigures || closestFigures.length === 0) return y;

  doc.setTextColor(...COLORS.text);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Closest Historical Figures', 20, y);
  y += 8;

  for (let i = 0; i < closestFigures.length; i++) {
    const fig = closestFigures[i];
    doc.setFillColor(...COLORS.bg);
    doc.setDrawColor(...COLORS.border);
    doc.roundedRect(20, y, 170, 18, 2, 2, 'FD');

    doc.setTextColor(...COLORS.accent);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`#${i + 1}`, 26, y + 8);

    doc.setTextColor(...COLORS.text);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(fig.name, 40, y + 8);

    doc.setTextColor(...COLORS.textSecondary);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const dist = fig.distance != null ? `Distance: ${Math.round(fig.distance * 10) / 10}` : '';
    if (dist) doc.text(dist, 174, y + 8, { align: 'right' });

    if (fig.description) {
      const desc = doc.splitTextToSize(fig.description, 154);
      doc.text(desc[0], 26, y + 15);
    }

    y += 22;
  }

  return y;
}

function drawClusters(doc, y, clusters) {
  if (!clusters || clusters.length === 0) return y;

  const relevant = clusters.filter(c => c.probability > 0.01);
  if (relevant.length === 0) return y;

  doc.setTextColor(...COLORS.text);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Ideology Fit', 20, y);
  y += 8;

  for (const c of relevant) {
    const pct = Math.round(c.probability * 100);

    doc.setTextColor(...COLORS.text);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(c.name, 24, y + 5);

    doc.setFillColor(...COLORS.border);
    doc.rect(90, y + 1, 70, 4, 'F');

    const [r, g, b] = hexToRgb(c.color);
    doc.setFillColor(r, g, b);
    doc.rect(90, y + 1, (pct / 100) * 70, 4, 'F');

    doc.setTextColor(...COLORS.textSecondary);
    doc.setFontSize(9);
    doc.text(`${pct}%`, 174, y + 5, { align: 'right' });

    y += 9;
  }

  return y;
}

function drawTopIssues(doc, y, topIssues) {
  if (!topIssues || topIssues.length === 0) return y;

  doc.setTextColor(...COLORS.text);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Top Issues', 20, y);
  y += 8;

  for (let i = 0; i < topIssues.length; i++) {
    doc.setTextColor(...COLORS.textSecondary);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`${i + 1}. ${topIssues[i]}`, 24, y + 4);
    y += 8;
  }

  return y;
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

export function generatePDFReport(result) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  drawHeader(doc, result);

  // Cluster classification
  let y = 60;
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Your classification:', 20, y);

  const [cr, cg, cb] = result.clusterColor ? hexToRgb(result.clusterColor) : COLORS.accent;
  doc.setTextColor(cr, cg, cb);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(result.cluster || 'Unclassified', 20, y + 10);

  if (result.clusterDescription) {
    doc.setTextColor(...COLORS.textSecondary);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(result.clusterDescription, 170);
    doc.text(descLines, 20, y + 18);
    y += 18 + descLines.length * 4;
  } else {
    y += 16;
  }

  // Scores
  y += 6;
  drawScoreBox(doc, 20, y, 'Economic Score', result.economic, result.economic < 0 ? 'Left-leaning' : 'Right-leaning');
  drawScoreBox(doc, 110, y, 'Social Score', result.social, result.social < 0 ? 'Progressive' : 'Conservative');
  y += 44;

  // Radar
  y = drawRadarTable(doc, y, result.radarScores);
  y += 8;

  // Figures
  y = drawFigures(doc, y, result.closestFigures);

  // New page if needed
  if (y > 240) {
    doc.addPage();
    y = 20;
  } else {
    y += 8;
  }

  // Clusters
  y = drawClusters(doc, y, result.clusters);
  y += 8;

  // Top issues
  y = drawTopIssues(doc, y, result.topIssues);

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(...COLORS.textSecondary);
    doc.setFontSize(7);
    doc.text('Ideology Compass — ideologycompass.com', 20, 288);
    doc.text(`Page ${i} of ${pageCount}`, 190, 288, { align: 'right' });
  }

  doc.save(`ideology-report-${result.cluster?.toLowerCase().replace(/\s+/g, '-') || 'results'}.pdf`);
}
