import { ComputedAssessmentResult } from "@/lib/domain/types";
import { getServerEnv } from "@/lib/server/env";
import { buildReportEmailHtml } from "@/lib/services/templates/reportEmail";
import { Resend } from "resend";

export async function sendAssessmentEmail(params: {
  result: ComputedAssessmentResult;
  pdfBuffer: Buffer;
}) {
  const { resendApiKey, emailFrom } = getServerEnv();
  const resend = new Resend(resendApiKey);

  const { error } = await resend.emails.send({
    from: emailFrom,
    to: params.result.email,
    subject: `Your leadership assessment report, ${params.result.name}`,
    html: buildReportEmailHtml(params.result),
    attachments: [
      {
        filename: "leadership-assessment-report.pdf",
        content: params.pdfBuffer,
      },
    ],
  });

  if (error) {
    throw new Error(error.message);
  }
}
