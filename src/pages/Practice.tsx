import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageSquare, Book, ChevronLeft, ChevronRight, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SentencePanel } from "@/components/practice/SentencePanel";
import { TranslationInput } from "@/components/practice/TranslationInput";
import { FeedbackPanel } from "@/components/practice/FeedbackPanel";
import { ChatBox } from "@/components/chat/ChatBox";
import type { Sentence, TranslationFeedback } from "@/types";

const mockSentences: Sentence[] = [
  {
    id: "1",
    vietnamese: "Bệnh nhân cần được theo dõi huyết áp thường xuyên để phát hiện sớm các biến chứng tim mạch.",
    suggestedTranslation: "The patient needs regular blood pressure monitoring to detect early cardiovascular complications.",
  },
  {
    id: "2",
    vietnamese: "Phương pháp điều trị này đã được chứng minh hiệu quả qua nhiều nghiên cứu lâm sàng.",
    suggestedTranslation: "This treatment method has been proven effective through numerous clinical studies.",
  },
  {
    id: "3",
    vietnamese: "Tác dụng phụ của thuốc có thể bao gồm buồn nôn, chóng mặt và mệt mỏi.",
    suggestedTranslation: "Side effects of the medication may include nausea, dizziness, and fatigue.",
  },
];

export default function Practice() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<TranslationFeedback | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const currentSentence = mockSentences[currentIndex];
  const progress = ((currentIndex + 1) / mockSentences.length) * 100;

  const handleSubmitTranslation = async (translation: string) => {
    setIsEvaluating(true);
    
    // Simulate AI evaluation
    setTimeout(() => {
      const mockFeedback: TranslationFeedback = {
        score: Math.floor(Math.random() * 30) + 70,
        correctedTranslation: currentSentence.suggestedTranslation || "",
        mistakes: [
          {
            original: "blood pressure monitoring",
            correction: "blood pressure monitoring",
            type: "vocabulary",
            explanation: "Thuật ngữ 'theo dõi huyết áp' nên dịch là 'blood pressure monitoring'",
          },
          {
            original: "detect early",
            correction: "detect early",
            type: "word_order",
            explanation: "'Phát hiện sớm' dịch đúng là 'detect early' hoặc 'early detection of'",
          },
        ],
        explanation:
          "Bản dịch của bạn khá tốt! Bạn đã nắm được ý chính của câu. Hãy chú ý thêm về cách sử dụng thuật ngữ y khoa chuyên ngành để bản dịch tự nhiên hơn.",
      };
      setFeedback(mockFeedback);
      setIsEvaluating(false);
    }, 2000);
  };

  const handleNextSentence = () => {
    if (currentIndex < mockSentences.length - 1) {
      setCurrentIndex((i) => i + 1);
      setFeedback(null);
    } else {
      navigate("/lessons");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" onClick={() => navigate("/lessons")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-sm">Thuật ngữ Y khoa cơ bản</h1>
              <p className="text-xs text-muted-foreground">Bài học #{lessonId}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 flex-1 max-w-xs mx-4">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {currentIndex + 1}/{mockSentences.length}
            </span>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/vocabulary")}>
              <Book className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Từ vựng</span>
            </Button>
            <Button variant="default" size="sm" onClick={() => setChatOpen(true)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Hỏi AI</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Source & Input */}
          <div className="space-y-6">
            <SentencePanel
              title="Câu tiếng Việt"
              content={currentSentence.vietnamese}
              badge={`Câu ${currentIndex + 1}`}
              variant="vietnamese"
            />
            <TranslationInput
              onSubmit={handleSubmitTranslation}
              isLoading={isEvaluating}
              disabled={!!feedback}
            />
          </div>

          {/* Right Column - Feedback */}
          <div>
            <FeedbackPanel
              feedback={feedback}
              onNextSentence={handleNextSentence}
              isLoading={isEvaluating}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            disabled={currentIndex === 0}
            onClick={() => {
              setCurrentIndex((i) => i - 1);
              setFeedback(null);
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Câu trước
          </Button>
          <Button
            variant="outline"
            disabled={currentIndex === mockSentences.length - 1}
            onClick={() => {
              setCurrentIndex((i) => i + 1);
              setFeedback(null);
            }}
          >
            Câu sau
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </main>

      {/* Chat Box */}
      <ChatBox isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Chat Toggle Button (Mobile) */}
      <Button
        variant="hero"
        size="icon-lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg lg:hidden"
        onClick={() => setChatOpen(true)}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    </div>
  );
}
