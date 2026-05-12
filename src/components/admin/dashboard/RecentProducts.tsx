import { cn } from '@/lib/utils';

export interface RecentProductsProps {
  dict: any;
  products?: any[];
}

export function RecentProducts({ dict, products = [] }: RecentProductsProps) {


  return (
    <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
        <h2 className="font-headline-sm text-headline-sm text-on-surface m-0">
          {dict.admin.dashboard.recentProducts}
        </h2>
        <button className="px-4 py-2 text-on-surface bg-surface border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors">
          {dict.admin.dashboard.viewAll}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface">
              <th className="py-4 px-6 font-label-sm text-label-sm uppercase text-outline tracking-wider border-b border-outline-variant">
                {dict.admin.dashboard.table.productId}
              </th>
              <th className="py-4 px-6 font-label-sm text-label-sm uppercase text-outline tracking-wider border-b border-outline-variant">
                {dict.admin.dashboard.table.productName}
              </th>
              <th className="py-4 px-6 font-label-sm text-label-sm uppercase text-outline tracking-wider border-b border-outline-variant">
                {dict.admin.dashboard.table.category}
              </th>
              <th className="py-4 px-6 font-label-sm text-label-sm uppercase text-outline tracking-wider border-b border-outline-variant">
                {dict.admin.dashboard.table.price}
              </th>
              <th className="py-4 px-6 font-label-sm text-label-sm uppercase text-outline tracking-wider border-b border-outline-variant">
                {dict.admin.dashboard.table.status}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-surface/50 transition-colors">
                <td className="py-4 px-6 font-label-md text-label-md text-on-surface">
                  {product.id}
                </td>
                <td className="py-4 px-6">
                  <div className="font-label-md text-label-md text-on-surface">{product.name}</div>
                </td>
                <td className="py-4 px-6 font-body-sm text-body-sm text-on-surface-variant">
                  {product.email}
                </td>
                <td className="py-4 px-6 font-label-md text-label-md text-on-surface">
                  {product.price}
                </td>
                <td className="py-4 px-6">
                  {product.status === 'active' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-green-100 text-green-800 border border-green-200">
                      {dict.admin.dashboard.table.active}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-error-container text-on-error-container border border-error/20">
                      {dict.admin.dashboard.table.inactive}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
