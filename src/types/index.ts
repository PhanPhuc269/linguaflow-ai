export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sentenceCount: number;
  topic: string;
  completed?: boolean;
  score?: number;
}

export interface Sentence {
  id: string;
  vietnamese: string;
  suggestedTranslation?: string;
  userTranslation?: string;
  feedback?: TranslationFeedback;
}

export interface TranslationFeedback {
  score: number;
  correctedTranslation: string;
  mistakes: Mistake[];
  explanation: string;
}

export interface Mistake {
  original: string;
  correction: string;
  type: 'grammar' | 'vocabulary' | 'word_order' | 'spelling';
  explanation: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  examples: string[];
  domainTag: string;
  partOfSpeech?: string;
  dateAdded: Date;
  sourceContext?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface HighlightMenuAction {
  label: string;
  icon: React.ReactNode;
  action: () => void;
}
