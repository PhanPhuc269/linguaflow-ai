import { useEffect, useRef } from "react";
import { BookPlus, Languages, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useVocabulary } from "@/hooks/useVocabulary";

interface HighlightMenuProps {
  position: { x: number; y: number };
  selectedText: string;
  onClose: () => void;
}

export function HighlightMenu({ position, selectedText, onClose }: HighlightMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { addVocabulary } = useVocabulary();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => onClose();

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [onClose]);

  const handleAddVocabulary = () => {
    addVocabulary({
      word: selectedText,
      meaning: `Nghĩa của "${selectedText}"`,
      examples: [`Ví dụ với "${selectedText}"`],
      domainTag: "Chung",
      dateAdded: new Date(),
    });
    
    toast({
      title: "Đã thêm vào sổ từ vựng",
      description: `"${selectedText}" đã được lưu vào sổ từ vựng của bạn.`,
    });
    onClose();
  };

  const handleTranslate = () => {
    toast({
      title: "Dịch từ",
      description: `Đang dịch "${selectedText}"...`,
    });
    onClose();
  };

  const handleCreateExample = () => {
    toast({
      title: "Tạo ví dụ",
      description: `Đang tạo ví dụ với "${selectedText}"...`,
    });
    onClose();
  };

  const handleOpenChatbox = () => {
    toast({
      title: "Mở Chatbox",
      description: `Đang mở chatbox với "${selectedText}"...`,
    });
    onClose();
  };

  const menuActions = [
    { label: "Thêm vào Từ Vựng", icon: BookPlus, onClick: handleAddVocabulary, primary: true },
    { label: "Dịch", icon: Languages, onClick: handleTranslate },
    { label: "Ví dụ", icon: FileText, onClick: handleCreateExample },
    { label: "Chatbox", icon: MessageSquare, onClick: handleOpenChatbox },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 animate-scale-in"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="glass-card rounded-xl p-1.5 flex items-center gap-1 shadow-lg">
        {menuActions.map((action, index) => (
          <Button
            key={action.label}
            variant={action.primary ? "default" : "ghost"}
            size="sm"
            className="h-8 px-2.5 text-xs gap-1.5"
            onClick={action.onClick}
          >
            <action.icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{action.label}</span>
          </Button>
        ))}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top-full">
        <div className="w-2 h-2 bg-card border-b border-r border-border rotate-45 -mt-1" />
      </div>
    </div>
  );
}
