"use client";

import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-surface rounded-[2rem] border border-outline-variant p-5 space-y-6 animate-pulse shadow-sm">
      <div className="aspect-[4/5] w-full rounded-2xl bg-surface-container-high relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>
      <div className="space-y-3">
        <div className="h-3 w-1/4 rounded bg-surface-container-high" />
        <div className="h-5 w-3/4 rounded bg-surface-container-high" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-1/3 rounded bg-surface-container-high" />
          <div className="h-8 w-1/4 rounded-xl bg-surface-container-high" />
        </div>
      </div>
    </div>
  );
}
