import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MessageSquare,
  Book,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SentencePanel } from "@/components/practice/SentencePanel";
import { TranslationInput } from "@/components/practice/TranslationInput";
import { FeedbackPanel } from "@/components/practice/FeedbackPanel";
import { ChatBox } from "@/components/chat/ChatBox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Sentence, TranslationFeedback } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { lessonService } from "@/services/lesson.service";
import { practiceService } from "@/services/practice.service";

// const initialSentences: Sentence[] = [
//   {
//     id: "1",
//     vietnamese:
//       "Bệnh nhân cần được theo dõi huyết áp thường xuyên để phát hiện sớm các biến chứng tim mạch.",
//     suggestedTranslation:
//       "The patient needs regular blood pressure monitoring to detect early cardiovascular complications.",
//   },
//   {
//     id: "2",
//     vietnamese:
//       "Phương pháp điều trị này đã được chứng minh hiệu quả qua nhiều nghiên cứu lâm sàng.",
//     suggestedTranslation:
//       "This treatment method has been proven effective through numerous clinical studies.",
//   },
//   {
//     id: "3",
//     vietnamese:
//       "Tác dụng phụ của thuốc có thể bao gồm buồn nôn, chóng mặt và mệt mỏi.",
//     suggestedTranslation:
//       "Side effects of the medication may include nausea, dizziness, and fatigue.",
//   },
// ];

// const additionalSentences: Sentence[] = [
//   {
//     id: "4",
//     vietnamese:
//       "Xét nghiệm máu cho thấy nồng độ cholesterol của bệnh nhân vượt ngưỡng cho phép.",
//     suggestedTranslation:
//       "Blood tests show the patient's cholesterol levels exceed the permissible threshold.",
//   },
//   {
//     id: "5",
//     vietnamese:
//       "Bác sĩ khuyến cáo bệnh nhân nên tập thể dục đều đặn và duy trì chế độ ăn lành mạnh.",
//     suggestedTranslation:
//       "The doctor recommends that the patient exercise regularly and maintain a healthy diet.",
//   },
// ];

export default function Practice() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<TranslationFeedback | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [addSentenceOpen, setAddSentenceOpen] = useState(false);
  const [addRequest, setAddRequest] = useState("");
  const [isAddingSentences, setIsAddingSentences] = useState(false);

  const { data: fetchedSentences = [], isLoading } = useQuery<
    Sentence[],
    Error
  >({
    queryKey: ["lesson", lessonId, "sentences"],
    queryFn: async () => {
      const res = await lessonService.getLessonContent(lessonId);
      // normalize different possible shapes from service/interceptor
      if (Array.isArray(res)) return res;
      if ((res as any)?.sentences) return (res as any).sentences;
      if ((res as any)?.result) return (res as any).result;
      return [] as Sentence[];
    },
    enabled: !!lessonId,
  });

  // keep a safe current sentence and progress calculation
  const currentSentence = sentences[currentIndex] ??
    sentences[0] ?? {
      id: "",
      vietnamese: "",
      suggestedTranslation: "",
    };
  const progress = sentences.length
    ? ((currentIndex + 1) / sentences.length) * 100
    : 0;

  // when fetched sentences arrive, replace local sentences
  useEffect(() => {
    if (fetchedSentences && fetchedSentences.length) {
      setSentences(fetchedSentences);
      setCurrentIndex(0);
    }
  }, [fetchedSentences]);

  const handleSubmitTranslation = async (translation: string) => {
    setIsEvaluating(true);
    setFeedback(null);
    try {
      const req = {
        sentenceId: currentSentence.id,
        vietnameseSentence: currentSentence.vietnamese,
        englishTranslation: translation,
      };

      const result = await practiceService.evaluateTranslation(req);
      setFeedback(result);
    } catch (err) {
      const message =
        (err as any)?.message ||
        "Có lỗi khi đánh giá bản dịch. Vui lòng thử lại.";
      toast({ title: "Lỗi", description: message });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextSentence = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex((i) => i + 1);
      setFeedback(null);
    } else {
      navigate("/lessons");
    }
  };

  const handleAddSentences = async () => {
    if (!lessonId) {
      toast({ title: "Lỗi", description: "Không xác định bài học." });
      return;
    }

    setIsAddingSentences(true);
    try {
      const newSentences = await lessonService.generateNewSentences(lessonId);
      setSentences((prev) => [...prev, ...newSentences]);
      setAddSentenceOpen(false);
      setAddRequest("");
      toast({
        title: "Đã thêm câu mới",
        description: `${newSentences.length} câu mới đã được thêm vào bài học.`,
      });
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description:
          (err?.message as string) ||
          "Không thể tạo câu mới. Vui lòng thử lại.",
      });
    } finally {
      setIsAddingSentences(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {isLoading && (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate("/lessons")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-sm">Thuật ngữ Y khoa cơ bản</h1>
              <p className="text-xs text-muted-foreground">
                Bài học #{lessonId}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 flex-1 max-w-xs mx-4">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {currentIndex + 1}/{sentences.length}
            </span>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddSentenceOpen(true)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Thêm câu</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/vocabulary")}
            >
              <Book className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Từ vựng</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setChatOpen(true)}
            >
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
            disabled={currentIndex === sentences.length - 1}
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

      {/* Add Sentences Dialog */}
      <Dialog open={addSentenceOpen} onOpenChange={setAddSentenceOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Thêm câu mới
            </DialogTitle>
            <DialogDescription>
              Yêu cầu AI tạo thêm câu để luyện tập. Bạn có thể mô tả loại câu
              muốn thêm.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              value={addRequest}
              onChange={(e) => setAddRequest(e.target.value)}
              placeholder="VD: Thêm câu về chẩn đoán bệnh, thêm câu khó hơn về thuốc..."
              className="min-h-[100px]"
            />

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddRequest("Thêm 3 câu về chẩn đoán bệnh")}
              >
                Chẩn đoán
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setAddRequest("Thêm câu khó hơn về thuốc và liều lượng")
                }
              >
                Thuốc & liều
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setAddRequest("Thêm câu về giao tiếp với bệnh nhân")
                }
              >
                Giao tiếp
              </Button>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setAddSentenceOpen(false)}
              >
                Hủy
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                onClick={handleAddSentences}
                disabled={isAddingSentences}
              >
                {isAddingSentences ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm câu
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
