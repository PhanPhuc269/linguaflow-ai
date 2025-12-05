import { Book, CheckCircle, Clock, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types";

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
}

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

export function LessonCard({ lesson, onClick }: LessonCardProps) {
  const difficulty =
    difficultyConfig[lesson.difficulty] || difficultyConfig.intermediate;
  const sentenceCount = lesson.totalSentences || lesson.sentenceCount || 0;

  return (
    <Card
      variant="interactive"
      className={cn(
        "group relative overflow-hidden",
        lesson.completed && "border-success/30"
      )}
      onClick={onClick}
    >
      {lesson.completed && (
        <div className="absolute top-3 right-3">
          <CheckCircle className="h-5 w-5 text-success" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
            {lesson.title}
          </CardTitle>
        </div>
        <CardDescription className="line-clamp-2 mt-1">
          {lesson.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={difficulty.color}>{difficulty.label}</Badge>
          <Badge variant="outline" className="gap-1">
            <Book className="h-3 w-3" />
            {sentenceCount} câu
          </Badge>
        </div>

        {lesson.score !== undefined && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Điểm số</span>
              <span className="font-semibold text-primary">
                {lesson.score}%
              </span>
            </div>
            <Progress value={lesson.score} className="h-2" />
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>~{Math.ceil(sentenceCount * 1.5)} phút</span>
          </div>
          {lesson.score && lesson.score >= 80 && (
            <div className="flex items-center gap-1 text-secondary">
              <Star className="h-4 w-4 fill-current" />
              <span>Xuất sắc</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
