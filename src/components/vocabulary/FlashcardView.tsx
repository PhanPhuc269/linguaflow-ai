import { useState } from "react";
import { RotateCcw, Check, X, ArrowRight, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { VocabularyItem } from "@/types";

interface FlashcardViewProps {
  items: VocabularyItem[];
  onComplete: () => void;
}

export function FlashcardView({ items, onComplete }: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);

  const currentItem = items[currentIndex];
  const progress = ((currentIndex) / items.length) * 100;
  const isComplete = currentIndex >= items.length;

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrect((c) => c + 1);
    } else {
      setIncorrect((c) => c + 1);
    }
    setIsFlipped(false);
    setCurrentIndex((i) => i + 1);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrect(0);
    setIncorrect(0);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Chưa có từ vựng</h3>
        <p className="text-muted-foreground">
          Thêm từ vựng vào sổ tay để bắt đầu luyện tập
        </p>
      </div>
    );
  }

  if (isComplete) {
    const score = Math.round((correct / items.length) * 100);
    
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-success-light flex items-center justify-center mb-4">
          <Check className="h-10 w-10 text-success" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Hoàn thành!</h3>
        <p className="text-muted-foreground mb-4">
          Bạn đã hoàn thành {items.length} thẻ từ vựng
        </p>
        
        <div className="flex gap-8 mb-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-success">{correct}</p>
            <p className="text-sm text-muted-foreground">Đúng</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-error">{incorrect}</p>
            <p className="text-sm text-muted-foreground">Sai</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{score}%</p>
            <p className="text-sm text-muted-foreground">Điểm số</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Luyện lại
          </Button>
          <Button variant="hero" onClick={onComplete}>
            Hoàn tất
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Thẻ {currentIndex + 1} / {items.length}
          </span>
          <div className="flex gap-4">
            <span className="text-success">Đúng: {correct}</span>
            <span className="text-error">Sai: {incorrect}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <div 
        className="perspective-1000 cursor-pointer"
        onClick={handleFlip}
      >
        <Card 
          className={cn(
            "min-h-[300px] transition-all duration-500 transform-style-preserve-3d",
            isFlipped && "rotate-y-180"
          )}
          variant="elevated"
        >
          <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px]">
            {!isFlipped ? (
              <div className="text-center animate-fade-in">
                <p className="text-sm text-muted-foreground mb-4">Từ vựng</p>
                <h2 className="text-3xl font-bold mb-4">{currentItem.word}</h2>
                <p className="text-sm text-muted-foreground">
                  Nhấn để xem nghĩa
                </p>
              </div>
            ) : (
              <div className="text-center animate-fade-in">
                <p className="text-sm text-muted-foreground mb-4">Nghĩa</p>
                <h2 className="text-2xl font-semibold mb-4">{currentItem.meaning}</h2>
                {currentItem.examples[0] && (
                  <p className="text-muted-foreground italic">
                    "{currentItem.examples[0]}"
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          size="lg"
          className="border-error text-error hover:bg-error-light"
          onClick={() => handleAnswer(false)}
        >
          <X className="h-5 w-5 mr-2" />
          Chưa nhớ
        </Button>
        <Button 
          variant="success" 
          size="lg"
          onClick={() => handleAnswer(true)}
        >
          <Check className="h-5 w-5 mr-2" />
          Đã nhớ
        </Button>
      </div>
    </div>
  );
}
