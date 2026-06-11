"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function AdminActionButtons({ onEdit, onDelete, className }: AdminActionButtonsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {onEdit && (
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={onEdit}>
          <Edit2 size={14} />
        </Button>
      )}
      {onDelete && (
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={onDelete}>
          <Trash2 size={14} />
        </Button>
      )}
    </div>
  );
}
