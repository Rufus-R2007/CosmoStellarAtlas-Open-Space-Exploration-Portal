import { InsightEvidence, SourceReference } from '../../../types';

/**
 * Service to format and summarize audit evidence for explainable AI / deterministic algorithms.
 * Gives users and evaluation juries complete transparent visibility into how insights were derived.
 */
export class EvidenceExplanationService {
  /**
   * Generates a structured InsightEvidence audit structure.
   */
  public createEvidence(
    feature: 'briefing' | 'query' | 'recommendation',
    title: string,
    inputCriteria: string,
    rulesApplied: string[],
    recordsConsultedCount: number,
    sourceReferences: SourceReference[],
    algorithmicExplanation: string
  ): InsightEvidence {
    return {
      feature,
      title,
      inputCriteria,
      rulesApplied,
      recordsConsultedCount,
      sourceReferences,
      algorithmicExplanation,
    };
  }
}

export const evidenceExplanationService = new EvidenceExplanationService();

