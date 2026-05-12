import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  badge?: {
    type: 'sale' | 'new';
    label: string;
  };
  colors: string[];
  lang: string;
}

export function ProductCard({
  id,
  name,
  brand,
  price,
  originalPrice,
  image,
  rating,
  badge,
  colors,
  lang,
}: ProductCardProps) {
  return (
    <article className="group bg-surface-container-lowest border border-outline-variant/30 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col h-full rounded-xl">
      <Link href={`/${lang}/product/${id}`} className="block relative aspect-[4/5] overflow-hidden bg-surface-container-low">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${image}')` }}
        />
        
        {badge && (
          <div className={cn(
            "absolute top-3 left-3 font-label-sm text-label-sm uppercase px-2 py-1 tracking-wider font-bold rounded-lg",
            badge.type === 'sale' ? "bg-secondary-container text-on-secondary-container" : "bg-primary text-on-primary"
          )}>
            {badge.label}
          </div>
        )}
        
        <button 
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full text-on-surface-variant hover:text-error hover:bg-white transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <span className="material-symbols-outlined text-lg">favorite</span>
        </button>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
            {brand}
          </span>
          <div className="flex items-center text-secondary gap-1">
            <span className="material-symbols-outlined text-sm fill">star</span>
            <span className="font-label-sm text-label-sm">{rating}</span>
          </div>
        </div>
        
        <Link href={`/${lang}/product/${id}`}>
          <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        
        <div className="mt-auto flex justify-between items-end pt-4">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="font-body-sm text-body-sm text-on-surface-variant line-through">
                {originalPrice}
              </span>
            )}
            <span className={cn(
              "font-headline-md text-headline-md leading-none",
              originalPrice ? "text-error" : "text-on-surface"
            )}>
              {price}
            </span>
          </div>
          
          <div className="flex gap-1.5">
            {colors.map((color, index) => (
              <div 
                key={index}
                className={cn(
                  "w-5 h-5 rounded-lg border cursor-pointer transition-all",
                  index === 0 
                    ? "ring-1 ring-offset-1 ring-primary border-outline-variant/30" 
                    : "border-outline-variant/30 hover:border-outline"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
