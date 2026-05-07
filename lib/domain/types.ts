export type DimensionId = "decisionMaking" | "teamCommunication" | "strategicThinking";

export type ScoreBand = "Low" | "Medium" | "High";

export interface Question {
  id: string;
  text: string;
  dimensionId: DimensionId;
}

export interface DimensionDefinition {
  id: DimensionId;
  label: string;
  description: string;
  lowFeedback: string;
  mediumFeedback: string;
  highFeedback: string;
}

export interface AssessmentConfig {
  dimensions: DimensionDefinition[];
  questions: Question[];
  scoreBands: {
    lowMax: number;
    mediumMax: number;
  };
}

export interface AssessmentSubmissionInput {
  name: string;
  email: string;
  idempotencyKey: string;
  answers: Record<string, number>;
}

export interface DimensionScore {
  dimensionId: DimensionId;
  label: string;
  score: number;
  band: ScoreBand;
  feedback: string;
}

export interface ComputedAssessmentResult {
  name: string;
  email: string;
  overallScore: number;
  overallBand: ScoreBand;
  dimensionScores: DimensionScore[];
  submittedAtIso: string;
}

export interface AssessmentApiResponse {
  ok: boolean;
  result?: ComputedAssessmentResult;
  emailStatus?: "sent" | "failed";
  emailError?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}
