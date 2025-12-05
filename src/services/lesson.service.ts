import apiClient from "@/lib/api-client";
import { ApiResponse } from "@/types/api-respnse";
import type { Sentence, Lesson, Topic } from "@/types/index";

export const lessonService = {
  getUserTopics: async (): Promise<Topic[]> => {
    const response = await apiClient.get<ApiResponse<Topic[]>>(
      "lessons/topics"
    );
    return response.data.result;
  },

  getTopicsLessons: async (topicId: string): Promise<Lesson[]> => {
    const response = await apiClient.get<ApiResponse<Lesson[]>>(
      `lessons/topics/${topicId}/lessons`
    );
    return response.data.result;
  },

  getLessonContent: async (id: string): Promise<Sentence[]> => {
    const response = await apiClient.get<ApiResponse<{topic: string, sentences: Sentence[]}>>(`/lessons/${id}/content`);
    return response.data.result.sentences;
  },

  generateNewSentences: async (id: string): Promise<Sentence[]> => {
    const response = await apiClient.post<ApiResponse<{sentences: Sentence[]}>>(
      `/lessons/${id}/new-sentences`);
    return response.data.result.sentences;
  }
};
