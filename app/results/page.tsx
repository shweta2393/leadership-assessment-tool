"use client";

import { ResultCard } from "@/components/ResultCard";
import { AssessmentApiResponse } from "@/lib/domain/types";
import Link from "next/link";
import { useState } from "react";

export default function ResultsPage() {
  const [resultData] = useState<AssessmentApiResponse | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const raw = sessionStorage.getItem("assessment-result");
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AssessmentApiResponse;
    } catch {
      return null;
    }
  });

  if (!resultData?.result) {
    return (
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">No result available</h1>
        <p className="text-slate-600">
          Your browser does not have a saved result yet. Please submit the assessment first.
        </p>
        <Link href="/" className="text-sm font-semibold text-slate-900 underline">
          Go to assessment
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Your Leadership Assessment Results</h1>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-slate-700">
          Overall score: <strong>{resultData.result.overallScore}</strong> (
          {resultData.result.overallBand})
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Email status:{" "}
          {resultData.emailStatus === "sent"
            ? "Report emailed successfully."
            : "We scored your assessment, but email delivery failed. Please retry later."}
        </p>
        {resultData.emailStatus === "failed" && resultData.emailError ? (
          <p className="mt-1 text-sm text-red-600">Reason: {resultData.emailError}</p>
        ) : null}
      </div>
      <section className="grid gap-4">
        {resultData.result.dimensionScores.map((score) => (
          <ResultCard key={score.dimensionId} score={score} />
        ))}
      </section>
      <Link href="/" className="text-sm font-semibold text-slate-900 underline">
        Submit another response
      </Link>
    </main>
  );
}
