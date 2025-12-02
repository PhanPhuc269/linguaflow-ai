import { useState, useCallback, useRef } from "react";
import { CheckCircle, XCircle, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HighlightMenu } from "./HighlightMenu";
import { cn } from "@/lib/utils";
import type { TranslationFeedback, Mistake } from "@/types";

interface FeedbackPanelProps {
  feedback: TranslationFeedback | null;
  onNextSentence: () => void;
  isLoading?: boolean;
}

const mistakeTypeConfig = {
  grammar: { label: "Ngữ pháp", color: "bg-error text-error-foreground" },
  vocabulary: { label: "Từ vựng", color: "bg-secondary text-secondary-foreground" },
  word_order: { label: "Trật tự từ", color: "bg-warning text-foreground" },
  spelling: { label: "Chính tả", color: "bg-primary text-primary-foreground" },
};

function MistakeItem({ mistake }: { mistake: Mistake }) {
  const config = mistakeTypeConfig[mistake.type];
  
  return (
    <div className="p-3 rounded-lg bg-muted/50 space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge className={config.color} variant="secondary">
          {config.label}
        </Badge>
        <div className="flex items-center gap-2 text-sm">
          <span className="line-through text-error">{mistake.original}</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-success font-medium">{mistake.correction}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{mistake.explanation}</p>
    </div>
  );
}

export function FeedbackPanel({ feedback, onNextSentence, isLoading }: FeedbackPanelProps) {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      
      if (rect) {
        setSelectedText(text);
        setMenuPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
      }
    }
  }, []);

  const handleCloseMenu = () => {
    setMenuPosition(null);
    setSelectedText("");
  };

  if (isLoading) {
    return (
      <Card variant="accent">
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground animate-typing">
              AI đang đánh giá bản dịch của bạn...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!feedback) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-8 w-8" />
            <p>Nhập bản dịch và gửi để nhận phản hồi từ AI</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const scoreColor = feedback.score >= 80 
    ? "text-success" 
    : feedback.score >= 60 
      ? "text-secondary" 
      : "text-error";

  const ScoreIcon = feedback.score >= 80 
    ? CheckCircle 
    : feedback.score >= 60 
      ? AlertTriangle 
      : XCircle;

  return (
    <Card variant="accent" className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Phản hồi từ AI
          </CardTitle>
          <div className={cn("flex items-center gap-2", scoreColor)}>
            <ScoreIcon className="h-5 w-5" />
            <span className="text-2xl font-bold">{feedback.score}%</span>
          </div>
        </div>
        <Progress 
          value={feedback.score} 
          className={cn(
            "h-2 mt-2",
            feedback.score >= 80 && "[&>div]:bg-success",
            feedback.score >= 60 && feedback.score < 80 && "[&>div]:bg-secondary",
            feedback.score < 60 && "[&>div]:bg-error"
          )}
        />
      </CardHeader>
      
      <CardContent className="space-y-4" ref={containerRef} onMouseUp={handleMouseUp}>
        {/* Corrected Translation */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Bản dịch gợi ý</h4>
          <p className="sentence-text bg-success-light p-3 rounded-lg text-success select-text">
            {feedback.correctedTranslation}
          </p>
        </div>

        {/* Mistakes */}
        {feedback.mistakes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Lỗi cần sửa ({feedback.mistakes.length})
            </h4>
            <div className="space-y-2">
              {feedback.mistakes.map((mistake, index) => (
                <MistakeItem key={index} mistake={mistake} />
              ))}
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Giải thích</h4>
          <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg">
            {feedback.explanation}
          </p>
        </div>

        {/* Next Button */}
        <Button 
          variant="hero" 
          className="w-full mt-4" 
          size="lg"
          onClick={onNextSentence}
        >
          Câu tiếp theo
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>

      {menuPosition && selectedText && (
        <HighlightMenu
          position={menuPosition}
          selectedText={selectedText}
          onClose={handleCloseMenu}
        />
      )}
    </Card>
  );
}
