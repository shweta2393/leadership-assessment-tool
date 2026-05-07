import { assessmentConfig } from "@/lib/domain/assessmentConfig";
import { z } from "zod";

const answersShape = Object.fromEntries(
  assessmentConfig.questions.map((question) => [
    question.id,
    z
      .number("Answer must be a number.")
      .int("Answer must be a whole number.")
      .min(1, "Answer must be between 1 and 5.")
      .max(5, "Answer must be between 1 and 5."),
  ]),
);

export const assessmentSubmissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "Name is too long."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254, "Email is too long."),
  idempotencyKey: z
    .string()
    .trim()
    .min(10, "Missing request token.")
    .max(128, "Invalid request token."),
  answers: z.object(answersShape),
});

export type AssessmentSubmissionSchema = z.infer<typeof assessmentSubmissionSchema>;
