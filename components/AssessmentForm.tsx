"use client";

import { assessmentConfig } from "@/lib/domain/assessmentConfig";
import {
  AssessmentApiResponse,
  AssessmentSubmissionInput,
} from "@/lib/domain/types";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { QuestionGroup } from "./QuestionGroup";

const EMPTY_FORM_ERROR = "Please complete all fields before submitting.";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeIdempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AssessmentForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const idempotencyKey = useMemo(() => makeIdempotencyKey(), []);

  function handleAnswerChange(questionId: string, value: number) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setFieldErrors((current) => {
      const copy = { ...current };
      delete copy[`answers.${questionId}`];
      return copy;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});

    if (isSubmitting) {
      return;
    }

    if (
      !name.trim() ||
      !email.trim() ||
      Object.keys(answers).length !== assessmentConfig.questions.length
    ) {
      setFormError(EMPTY_FORM_ERROR);
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setFieldErrors({ email: "Please enter a valid email address." });
      return;
    }

    setIsSubmitting(true);

    const payload: AssessmentSubmissionInput = {
      name: name.trim(),
      email: email.trim(),
      idempotencyKey,
      answers,
    };

    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as AssessmentApiResponse;

      if (!response.ok || !data.ok || !data.result) {
        setFormError(data.error ?? "Submission failed. Please try again.");
        setFieldErrors(data.fieldErrors ?? {});
        setIsSubmitting(false);
        return;
      }

      sessionStorage.setItem("assessment-result", JSON.stringify(data));
      router.push("/results");
    } catch {
      setFormError(
        "We could not reach the server. Please check your connection and try again.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Full name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Enter your name"
            required
          />
          {fieldErrors.name ? <span className="text-red-600">{fieldErrors.name}</span> : null}
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="name@example.com"
            required
          />
          {fieldErrors.email ? <span className="text-red-600">{fieldErrors.email}</span> : null}
        </label>
      </div>

      {assessmentConfig.dimensions.map((dimension) => (
        <section key={dimension.id} className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{dimension.label}</h2>
            <p className="text-sm text-slate-600">{dimension.description}</p>
          </div>
          {assessmentConfig.questions
            .filter((question) => question.dimensionId === dimension.id)
            .map((question) => (
              <QuestionGroup
                key={question.id}
                question={question}
                value={answers[question.id]}
                onChange={handleAnswerChange}
                error={fieldErrors[`answers.${question.id}`]}
              />
            ))}
        </section>
      ))}

      {formError ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Submitting..." : "Submit assessment"}
      </button>
    </form>
  );
}
