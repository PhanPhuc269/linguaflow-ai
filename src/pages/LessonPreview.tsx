import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Sparkles, Send, Loader2, Check, RefreshCw, Languages, BookOpen, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProposedLesson {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  sentenceCount: number;
  sampleSentences: string[];
}

const difficultyConfig = {
  beginner: { label: "Cơ bản", color: "bg-success text-success-foreground" },
  intermediate: { label: "Trung bình", color: "bg-secondary text-secondary-foreground" },
  advanced: { label: "Nâng cao", color: "bg-primary text-primary-foreground" },
};

export default function LessonPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const topic = location.state?.topic || "Chủ đề chung";

  const [isRefining, setIsRefining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [refinementRequest, setRefinementRequest] = useState("");
  const [refinementCount, setRefinementCount] = useState(0);

  // Mock AI-proposed lessons
  const [proposedLessons, setProposedLessons] = useState<ProposedLesson[]>([
    {
      id: "1",
      title: `Thuật ngữ ${topic} cơ bản`,
      description: `Học các thuật ngữ ${topic.toLowerCase()} thường gặp trong giao tiếp và tài liệu chuyên ngành`,
      difficulty: "beginner",
      sentenceCount: 10,
      sampleSentences: [
        "Bệnh nhân cần được theo dõi huyết áp thường xuyên.",
        "Phương pháp điều trị này đã được chứng minh hiệu quả.",
      ],
    },
    {
      id: "2",
      title: `${topic} nâng cao - Phần 1`,
      description: `Các khái niệm và thuật ngữ nâng cao trong lĩnh vực ${topic.toLowerCase()}`,
      difficulty: "intermediate",
      sentenceCount: 12,
      sampleSentences: [
        "Nghiên cứu lâm sàng cho thấy kết quả khả quan.",
        "Tác dụng phụ của thuốc có thể bao gồm buồn nôn.",
      ],
    },
    {
      id: "3",
      title: `Văn bản chuyên ngành ${topic}`,
      description: `Luyện dịch các đoạn văn bản, báo cáo chuyên ngành ${topic.toLowerCase()}`,
      difficulty: "advanced",
      sentenceCount: 8,
      sampleSentences: [
        "Theo kết quả phân tích, tỷ lệ thành công đạt 95%.",
        "Quy trình này đòi hỏi sự chính xác cao trong từng bước.",
      ],
    },
  ]);

  const handleRefine = async () => {
    if (!refinementRequest.trim() || isRefining) return;

    setIsRefining(true);
    
    // Simulate AI refinement
    setTimeout(() => {
      setRefinementCount((c) => c + 1);
      setProposedLessons((prev) =>
        prev.map((lesson) => ({
          ...lesson,
          title: `${lesson.title} (Đã điều chỉnh ${refinementCount + 1})`,
        }))
      );
      setRefinementRequest("");
      setIsRefining(false);
    }, 2000);
  };

  const handleCreateLessons = async () => {
    setIsCreating(true);
    
    // Simulate lesson creation
    setTimeout(() => {
      setIsCreating(false);
      navigate("/lessons");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold text-sm">Xem trước bài học</h1>
              <p className="text-xs text-muted-foreground">Chủ đề: {topic}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Languages className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* AI Badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium animate-fade-in">
            <Sparkles className="h-4 w-4" />
            AI đã đề xuất {proposedLessons.length} bài học
          </div>
        </div>

        {/* Proposed Lessons */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Bài học được đề xuất
          </h2>
          
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {proposedLessons.map((lesson, index) => (
                <Card
                  key={lesson.id}
                  variant="elevated"
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={difficultyConfig[lesson.difficulty].color}>
                            {difficultyConfig[lesson.difficulty].label}
                          </Badge>
                          <Badge variant="outline">{lesson.sentenceCount} câu</Badge>
                        </div>
                        <CardTitle className="text-base">{lesson.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {lesson.description}
                        </CardDescription>
                      </div>
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary">
                        {index + 1}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">Câu mẫu:</p>
                    <div className="space-y-2">
                      {lesson.sampleSentences.map((sentence, i) => (
                        <p
                          key={i}
                          className="text-sm bg-muted/50 px-3 py-2 rounded-lg italic"
                        >
                          "{sentence}"
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Refinement Section */}
        <Card variant="glass" className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              Cần điều chỉnh? Yêu cầu AI sửa đổi
            </h3>
            <div className="flex gap-2">
              <Input
                value={refinementRequest}
                onChange={(e) => setRefinementRequest(e.target.value)}
                placeholder="VD: Thêm bài về thuật ngữ pháp lý, giảm độ khó..."
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleRefine()}
                disabled={isRefining}
              />
              <Button
                variant="outline"
                onClick={handleRefine}
                disabled={!refinementRequest.trim() || isRefining}
              >
                {isRefining ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            {refinementCount > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Đã điều chỉnh {refinementCount} lần
              </p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/")}
            disabled={isCreating}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Button
            variant="hero"
            size="lg"
            onClick={handleCreateLessons}
            disabled={isCreating}
            className="min-w-[200px]"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Đang tạo...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Tạo bài học
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
