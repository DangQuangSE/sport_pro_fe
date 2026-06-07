"use client";

import React from "react";
import { CheckCircle2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Step } from "@/types/product";

type StepDef = {
  id: Step;
  label: string;
  icon: LucideIcon;
};

type Props = {
  steps: StepDef[];
  activeStep: Step;
  completedSteps?: Set<Step>;
  onStepClick?: (step: Step) => void;
  variant?: "create" | "edit";
};

export function ProductStepper({ steps, activeStep, completedSteps, onStepClick, variant = "create" }: Props) {
  const isEdit = variant === "edit";

  return (
    <div className={cn(
      "flex items-center justify-between bg-surface border border-outline-variant",
      isEdit ? "p-6 rounded-[2rem] shadow-sm backdrop-blur-md" : "p-4 rounded-2xl"
    )}>
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = activeStep === step.id;
        const isDone = completedSteps?.has(step.id);

        const indicator = (
          <div className={cn("flex flex-col items-center gap-2 relative z-10", isEdit && "gap-3")}>
            <div className={cn(
              "flex items-center justify-center border-2 transition-all duration-300",
              isEdit ? "w-14 h-14 rounded-2xl" : "w-10 h-10 rounded-full",
              isActive
                ? (isEdit
                  ? "border-primary bg-primary text-on-primary shadow-xl shadow-primary/20"
                  : "border-primary bg-primary text-on-primary shadow-lg scale-110")
                : isDone
                  ? "border-success bg-success text-on-success"
                  : (isEdit
                    ? "border-outline-variant bg-surface-container text-on-surface-variant"
                    : "border-outline-variant bg-surface-variant text-on-surface-variant")
            )}>
              {isDone ? <CheckCircle2 size={isEdit ? 24 : 20} /> : <Icon size={isEdit ? 24 : 20} />}
            </div>
            <span className={cn(
              "font-bold uppercase",
              isEdit ? "text-[10px] tracking-[0.2em]" : "text-xs tracking-wider",
              isActive ? "text-primary" : "text-on-surface-variant"
            )}>{step.label}</span>
          </div>
        );

        return (
          <React.Fragment key={step.id}>
            {onStepClick ? (
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className="transition-all hover:scale-105"
              >
                {indicator}
              </button>
            ) : indicator}
            {idx < steps.length - 1 && (
              <div className={cn(
                "flex-grow h-[2px] bg-outline-variant relative",
                isEdit ? "mx-8 -top-4" : "mx-4 -top-3"
              )}>
                {!isEdit && (
                  <div className={cn("h-full bg-primary transition-all duration-500", isDone ? "w-full" : "w-0")} />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
