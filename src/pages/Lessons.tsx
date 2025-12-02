import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, BookOpen, Languages, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LessonCard } from "@/components/lesson/LessonCard";
import { Badge } from "@/components/ui/badge";
import type { Lesson } from "@/types";

const mockLessons: Lesson[] = [
  {
    id: "1",
    title: "Thuật ngữ Y khoa cơ bản",
    description: "Học các thuật ngữ y khoa thường gặp trong giao tiếp và tài liệu y tế",
    difficulty: "beginner",
    sentenceCount: 10,
    topic: "Y khoa",
    completed: true,
    score: 85,
  },
  {
    id: "2",
    title: "Công nghệ AI và Machine Learning",
    description: "Dịch các bài viết về trí tuệ nhân tạo và học máy",
    difficulty: "advanced",
    sentenceCount: 12,
    topic: "Công nghệ",
  },
  {
    id: "3",
    title: "Hợp đồng thương mại quốc tế",
    description: "Thuật ngữ pháp lý trong hợp đồng kinh doanh quốc tế",
    difficulty: "intermediate",
    sentenceCount: 8,
    topic: "Pháp luật",
    completed: true,
    score: 72,
  },
  {
    id: "4",
    title: "Báo cáo tài chính doanh nghiệp",
    description: "Học cách dịch các báo cáo tài chính và thuật ngữ kế toán",
    difficulty: "intermediate",
    sentenceCount: 10,
    topic: "Tài chính",
  },
  {
    id: "5",
    title: "Bài báo khoa học môi trường",
    description: "Dịch các nghiên cứu về biến đổi khí hậu và bảo vệ môi trường",
    difficulty: "advanced",
    sentenceCount: 15,
    topic: "Môi trường",
  },
  {
    id: "6",
    title: "Giao tiếp trong ngành du lịch",
    description: "Các tình huống giao tiếp phổ biến trong ngành du lịch và khách sạn",
    difficulty: "beginner",
    sentenceCount: 8,
    topic: "Du lịch",
  },
];

const topics = ["Tất cả", "Y khoa", "Công nghệ", "Pháp luật", "Tài chính", "Môi trường", "Du lịch"];

export default function Lessons() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Tất cả");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const filteredLessons = mockLessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === "Tất cả" || lesson.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const completedCount = mockLessons.filter((l) => l.completed).length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Languages className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">TranslateAI</span>
            </div>
            <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Button variant="default" className="w-full justify-start gap-2">
              <BookOpen className="h-4 w-4" />
              Bài học
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/vocabulary")}>
              <BookOpen className="h-4 w-4" />
              Sổ từ vựng
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/history")}>
              <BookOpen className="h-4 w-4" />
              Lịch sử
            </Button>
          </nav>

          {/* Progress */}
          <div className="p-4 border-t border-border">
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm font-medium mb-2">Tiến độ học tập</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-primary">{completedCount}</span>
                <span className="text-muted-foreground mb-1">/ {mockLessons.length} bài</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(completedCount / mockLessons.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="px-4 lg:px-8 h-16 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bài học..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-8">
          {/* Topic Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Badge
                key={topic}
                variant={selectedTopic === topic ? "default" : "outline"}
                className="cursor-pointer px-3 py-1 text-sm"
                onClick={() => setSelectedTopic(topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>

          {/* Lessons Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <LessonCard
                  lesson={lesson}
                  onClick={() => navigate(`/practice/${lesson.id}`)}
                />
              </div>
            ))}
          </div>

          {filteredLessons.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Không tìm thấy bài học phù hợp</p>
            </div>
          )}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
