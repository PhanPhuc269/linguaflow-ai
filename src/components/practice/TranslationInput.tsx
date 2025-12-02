import { useState, useCallback, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HighlightMenu } from "./HighlightMenu";

interface TranslationInputProps {
  onSubmit: (translation: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function TranslationInput({ onSubmit, isLoading, disabled }: TranslationInputProps) {
  const [translation, setTranslation] = useState("");
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (translation.trim() && !isLoading && !disabled) {
      onSubmit(translation.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

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

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Bản dịch của bạn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative" onMouseUp={handleMouseUp}>
          <Textarea
            ref={textareaRef}
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập bản dịch tiếng Anh của bạn..."
            className="min-h-[120px] text-lg resize-none pr-12"
            disabled={isLoading || disabled}
          />
          <Button
            variant="hero"
            size="icon"
            className="absolute bottom-3 right-3"
            onClick={handleSubmit}
            disabled={!translation.trim() || isLoading || disabled}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Nhấn Enter để gửi, Shift+Enter để xuống dòng</span>
          <span>{translation.length} ký tự</span>
        </div>
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
