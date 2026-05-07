import { ComputedAssessmentResult } from "@/lib/domain/types";

export function buildReportEmailHtml(result: ComputedAssessmentResult): string {
  const scoreRows = result.dimensionScores
    .map(
      (dimension) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${dimension.label}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${dimension.score}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${dimension.band}</td>
        </tr>
      `,
    )
    .join("");

  const feedbackBlocks = result.dimensionScores
    .map(
      (dimension) => `
        <h3 style="margin-bottom:6px;color:#111827;">${dimension.label}</h3>
        <p style="margin-top:0;margin-bottom:16px;color:#374151;line-height:1.5;">${dimension.feedback}</p>
      `,
    )
    .join("");

  return `
    <div style="max-width:680px;margin:0 auto;padding:24px;font-family:Arial,sans-serif;background:#f9fafb;">
      <h1 style="color:#111827;">Leadership Assessment Report</h1>
      <p style="color:#374151;">Hi ${result.name}, your assessment is complete.</p>
      <p style="color:#374151;">Overall score: <strong>${result.overallScore}</strong> (${result.overallBand})</p>

      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e7eb;margin:20px 0;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;background:#f3f4f6;">Dimension</th>
            <th style="text-align:left;padding:8px;background:#f3f4f6;">Score</th>
            <th style="text-align:left;padding:8px;background:#f3f4f6;">Band</th>
          </tr>
        </thead>
        <tbody>${scoreRows}</tbody>
      </table>

      ${feedbackBlocks}

      <p style="color:#6b7280;">A PDF copy of this report is attached.</p>
    </div>
  `;
}

export function buildReportPdfHtml(result: ComputedAssessmentResult): string {
  const dimensionSections = result.dimensionScores
    .map(
      (dimension) => `
      <section class="card">
        <h2>${dimension.label}</h2>
        <p><strong>Score:</strong> ${dimension.score} (${dimension.band})</p>
        <p>${dimension.feedback}</p>
      </section>
    `,
    )
    .join("");

  return `
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Leadership Assessment Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
        h1 { margin-bottom: 4px; }
        .meta { color: #4b5563; margin-bottom: 20px; }
        .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; margin-bottom: 12px; }
      </style>
    </head>
    <body>
      <h1>Leadership Assessment Report</h1>
      <p class="meta">Name: ${result.name}</p>
      <p class="meta">Email: ${result.email}</p>
      <p class="meta">Overall score: ${result.overallScore} (${result.overallBand})</p>
      ${dimensionSections}
    </body>
  </html>
`;
}
