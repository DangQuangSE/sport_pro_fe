import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

export interface ProductGridProps {
  dict: any;
  lang: string;
  className?: string;
  products: any[];
}

export function ProductGrid({ dict, lang, className, products = [] }: ProductGridProps) {


  return (
    <section className={cn("md:col-span-9 space-y-lg", className)}>
      {/* Top Actions: Mobile Filter & Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30">
        <div className="flex items-center gap-2">
          <button className="md:hidden flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-on-surface font-label-md text-label-md uppercase tracking-wider">
            <span className="material-symbols-outlined text-lg">tune</span> {dict.shop.filters}
          </button>
          <span className="text-on-surface-variant font-body-sm text-body-sm">
            {dict.shop.showing} <strong className="text-on-surface font-semibold">{products.length}</strong> {dict.shop.products}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap" htmlFor="sort">
            {dict.shop.sortBy}
          </label>
          <div className="relative w-full sm:w-48">
            <select 
              id="sort"
              className="block w-full pl-3 pr-10 py-2 text-base border-outline-variant focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface-container-lowest text-on-surface font-body-sm text-body-sm appearance-none cursor-pointer rounded-lg"
            >
              <option>{dict.shop.sortPopularity}</option>
              <option>{dict.shop.sortNewest}</option>
              <option>{dict.shop.sortPriceLowHigh}</option>
              <option>{dict.shop.sortPriceHighLow}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-gutter gap-y-xl">
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            {...product}
            lang={lang}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 pt-xl mt-xl border-t border-surface-variant">
        <button className="p-2 border border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed rounded-lg">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center font-label-lg text-label-lg bg-primary text-on-primary border border-primary rounded-lg">1</button>
        <button className="w-10 h-10 flex items-center justify-center font-label-lg text-label-lg bg-surface-container-lowest text-on-surface border border-outline-variant hover:border-primary hover:text-primary transition-colors rounded-lg">2</button>
        <button className="w-10 h-10 flex items-center justify-center font-label-lg text-label-lg bg-surface-container-lowest text-on-surface border border-outline-variant hover:border-primary hover:text-primary transition-colors rounded-lg">3</button>
        <span className="text-on-surface-variant px-2">...</span>
        <button className="w-10 h-10 flex items-center justify-center font-label-lg text-label-lg bg-surface-container-lowest text-on-surface border border-outline-variant hover:border-primary hover:text-primary transition-colors rounded-lg">8</button>
        <button className="p-2 border border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant transition-colors flex items-center justify-center rounded-lg">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </section>
  );
}
