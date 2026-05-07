import { DimensionScore } from "@/lib/domain/types";

export function ResultCard({ score }: { score: DimensionScore }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{score.label}</h3>
      <p className="mt-1 text-sm text-slate-600">
        Score: <strong>{score.score}</strong> ({score.band})
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-700">{score.feedback}</p>
    </article>
  );
}
