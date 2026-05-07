import { ComputedAssessmentResult } from "@/lib/domain/types";
import { buildReportPdfHtml } from "@/lib/services/templates/reportEmail";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function generateReportPdf(
  result: ComputedAssessmentResult,
): Promise<Buffer> {
  const isVercel = Boolean(process.env.VERCEL);
  const browser = isVercel
    ? await puppeteer.launch({
        headless: true,
        executablePath: await chromium.executablePath(),
        args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      })
    : await import("puppeteer").then((module) =>
        module.default.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        }),
      );

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
