import { assessmentConfig } from "@/lib/domain/assessmentConfig";
import { getFeedbackForBand } from "@/lib/domain/feedback";
import {
  AssessmentSubmissionInput,
  ComputedAssessmentResult,
  DimensionScore,
  ScoreBand,
} from "@/lib/domain/types";

function getBand(avgScore: number): ScoreBand {
  if (avgScore <= assessmentConfig.scoreBands.lowMax) {
    return "Low";
  }
  if (avgScore <= assessmentConfig.scoreBands.mediumMax) {
    return "Medium";
  }
  return "High";
}

export function computeAssessmentResult(
  payload: AssessmentSubmissionInput,
): ComputedAssessmentResult {
  const dimensionScores: DimensionScore[] = assessmentConfig.dimensions.map(
    (dimension) => {
      const questionIds = assessmentConfig.questions
        .filter((question) => question.dimensionId === dimension.id)
        .map((question) => question.id);

      const total = questionIds.reduce(
        (sum, questionId) => sum + payload.answers[questionId],
        0,
      );
      const avgScore = total / questionIds.length;
      const rounded = Number(avgScore.toFixed(2));
      const band = getBand(rounded);

      return {
        dimensionId: dimension.id,
        label: dimension.label,
        score: rounded,
        band,
        feedback: getFeedbackForBand(dimension, band),
      };
    },
  );

  const overallAverage =
    dimensionScores.reduce((sum, current) => sum + current.score, 0) /
    dimensionScores.length;
  const overallScore = Number(overallAverage.toFixed(2));

  return {
    name: payload.name,
    email: payload.email,
    overallScore,
    overallBand: getBand(overallScore),
    dimensionScores,
    submittedAtIso: new Date().toISOString(),
  };
}
