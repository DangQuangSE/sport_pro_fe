'use client';

import { cn } from '@/lib/utils';

export interface ProductFilterProps {
  dict: any;
  className?: string;
}

export function ProductFilter({ dict, className }: ProductFilterProps) {
  return (
    <aside className={cn("md:col-span-3 space-y-lg sticky top-28 h-fit hidden md:block", className)}>
      <div className="flex items-center justify-between border-b border-surface-variant pb-sm">
        <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wider">
          {dict.shop.filters}
        </h2>
        <button className="text-primary hover:text-primary-container text-label-md font-label-md uppercase transition-colors">
          {dict.shop.clearAll}
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-sm">
        <h3 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest">
          {dict.shop.category}
        </h3>
        <ul className="space-y-2">
          <li>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input defaultChecked className="form-checkbox h-5 w-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-surface bg-surface-container-lowest rounded-md" type="checkbox"/>
              <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Running Shoes</span>
            </label>
          </li>
          <li>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input className="form-checkbox h-5 w-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-surface bg-surface-container-lowest rounded-md" type="checkbox"/>
              <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">Training Gear</span>
            </label>
          </li>
          <li>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input className="form-checkbox h-5 w-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-surface bg-surface-container-lowest rounded-md" type="checkbox"/>
              <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">Apparel</span>
            </label>
          </li>
          <li>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input className="form-checkbox h-5 w-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-surface bg-surface-container-lowest rounded-md" type="checkbox"/>
              <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">Accessories</span>
            </label>
          </li>
        </ul>
      </div>

      {/* Brands */}
      <div className="space-y-sm pt-md border-t border-surface-variant">
        <h3 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest">
          {dict.shop.brand}
        </h3>
        <ul className="space-y-2">
          <li>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input defaultChecked className="form-checkbox h-5 w-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-surface bg-surface-container-lowest rounded-md" type="checkbox"/>
              <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">ProFit</span>
            </label>
          </li>
          <li>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input className="form-checkbox h-5 w-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-surface bg-surface-container-lowest rounded-md" type="checkbox"/>
              <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">Velocity</span>
            </label>
          </li>
          <li>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input className="form-checkbox h-5 w-5 text-primary border-outline-variant focus:ring-primary focus:ring-offset-surface bg-surface-container-lowest rounded-md" type="checkbox"/>
              <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">Apex</span>
            </label>
          </li>
        </ul>
      </div>

      {/* Size */}
      <div className="space-y-sm pt-md border-t border-surface-variant">
        <h3 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest">
          {dict.shop.size}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[7, 8, 9, 10, 11, 12, 13].map((s) => (
            <button 
              key={s}
              className={cn(
                "py-1 text-center font-label-md text-label-md transition-colors rounded-lg",
                s === 9 
                  ? "border-2 border-primary bg-primary text-on-primary"
                  : "border border-outline-variant text-on-surface hover:border-primary hover:text-primary"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-sm pt-md border-t border-surface-variant">
        <h3 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest">
          {dict.shop.priceRange}
        </h3>
        <div className="px-2">
          <div className="h-1 bg-surface-container-highest rounded-full relative mt-4 mb-6">
            <div className="absolute inset-y-0 left-1/4 right-1/4 bg-primary rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm cursor-pointer"></div>
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm cursor-pointer"></div>
          </div>
          <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
            <span>$50</span>
            <span>$250+</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
