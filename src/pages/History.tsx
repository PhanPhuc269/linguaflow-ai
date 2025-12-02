import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Search, Filter, ChevronDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  date: Date;
  lessonTitle: string;
  topic: string;
  vietnamese: string;
  userTranslation: string;
  correctedTranslation: string;
  score: number;
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    date: new Date("2024-01-15T14:30:00"),
    lessonTitle: "Thuật ngữ Y khoa cơ bản",
    topic: "Y khoa",
    vietnamese: "Bệnh nhân cần được theo dõi huyết áp thường xuyên.",
    userTranslation: "The patient needs to be monitored blood pressure regularly.",
    correctedTranslation: "The patient needs regular blood pressure monitoring.",
    score: 75,
  },
  {
    id: "2",
    date: new Date("2024-01-15T14:25:00"),
    lessonTitle: "Thuật ngữ Y khoa cơ bản",
    topic: "Y khoa",
    vietnamese: "Phương pháp điều trị này rất hiệu quả.",
    userTranslation: "This treatment method is very effective.",
    correctedTranslation: "This treatment method is highly effective.",
    score: 95,
  },
  {
    id: "3",
    date: new Date("2024-01-14T10:15:00"),
    lessonTitle: "Công nghệ AI",
    topic: "Công nghệ",
    vietnamese: "Trí tuệ nhân tạo đang thay đổi cách chúng ta làm việc.",
    userTranslation: "AI is changing how we work.",
    correctedTranslation: "Artificial intelligence is changing the way we work.",
    score: 85,
  },
];

function HistoryCard({ item }: { item: HistoryItem }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const scoreColor = item.score >= 80 ? "text-success" : item.score >= 60 ? "text-secondary" : "text-error";

  return (
    <Card variant="interactive" className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {item.topic}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {item.date.toLocaleDateString("vi-VN")} - {item.date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <CardTitle className="text-base font-medium line-clamp-1">
                  {item.vietnamese}
                </CardTitle>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn("text-xl font-bold", scoreColor)}>
                  {item.score}%
                </div>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            <div className="grid gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Bản dịch của bạn</p>
                <p className="text-sm bg-muted/30 p-2 rounded">{item.userTranslation}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Bản dịch gợi ý</p>
                <p className="text-sm bg-success-light p-2 rounded text-success">{item.correctedTranslation}</p>
              </div>
            </div>
            <Progress value={item.score} className={cn(
              "h-2",
              item.score >= 80 && "[&>div]:bg-success",
              item.score >= 60 && item.score < 80 && "[&>div]:bg-secondary",
              item.score < 60 && "[&>div]:bg-error"
            )} />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default function History() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = mockHistory.filter(
    (item) =>
      item.vietnamese.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const averageScore = Math.round(mockHistory.reduce((acc, item) => acc + item.score, 0) / mockHistory.length);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-semibold">Lịch Sử Dịch</h1>
            <p className="text-xs text-muted-foreground">{mockHistory.length} bản dịch</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{mockHistory.length}</p>
            <p className="text-sm text-muted-foreground">Tổng bản dịch</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-success">{averageScore}%</p>
            <p className="text-sm text-muted-foreground">Điểm TB</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-secondary">{mockHistory.filter((h) => h.score >= 80).length}</p>
            <p className="text-sm text-muted-foreground">Xuất sắc</p>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bản dịch..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {filteredHistory.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <HistoryCard item={item} />
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có lịch sử</h3>
            <p className="text-muted-foreground">Bắt đầu luyện dịch để xem lịch sử tại đây</p>
          </div>
        )}
      </main>
    </div>
  );
}
