import { DimensionDefinition, ScoreBand } from "@/lib/domain/types";

export function getFeedbackForBand(
  dimension: DimensionDefinition,
  band: ScoreBand,
): string {
  if (band === "Low") {
    return dimension.lowFeedback;
  }
  if (band === "Medium") {
    return dimension.mediumFeedback;
  }
  return dimension.highFeedback;
}
