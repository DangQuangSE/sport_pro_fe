"use client";

import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

/** Shared shadcn-style indicator for actions; data regions use skeletons. */
export function Spinner({ className, size = 16, ...props }: React.ComponentProps<typeof LoaderCircle>) {
  const { t } = useTranslation();
  return <LoaderCircle role="status" aria-label={t("pageLoading.label")}
    size={size} className={cn("shrink-0 motion-safe:animate-spin", className)} {...props} />;
}
