import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Send,
  Loader2,
  Check,
  RefreshCw,
  Languages,
  BookOpen,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { topicService } from "@/services/topic.service";
import { ProposedLesson, TopicPlan } from "@/types";

const difficultyConfig = {
  beginner: { label: "Cơ bản", color: "bg-success text-success-foreground" },
  intermediate: {
    label: "Trung bình",
    color: "bg-secondary text-secondary-foreground",
  },
  advanced: { label: "Nâng cao", color: "bg-primary text-primary-foreground" },
  BEGINNER: { label: "Cơ bản", color: "bg-success text-success-foreground" },
  INTERMEDIATE: {
    label: "Trung bình",
    color: "bg-secondary text-secondary-foreground",
  },
  ADVANCED: { label: "Nâng cao", color: "bg-primary text-primary-foreground" },
};

// const generateMockLessons = (topic: string): ProposedLesson[] => [
//   {
//     id: "1",
//     title: `Thuật ngữ ${topic} cơ bản`,
//     description: `Học các thuật ngữ ${topic.toLowerCase()} thường gặp trong giao tiếp`,
//     difficulty: "beginner",
//     sentences: [
//       { id: "1-1", vietnamese: `${topic} là một lĩnh vực quan trọng trong thời đại hiện nay.` },
//       { id: "1-2", vietnamese: `Các chuyên gia ${topic.toLowerCase()} cần nắm vững kiến thức nền tảng.` },
//       { id: "1-3", vietnamese: `Thuật ngữ chuyên ngành giúp giao tiếp hiệu quả hơn.` },
//       { id: "1-4", vietnamese: `Việc học từ vựng chuyên ngành rất quan trọng.` },
//     ],
//   },
//   {
//     id: "2",
//     title: `${topic} nâng cao - Phần 1`,
//     description: `Các khái niệm và thuật ngữ nâng cao trong lĩnh vực ${topic.toLowerCase()}`,
//     difficulty: "intermediate",
//     sentences: [
//       { id: "2-1", vietnamese: `Phương pháp này đã được áp dụng rộng rãi trong ${topic.toLowerCase()}.` },
//       { id: "2-2", vietnamese: `Quy trình chuẩn đảm bảo chất lượng và hiệu quả công việc.` },
//       { id: "2-3", vietnamese: `Các tiêu chuẩn quốc tế ngày càng được chú trọng.` },
//       { id: "2-4", vietnamese: `Việc cập nhật kiến thức mới là điều cần thiết.` },
//       { id: "2-5", vietnamese: `Nghiên cứu cho thấy kết quả khả quan trong thử nghiệm.` },
//     ],
//   },
//   {
//     id: "3",
//     title: `Văn bản chuyên ngành ${topic}`,
//     description: `Luyện dịch các đoạn văn bản, báo cáo chuyên ngành`,
//     difficulty: "advanced",
//     sentences: [
//       { id: "3-1", vietnamese: `Theo kết quả phân tích, tỷ lệ thành công đạt 95%.` },
//       { id: "3-2", vietnamese: `Quy trình này đòi hỏi sự chính xác cao trong từng bước.` },
//       { id: "3-3", vietnamese: `Báo cáo nghiên cứu cho thấy xu hướng phát triển mới.` },
//     ],
//   },
// ];

export default function LessonPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const topic = location.state?.topic || "Chủ đề chung";

  const [isRefining, setIsRefining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [refinementRequest, setRefinementRequest] = useState("");
  const [proposedLessons, setProposedLessons] = useState<ProposedLesson[]>([]);
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);

  //useMutation

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  useEffect(() => {
    const fetchProposedLessons = async () => {
      const plan = await topicService.generateNewTopic(topic);
      //Lưu plan vào localstorage
      localStorage.setItem("plan", JSON.stringify(plan));
      setProposedLessons(plan.lessons);
    };
    fetchProposedLessons();
  }, [topic]);

  const handleRefine = async () => {
    if (!refinementRequest.trim() || isRefining) return;

    setIsRefining(true);
    const plan = await topicService.generateNewTopic(
      topic + " " + refinementRequest.trim()
    );
    localStorage.setItem("plan", JSON.stringify(plan));
    setProposedLessons(plan.lessons);
    setRefinementRequest("");
    setIsRefining(false);
    toast({
      title: "Đã cập nhật đề xuất",
      description: "AI đã điều chỉnh nội dung theo yêu cầu của bạn.",
    });
  };

  const handleCreateLessons = async () => {
    setIsCreating(true);
    // lấy topic và description từ localstorage
    const savedPlan = JSON.parse(localStorage.getItem("plan") || '""');
    try {
      await topicService.saveNewTopic(topic + " " + refinementRequest.trim(), savedPlan);
      toast({
        title: "Tạo bài học thành công!",
        description: `Đã tạo ${proposedLessons.length} bài học với tổng ${totalSentences} câu.`,
      });
      navigate("/lessons");
    } catch (error) {
      console.error("Lỗi khi lưu kế hoạch bài học:", error);
      toast({
        title: "Lỗi khi tạo bài học",
        description: "Đã có lỗi xảy ra khi lưu bài học. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
    setIsCreating(false);
  };

  const totalSentences = proposedLessons.reduce(
    (acc, l) => acc + l.sentences.length,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold text-sm">Xem trước bài học</h1>
              <p className="text-xs text-muted-foreground">Chủ đề: {topic}</p>
            </div>
          </div>
          <Badge variant="outline" className="hidden sm:flex">
            {proposedLessons.length} bài · {totalSentences} câu
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* AI Badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium animate-fade-in">
            <Sparkles className="h-4 w-4" />
            AI đã đề xuất {proposedLessons.length} bài học với {totalSentences}{" "}
            câu
          </div>
        </div>

        {/* Proposed Lessons */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Bài học được đề xuất
          </h2>

          <div className="space-y-3">
            {proposedLessons.map((lesson, index) => {
              const isExpanded = expandedLessons.includes(lesson.id);
              const difficulty =
                difficultyConfig[lesson.difficulty] ||
                difficultyConfig.intermediate;

              return (
                <Card
                  key={lesson.id}
                  variant="elevated"
                  className="animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Collapsible
                    open={isExpanded}
                    onOpenChange={() => toggleLesson(lesson.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors pb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge className={difficulty.color}>
                                {difficulty.label}
                              </Badge>
                              <Badge variant="outline">
                                {lesson.sentences.length} câu
                              </Badge>
                            </div>
                            <CardTitle className="text-base">
                              {lesson.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {lesson.description}
                            </CardDescription>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-3 pt-3">
                          Các câu trong bài học ({lesson.sentences.length} câu):
                        </p>
                        <div className="space-y-2">
                          {lesson.sentences.map((sentence, sIndex) => (
                            <div
                              key={sentence.id}
                              className="flex gap-3 p-3 rounded-lg bg-muted/30"
                            >
                              <span className="text-xs text-muted-foreground font-medium min-w-[24px]">
                                {sIndex + 1}.
                              </span>
                              <p className="text-sm flex-1">
                                {sentence.vietnamese}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
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
                placeholder="VD: Thêm bài về thuật ngữ pháp lý, giảm độ khó, thêm câu..."
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
                Tạo {proposedLessons.length} bài học
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
