import { computeAssessmentResult } from "@/lib/domain/scoring";
import { AssessmentApiResponse } from "@/lib/domain/types";
import {
  clearSubmissionPending,
  getCompletedSubmission,
  markSubmissionComplete,
  markSubmissionPending,
} from "@/lib/server/idempotency";
import { sendAssessmentEmail } from "@/lib/services/emailService";
import { generateReportPdf } from "@/lib/services/pdfService";
import { assessmentSubmissionSchema } from "@/lib/validation/assessmentSchema";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

function fromZodError(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = assessmentSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      const response: AssessmentApiResponse = {
        ok: false,
        error: "Please correct the highlighted fields.",
        fieldErrors: fromZodError(parsed.error),
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { idempotencyKey } = parsed.data;
    const existingResponse =
      getCompletedSubmission<AssessmentApiResponse>(idempotencyKey);
    if (existingResponse) {
      return NextResponse.json(existingResponse, { status: 200 });
    }

    const marked = markSubmissionPending(idempotencyKey);
    if (!marked) {
      const response: AssessmentApiResponse = {
        ok: false,
        error: "A matching submission is already in progress. Please wait a few seconds.",
      };
      return NextResponse.json(response, { status: 409 });
    }

    try {
      const result = computeAssessmentResult(parsed.data);
      const pdfBuffer = await generateReportPdf(result);

      try {
        await sendAssessmentEmail({ result, pdfBuffer });
        const response: AssessmentApiResponse = {
          ok: true,
          result,
          emailStatus: "sent",
        };
        markSubmissionComplete(idempotencyKey, response);
        return NextResponse.json(response, { status: 200 });
      } catch (error) {
        const response: AssessmentApiResponse = {
          ok: true,
          result,
          emailStatus: "failed",
          emailError:
            error instanceof Error
              ? error.message
              : "Email service is temporarily unavailable.",
        };
        markSubmissionComplete(idempotencyKey, response);
        return NextResponse.json(response, { status: 200 });
      }
    } catch (error) {
      clearSubmissionPending(idempotencyKey);
      const response: AssessmentApiResponse = {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to process your assessment right now.",
      };
      return NextResponse.json(response, { status: 500 });
    }
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid request payload.",
      } satisfies AssessmentApiResponse,
      { status: 400 },
    );
  }
}
