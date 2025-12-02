import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, BookOpen, Layers, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VocabularyCard } from "@/components/vocabulary/VocabularyCard";
import { FlashcardView } from "@/components/vocabulary/FlashcardView";
import { useVocabulary } from "@/hooks/useVocabulary";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { VocabularyItem } from "@/types";

export default function Vocabulary() {
  const navigate = useNavigate();
  const { vocabulary, removeVocabulary, searchVocabulary, isLoading } = useVocabulary();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [selectedItem, setSelectedItem] = useState<VocabularyItem | null>(null);

  const filteredVocabulary = searchQuery ? searchVocabulary(searchQuery) : vocabulary;
  const domains = [...new Set(vocabulary.map((v) => v.domainTag))];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-semibold">Sổ Tay Từ Vựng</h1>
            <p className="text-xs text-muted-foreground">{vocabulary.length} từ đã lưu</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="list" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Danh sách
              </TabsTrigger>
              <TabsTrigger value="flashcard" className="gap-2">
                <Layers className="h-4 w-4" />
                Flashcard
              </TabsTrigger>
            </TabsList>

            {activeTab === "list" && (
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm từ vựng..."
                  className="pl-10"
                />
              </div>
            )}
          </div>

          <TabsContent value="list" className="space-y-6 mt-0">
            {/* Domain Tags */}
            <div className="flex flex-wrap gap-2">
              {domains.map((domain) => (
                <Badge key={domain} variant="outline">
                  {domain} ({vocabulary.filter((v) => v.domainTag === domain).length})
                </Badge>
              ))}
            </div>

            {/* Vocabulary Grid */}
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredVocabulary.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVocabulary.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <VocabularyCard
                      item={item}
                      onView={() => setSelectedItem(item)}
                      onDelete={() => removeVocabulary(item.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Chưa có từ vựng</h3>
                <p className="text-muted-foreground mb-4">
                  Highlight từ trong bài dịch và chọn "Thêm vào Từ Vựng"
                </p>
                <Button onClick={() => navigate("/lessons")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Bắt đầu học
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="flashcard" className="mt-0">
            <div className="max-w-xl mx-auto">
              <FlashcardView
                items={vocabulary}
                onComplete={() => setActiveTab("list")}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Vocabulary Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedItem?.word}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Từ loại</p>
                <Badge variant="outline">{selectedItem.partOfSpeech || "N/A"}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nghĩa</p>
                <p className="text-lg">{selectedItem.meaning}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Ví dụ</p>
                <div className="space-y-2">
                  {selectedItem.examples.map((example, i) => (
                    <p key={i} className="text-sm italic bg-muted/50 p-2 rounded">
                      "{example}"
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <Badge>{selectedItem.domainTag}</Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    removeVocabulary(selectedItem.id);
                    setSelectedItem(null);
                  }}
                >
                  Xóa khỏi danh sách
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
