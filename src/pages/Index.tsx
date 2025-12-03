import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, BookOpen, Brain, MessageSquare, Loader2, ArrowRight, Zap, Target, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI Tạo Bài Học",
    description: "Tự động tạo bài dịch theo chủ đề chuyên ngành bạn muốn học",
  },
  {
    icon: Target,
    title: "Chấm Điểm Thông Minh",
    description: "AI đánh giá bản dịch, chỉ ra lỗi và gợi ý cách sửa chi tiết",
  },
  {
    icon: BookOpen,
    title: "Sổ Tay Từ Vựng",
    description: "Lưu từ vựng mới với nghĩa và ví dụ, ôn tập bằng flashcard",
  },
  {
    icon: MessageSquare,
    title: "Trợ Lý AI",
    description: "Hỏi đáp ngữ pháp, xin ví dụ, giải thích thuật ngữ chuyên ngành",
  },
];

export default function Index() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generating lesson proposals
    setTimeout(() => {
      setIsGenerating(false);
      navigate("/lesson-preview", { state: { topic: topic.trim() } });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Languages className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">TranslateAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" onClick={() => navigate("/lessons")}>Bài học</Button>
            <Button variant="ghost" onClick={() => navigate("/vocabulary")}>Từ vựng</Button>
            <Button variant="ghost" onClick={() => navigate("/history")}>Lịch sử</Button>
          </nav>
          <Button variant="outline" onClick={() => navigate("/login")}>Đăng nhập</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Học dịch chuyên ngành với AI
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight animate-slide-up">
              Luyện Dịch{" "}
              <span className="text-gradient-primary">Tiếng Anh</span>
              <br />
              Theo Chuyên Ngành
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
              AI tự động tạo bài dịch, chấm điểm và giải thích chi tiết. 
              Thêm từ vựng chỉ với một cú nhấp chuột.
            </p>

            {/* Topic Input */}
            <div className="max-w-xl mx-auto pt-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <div className="relative">
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Mô tả chủ đề bạn muốn học... (VD: Y khoa, Công nghệ thông tin, Pháp luật)"
                  className="h-14 pl-5 pr-32 text-base rounded-xl border-2 focus:border-primary"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
                <Button
                  variant="hero"
                  size="lg"
                  className="absolute right-2 top-2 h-10"
                  onClick={handleGenerate}
                  disabled={!topic.trim() || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Tạo bài học
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Nhập chủ đề chuyên ngành và AI sẽ tạo bộ bài dịch phù hợp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Tính Năng Nổi Bật</h2>
            <p className="text-muted-foreground">Công cụ học dịch toàn diện với sự hỗ trợ của AI</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                variant="elevated"
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card variant="glass" className="max-w-4xl mx-auto overflow-hidden">
            <div className="relative p-8 md:p-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    Bắt Đầu Học Ngay Hôm Nay
                  </h2>
                  <p className="text-muted-foreground">
                    Khám phá phương pháp học dịch hiệu quả với AI. 
                    Cải thiện kỹ năng dịch thuật của bạn mỗi ngày.
                  </p>
                </div>
                <Button variant="hero" size="xl" onClick={() => navigate("/lessons")}>
                  Khám phá bài học
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 TranslateAI. Ứng dụng luyện dịch tiếng Anh chuyên ngành.</p>
        </div>
      </footer>
    </div>
  );
}
