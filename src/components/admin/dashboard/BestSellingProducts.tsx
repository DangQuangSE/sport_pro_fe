export interface BestSellingProductsProps {
  dict: any;
}

export function BestSellingProducts({ dict }: BestSellingProductsProps) {
  const products = [
    {
      id: '1',
      name: 'Pro Racer X1 - Đỏ/Đen',
      category: 'Giày chạy bộ Nam',
      price: '₫3,200,000',
      sold: '420',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHQb2GRIncbG4uF0wpKfuS7kVj_ij6noTxZ1wdq5zcC1h6XF7jHh1n4QUpuM93s8op8r_5djsNlC333EzH0pdIWBluaxoqYdQ0oU7VOnbFk7c0Ex5YPin7yDOM0NOeyFqQ8rFwfF1nnlKJVaSyG1xMEdfH7Ag1O7zNdwVgb71Pbro5_B6Lmyr3ke4Q0Z8ocYmiPG5lj9j0qaWvWCRJ_7Jckb-vSZsTvNILSru5DMBaXQDR_exEntBn4QkRo0sU3iMbCLKbEJAcUmU'
    },
    {
      id: '2',
      name: 'Áo thun TechFit Pro',
      category: 'Quần áo Nam',
      price: '₫850,000',
      sold: '385',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkomHkGOvNO-7k3NAtcMCRba2YT9NB30Ox-Er4xCV2Kh36zv7DD_6F1WXvx2KTltnDpUHCNZ9vepK4LeBNuwG6QzIlBh1jgwPvaUHThLwicA1083rFUkhyIo9LeLZxm2jnDSFtZ0CUzDw_M88no2Ppi0bCZ0tXAI7jnzjnVgK8KsRvf9Oy7_YCfYwUXbGJVFhXh5Pu5U3h2aPw8LoiS1rb3nkuJtIolPvewJEGAmP8MMt6FbldxdjxbJffIttQH_9FcrqqgfogWlE'
    },
    {
      id: '3',
      name: 'Bình nước thể thao 1L',
      category: 'Phụ kiện',
      price: '₫350,000',
      sold: '290',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8DThB7Tjd2M7A-F0nccRAl00iEHqs5vtA86KZPOVQhAw2olw10JcI2SEEvMcWF25tL_I-ozLWLrcpdz8HqhdLoLW7uhZmzUw0MKE0P3KnUGgRgNLgjNtiE9rXPjQ_OQp_G6mSW-bTCMDDWl2XFAZnetqDNprdHw6X2I92mgMqFjDca69vzbtNG_7RJuydAsKXdqYE-B0t5gQbCHGKKrmCKeU12_8pN55nObEAeFfP4GRNHiWDeXwK680bdLNDjUClo8DWAXC9fvU'
    },
    {
      id: '4',
      name: 'Speedster Lite - Xanh lá',
      category: 'Giày chạy bộ Nữ',
      price: '₫2,900,000',
      sold: '150',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXp6ucCkuWT9f5MSOTMJ75DMQI8CfZnLysugvyxQCsHviAdHrP0t4Yf30g5RRrKWB_dCEvP_bSmozmK5oc0utypVSd34sNtMTaAtSsDf6eIyrh5T36byYxB88OykKdMo3P6AGiB_VJq8AzBczleCJhWF4xQf04ekJyhoGKN8ZL8VT_V8L0jz0O2PHcvUPX2ydkQFihMshRLQyW1CbCANfzXmUz9QQrl22vLrQo9_NX8TQx1reVoNGoL5KNeXZS1IZ3nd6R8p0u-Zw'
    }
  ];

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
