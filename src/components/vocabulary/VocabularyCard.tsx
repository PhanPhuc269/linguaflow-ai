import { Calendar, Tag, Trash2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VocabularyItem } from "@/types";

interface VocabularyCardProps {
  item: VocabularyItem;
  onView: () => void;
  onDelete: () => void;
}

export function VocabularyCard({ item, onView, onDelete }: VocabularyCardProps) {
  return (
    <Card variant="interactive" className="group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {item.word}
            </h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {item.meaning}
            </p>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon-sm" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={onDelete} className="text-error hover:text-error">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {item.examples.length > 0 && (
          <p className="text-sm text-muted-foreground mt-3 italic line-clamp-1 bg-muted/50 px-2 py-1 rounded">
            "{item.examples[0]}"
          </p>
        )}

        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <Badge variant="outline" className="text-xs">
              {item.domainTag}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(item.dateAdded).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
