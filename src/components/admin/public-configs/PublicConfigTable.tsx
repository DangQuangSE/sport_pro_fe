"use client";

import React from "react";
import { Settings, Image as ImageIcon, ExternalLink, Check, X } from "lucide-react";
import { AdminActionButtons } from "@/components/admin/shared/AdminActionButtons";
import { PublicConfig } from "@/services/adminService";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";

interface PublicConfigTableProps {
  readonly configs: PublicConfig[];
  readonly isLoading: boolean;
  readonly onEdit: (config: PublicConfig) => void;
  readonly onDelete: (key: string) => void;
}

export function PublicConfigTable({ 
  configs, 
  isLoading, 
  onEdit, 
  onDelete 
}: PublicConfigTableProps) {
  const { t } = useTranslation();

  const renderValuePreview = (config: PublicConfig) => {
    const val = config.configValue || "";

    switch (config.configType) {
      case "COLOR":
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-md border border-outline-variant shadow-sm shrink-0" 
              style={{ backgroundColor: val }}
            />
            <span className="font-mono text-xs text-on-surface">{val || t("admin.publicConfigs.table.notConfigured")}</span>
          </div>
        );
      case "IMAGE":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md border border-outline-variant flex items-center justify-center bg-white overflow-hidden shadow-inner shrink-0">
              {val ? (
                <img src={val} alt="Preview" className="w-full h-full object-contain p-0.5" />
              ) : (
                <ImageIcon size={16} className="text-outline" />
              )}
            </div>
            {val ? (
              <a 
                href={val} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-primary hover:underline flex items-center gap-1 font-mono truncate max-w-[200px]"
              >
                {val}
                <ExternalLink size={12} />
              </a>
            ) : (
              <span className="text-xs text-on-surface-variant italic">{t("admin.publicConfigs.table.noImage")}</span>
            )}
          </div>
        );
      case "BOOLEAN":
        const isTrue = val.toLowerCase() === "true";
        return (
          <Badge variant={isTrue ? "success" : "secondary"} className="gap-1">
            {isTrue ? <Check size={12} /> : <X size={12} />}
            {isTrue ? "True" : "False"}
          </Badge>
        );
      case "NUMBER":
        return <span className="font-mono text-xs font-semibold bg-surface-variant/50 px-2 py-0.5 rounded">{val || "0"}</span>;
      default:
        return <span className="text-xs text-on-surface truncate max-w-[250px] inline-block">{val || t("admin.publicConfigs.table.emptyValue")}</span>;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "COLOR": return "warning";
      case "IMAGE": return "success";
      case "BOOLEAN": return "info";
      case "NUMBER": return "neutral";
      default: return "default";
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-variant/30">
            <TableHead className="w-[80px]">{t("admin.publicConfigs.table.id")}</TableHead>
            <TableHead>{t("admin.publicConfigs.table.key")}</TableHead>
            <TableHead>{t("admin.publicConfigs.table.type")}</TableHead>
            <TableHead>{t("admin.publicConfigs.table.value")}</TableHead>
            <TableHead>{t("admin.publicConfigs.table.description")}</TableHead>
            <TableHead className="text-right">{t("admin.publicConfigs.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : configs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-on-surface-variant italic">
                {t("admin.publicConfigs.table.empty")}
              </TableCell>
            </TableRow>
          ) : (
            configs.map((config) => (
              <TableRow key={config.id} className="group hover:bg-surface-variant/20 transition-colors">
                <TableCell className="font-mono text-xs text-on-surface-variant">
                  #{config.id}
                </TableCell>
                <TableCell className="font-bold text-xs font-mono text-on-surface select-all">
                  {config.configKey}
                </TableCell>
                <TableCell>
                  <Badge variant={getTypeBadgeVariant(config.configType) as any}>
                    {config.configType}
                  </Badge>
                </TableCell>
                <TableCell>
                  {renderValuePreview(config)}
                </TableCell>
                <TableCell className="text-on-surface-variant text-xs max-w-[200px] truncate">
                  {config.description || <span className="italic text-outline/60">{t("admin.publicConfigs.table.noDescription")}</span>}
                </TableCell>
                <TableCell className="text-right">
                  <AdminActionButtons
                    onEdit={() => onEdit(config)}
                    onDelete={() => onDelete(config.configKey)}
                    className="justify-end"
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
