import { ComputedAssessmentResult } from "@/lib/domain/types";
import { buildReportPdfHtml } from "@/lib/services/templates/reportEmail";
import puppeteer from "puppeteer";

export async function generateReportPdf(
  result: ComputedAssessmentResult,
): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(buildReportPdfHtml(result), { waitUntil: "networkidle0" });
    const pdfData = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });
    return Buffer.from(pdfData);
  } finally {
    await browser.close();
  }
}
