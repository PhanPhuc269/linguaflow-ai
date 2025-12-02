import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HighlightMenu } from "./HighlightMenu";
import { cn } from "@/lib/utils";

interface SentencePanelProps {
  title: string;
  content: string;
  badge?: string;
  variant?: "vietnamese" | "english" | "feedback";
  highlights?: Array<{
    text: string;
    type: "error" | "correct" | "suggestion";
  }>;
  onWordSelect?: (word: string, position: { x: number; y: number }) => void;
}

export function SentencePanel({
  title,
  content,
  badge,
  variant = "vietnamese",
  highlights = [],
  onWordSelect,
}: SentencePanelProps) {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0 && containerRef.current) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      
      if (rect) {
        setSelectedText(text);
        setMenuPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
      }
    } else {
      setMenuPosition(null);
      setSelectedText("");
    }
  }, []);

  const handleCloseMenu = () => {
    setMenuPosition(null);
    setSelectedText("");
    window.getSelection()?.removeAllRanges();
  };

  const renderContent = () => {
    if (highlights.length === 0) {
      return <span>{content}</span>;
    }

    let result = content;
    highlights.forEach((h) => {
      const className = cn({
        "highlight-error": h.type === "error",
        "highlight-correct": h.type === "correct",
        "highlight-suggestion": h.type === "suggestion",
      });
      result = result.replace(
        h.text,
        `<span class="${className}">${h.text}</span>`
      );
    });

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <Card
      variant={variant === "feedback" ? "accent" : "default"}
      className="relative"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {badge && (
            <Badge variant="outline" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className={cn(
            "sentence-text select-text cursor-text",
            variant === "vietnamese" && "vietnamese-text"
          )}
          onMouseUp={handleMouseUp}
        >
          {renderContent()}
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
