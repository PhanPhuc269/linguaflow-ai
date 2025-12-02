import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Sparkles, HelpCircle, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const quickPrompts = [
  { label: "Giải thích từ này", icon: HelpCircle },
  { label: "Cho thêm ví dụ", icon: FileText },
  { label: "Giải thích ngữ pháp", icon: BookOpen },
];

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
        )}
      >
        {isUser ? "B" : <Sparkles className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-sm" 
            : "bg-muted text-foreground rounded-tl-sm"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs opacity-60 mt-1 block">
          {message.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

export function ChatBox({ isOpen, onClose, initialMessage }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Xin chào! Tôi là trợ lý AI. Tôi có thể giúp bạn giải thích ngữ pháp, cung cấp ví dụ, hoặc trả lời các câu hỏi về bài dịch. Bạn cần hỗ trợ gì?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState(initialMessage || "");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Đây là phản hồi cho: "${userMessage.content}"\n\nTôi sẽ giải thích chi tiết khi tích hợp AI thực sự. Hiện tại, đây là phản hồi mẫu để minh họa giao diện chat.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-full sm:w-[400px] z-50 animate-slide-in-right">
      <div className="h-full bg-card border-l border-border shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">AI Trợ lý</h3>
              <p className="text-xs text-muted-foreground">Luôn sẵn sàng hỗ trợ</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-border">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickPrompts.map((prompt) => (
              <Button
                key={prompt.label}
                variant="outline"
                size="sm"
                className="flex-shrink-0 text-xs"
                onClick={() => handleQuickPrompt(prompt.label)}
              >
                <prompt.icon className="h-3 w-3 mr-1" />
                {prompt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Nhập câu hỏi của bạn..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              variant="hero"
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
