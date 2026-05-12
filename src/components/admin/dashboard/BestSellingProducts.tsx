export interface BestSellingProductsProps {
  dict: any;
  products?: any[];
}

export function BestSellingProducts({ dict, products = [] }: BestSellingProductsProps) {


  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline-sm text-headline-sm text-on-surface m-0">
          {dict.admin.dashboard.bestSellers}
        </h2>
        <span className="material-symbols-outlined text-outline cursor-pointer">
          more_horiz
        </span>
      </div>
      
      <div className="space-y-5 flex-1">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 group">
            <div className="w-16 h-16 rounded-lg bg-surface flex-shrink-0 overflow-hidden border border-outline-variant">
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: `url('${product.image}')` }}
              ></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-label-md text-label-md text-on-surface truncate group-hover:text-primary transition-colors cursor-pointer">
                {product.name}
              </h3>
              <p className="font-body-sm text-body-sm text-outline truncate">{product.category}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="font-label-md text-label-md text-on-surface">{product.price}</span>
                <span className="font-label-sm text-label-sm text-primary bg-primary-fixed px-2 py-0.5 rounded">
                  {product.sold} đã bán
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-2.5 text-primary font-label-md text-label-md bg-primary-fixed/50 hover:bg-primary-fixed rounded-lg transition-colors border border-primary-fixed-dim">
        {dict.admin.dashboard.viewAll}
      </button>
    </div>
  );
}
