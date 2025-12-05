import apiClient from "@/lib/api-client";
import { ApiResponse } from "@/types/api-respnse";
import type { Topic, TopicPlan } from "@/types/index";

export const topicService = {
  generateNewTopic: async (topic: string): Promise<TopicPlan> => {
    const response = await apiClient.post<ApiResponse<TopicPlan>>(
      "lessons/plan",
      { topic }
    );

    const plan = response.data.result;

    // Normalize data
    if (plan.lessons) {
      plan.lessons = plan.lessons.map((lesson, lIndex) => ({
        ...lesson,
        id: lesson.id || `lesson-${Date.now()}-${lIndex}`,
        sentences:
          lesson.sentences?.map((sentence, sIndex) => ({
            ...sentence,
            id: sentence.id || `sentence-${Date.now()}-${lIndex}-${sIndex}`,
            suggestedTranslation:
              sentence.suggestedTranslation || (sentence as any).suggestedEn,
          })) || [],
      }));
    }

    return plan;
  },

  saveNewTopic: async (originalPrompt: string, topicPlan: TopicPlan): Promise<Topic> => {
    const response = await apiClient.post<ApiResponse<Topic>>(
      "lessons/plan/save",
      { originalPrompt, topicPlan }
    );

    return response.data.result;
  },
};
