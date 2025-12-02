import { useState, useCallback, useEffect } from "react";
import type { VocabularyItem } from "@/types";

const STORAGE_KEY = "vocabulary-notebook";

// Mock data for demonstration
const mockVocabulary: VocabularyItem[] = [
  {
    id: "1",
    word: "sustainable",
    meaning: "bền vững, có thể duy trì được",
    examples: [
      "Sustainable development is crucial for future generations.",
      "We need to adopt sustainable practices in our daily lives.",
    ],
    domainTag: "Môi trường",
    partOfSpeech: "adjective",
    dateAdded: new Date("2024-01-15"),
  },
  {
    id: "2",
    word: "implement",
    meaning: "thực hiện, triển khai",
    examples: [
      "The company will implement the new policy next month.",
      "We need to implement these changes immediately.",
    ],
    domainTag: "Kinh doanh",
    partOfSpeech: "verb",
    dateAdded: new Date("2024-01-14"),
  },
  {
    id: "3",
    word: "renewable energy",
    meaning: "năng lượng tái tạo",
    examples: [
      "Renewable energy sources include solar and wind power.",
      "Many countries are investing in renewable energy.",
    ],
    domainTag: "Năng lượng",
    partOfSpeech: "noun",
    dateAdded: new Date("2024-01-13"),
  },
];

export function useVocabulary() {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setVocabulary(parsed.map((item: any) => ({
          ...item,
          dateAdded: new Date(item.dateAdded),
        })));
      } catch {
        setVocabulary(mockVocabulary);
      }
    } else {
      setVocabulary(mockVocabulary);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vocabulary));
    }
  }, [vocabulary, isLoading]);

  const addVocabulary = useCallback((item: Omit<VocabularyItem, "id">) => {
    const newItem: VocabularyItem = {
      ...item,
      id: Date.now().toString(),
    };
    setVocabulary((prev) => [newItem, ...prev]);
    return newItem;
  }, []);

  const removeVocabulary = useCallback((id: string) => {
    setVocabulary((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateVocabulary = useCallback((id: string, updates: Partial<VocabularyItem>) => {
    setVocabulary((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const getVocabularyByDomain = useCallback((domain: string) => {
    return vocabulary.filter((item) => item.domainTag === domain);
  }, [vocabulary]);

  const searchVocabulary = useCallback((query: string) => {
    const lowered = query.toLowerCase();
    return vocabulary.filter(
      (item) =>
        item.word.toLowerCase().includes(lowered) ||
        item.meaning.toLowerCase().includes(lowered)
    );
  }, [vocabulary]);

  return {
    vocabulary,
    isLoading,
    addVocabulary,
    removeVocabulary,
    updateVocabulary,
    getVocabularyByDomain,
    searchVocabulary,
  };
}
