'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface CartItemProps {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  color: string;
  size: string;
  initialQuantity: number;
  dict: any;
}

export function CartItem({
  id,
  name,
  category,
  price,
  image,
  color,
  size,
  initialQuantity,
  dict,
}: CartItemProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 flex flex-col sm:flex-row gap-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-primary-container transition-all rounded-xl">
      <div className="w-full sm:w-48 aspect-[4/5] bg-surface-container overflow-hidden rounded-lg">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="font-label-sm text-secondary uppercase mb-1 block">
              {category}
            </span>
            <h3 className="font-headline-sm text-headline-sm uppercase">
              {name}
            </h3>
          </div>
          <button className="text-outline hover:text-error transition-colors p-2 -mr-2 -mt-2">
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-1 font-label-md text-on-surface-variant uppercase">
          <span>{dict.cart.color}: {color}</span>
          <span>{dict.cart.size}: {size}</span>
        </div>
        
        <div className="mt-auto pt-6 flex items-center justify-between">
          <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
            <button 
              onClick={decrement}
              className="px-4 py-2 hover:bg-surface-container transition-colors active:scale-90 transform"
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <span className="px-4 font-headline-sm min-w-[3rem] text-center">
              {quantity}
            </span>
            <button 
              onClick={increment}
              className="px-4 py-2 hover:bg-surface-container transition-colors active:scale-90 transform"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
          <div className="font-headline-md text-headline-md">{price}</div>
        </div>
      </div>
    </div>
  );
}
