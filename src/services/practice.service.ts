import apiClient from "@/lib/api-client";
import { ApiResponse } from "@/types/api-respnse";
import type { TranslationFeedback } from "@/types/index";

export type EvaluateTranslationRequest = {
  sentenceId: string;
  vietnameseSentence: string;
  englishTranslation: string;
};

export type EvaluateTranslationResponse = {
  score: number;
  correctedSentence: string;
  mistakes: Mistake[];
  explanations: string[];
};
export interface Mistake {
  segment: string;
  correction: string;
  type: 'grammar' | 'vocabulary' | 'word_order' | 'spelling';
  explanation: string;
}

export const practiceService = {
  evaluateTranslation: async (
    request: EvaluateTranslationRequest
  ): Promise<TranslationFeedback> => {
    const response = await apiClient.post<ApiResponse<any>>(
      `/practice/evaluate`,
      request
    );

    const res: any = response.data.result || {};

    const mapType = (t: string | undefined) => {
      if (!t) return "vocabulary" as const;
      const key = t.toLowerCase();
      if (key.includes("grammar") || key.includes("gram"))
        return "grammar" as const;
      if (key.includes("vocab") || key.includes("accuracy"))
        return "vocabulary" as const;
      if (
        key.includes("word") ||
        key.includes("order") ||
        key.includes("complet")
      )
        return "word_order" as const;
      if (key.includes("spell")) return "spelling" as const;
      return "vocabulary" as const;
    };
    
    const mistakes = (res.mistakes || []).map((m: any) => ({
      original: m.segment ?? m.original ?? "",
      correction: m.correction ?? m.correctionText ?? m.correction ?? "",
      type: mapType(m.type),
      explanation: m.explanation ?? m.reason ?? "",
    }));

    const explanation = Array.isArray(res.explanations)
      ? res.explanations.join(" ")
      : Array.isArray(res.explanation)
      ? res.explanation.join(" ")
      : (res.explanation as string) ?? "";

    const translationFeedback: TranslationFeedback = {
      score: typeof res.score === "number" ? res.score : Number(res.score) || 0,
      correctedTranslation:
        res.correctedTranslation ?? res.correctedSentence ?? "",
      mistakes,
      explanation,
    };

    return translationFeedback;
  },
};
