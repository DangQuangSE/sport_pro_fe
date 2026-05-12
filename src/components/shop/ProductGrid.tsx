import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

export interface ProductGridProps {
  dict: any;
  lang: string;
  className?: string;
}

export function ProductGrid({ dict, lang, className }: ProductGridProps) {
  // Mock data for the products grid
  const products = [
    {
      id: 'prod-1',
      name: 'Pro Glide Running Shoes',
      brand: 'Velocity',
      price: '$99.00',
      originalPrice: '$120.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWpWAFuph8buLwJKtHm4T6rJu2y7Ovmc5JZ8TApBoHFsOlG7zCnRCoXbylz5u02XD8-Zn_q09CuhqiPfn7XpX0Zr1dpL15ffphFvW9iFzWZP0BC3myBXcyP-1ZotM2mH_nGVXwyGGo1ikdQIFTm44RfPj1FWrzjTwBWCBtxl-CwAmemhA5jEoGTojTFQgTSuSpLD81jVbigEiF86Ya_xQM3V2F6xxAEMGx1J8rjndnTGLQqfoDT3OvXiX_tojarFNZ4hJTcr5GJP4',
      rating: 4.5,
      badge: { type: 'sale' as const, label: dict.shop.sale },
      colors: ['#dc2626', '#000000', '#2563eb'],
    },
    {
      id: 'prod-2',
      name: 'Core Stability Trainer',
      brand: 'Apex',
      price: '$145.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLL2V-mDygdhMYcgNAUNkf0O_1Q8FT8jbpl6muZBskRYXiH1dy5PHSUM7_aUM4IlhoTL9bQKDBLDjH780y8Yyz3q4D8QXX7rQq84PhxP-Mo9OrazjkIorWcyW0hdzoDHRNIJoDW_1VbwrDLZud27kplgQozsNtCcezmm-JRdiw95bVFRbXArRV7q67zw3HezbCbJo65n1zcj5I2S14CSUItRrIIkGmwGz4aSwio-rbrlxKtBPenSojbsEwYb-ZNBfYWYksNswWgtg',
      rating: 4.8,
      colors: ['#22c55e', '#27272a'],
    },
    {
      id: 'prod-3',
      name: 'AeroKnit Ultra Boost',
      brand: 'ProFit',
      price: '$180.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzprl-dinoPic5ke3lZLrWE5wK_UwTsmErwVSbNWO1QWHChGYKU8ZixRrCot0rxLQr094loio5QjQeA9dmQu5wJP5ptvsAk-LJHRWhNRajgKPTBkNe2RiqUX4igPEHf5hJAbVIaEzSbLzPAU9XIPjqIc_efHra9f3kr0HJaIdMVXFPsboJr254gdK6wk93p_vhImHRRXR4PNlAt5SNp9icuHGkOuoaZ3HNlzMf5uvqBuUpLt8CVzQKsInAwb7hd1x-oQ32T1nejug',
      rating: 4.9,
      badge: { type: 'new' as const, label: dict.shop.new },
      colors: ['#ffffff', '#bfdbfe'],
    },
    {
      id: 'prod-4',
      name: 'Elite Track Spikes',
      brand: 'Velocity',
      price: '$150.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkomHkGOvNO-7k3NAtcMCRba2YT9NB30Ox-Er4xCV2Kh36zv7DD_6F1WXvx2KTltnDpUHCNZ9vepK4LeBNuwG6QzIlBh1jgwPvaUHThLwicA1083rFUkhyIo9LeLZxm2jnDSFtZ0CUzDw_M88no2Ppi0bCZ0tXAI7jnzjnVgK8KsRvf9Oy7_YCfYwUXbGJVFhXh5Pu5U3h2aPw8LoiS1rb3nkuJtIolPvewJEGAmP8MMt6FbldxdjxbJffIttQH_9FcrqqgfogWlE',
      rating: 4.6,
      colors: ['#f97316', '#000000'],
    },
    {
      id: 'prod-5',
      name: 'All-Weather Jacket',
      brand: 'ProFit',
      price: '$110.00',
      originalPrice: '$140.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXp6ucCkuWT9f5MSOTMJ75DMQI8CfZnLysugvyxQCsHviAdHrP0t4Yf30g5RRrKWB_dCEvP_bSmozmK5oc0utypVSd34sNtMTaAtSsDf6eIyrh5T36byYxB88OykKdMo3P6AGiB_VJq8AzBczleCJhWF4xQf04ekJyhoGKN8ZL8VT_V8L0jz0O2PHcvUPX2ydkQFihMshRLQyW1CbCANfzXmUz9QQrl22vLrQo9_NX8TQx1reVoNGoL5KNeXZS1IZ3nd6R8p0u-Zw',
      rating: 4.3,
      badge: { type: 'sale' as const, label: dict.shop.sale },
      colors: ['#1e3a8a', '#475569'],
    },
    {
      id: 'prod-6',
      name: 'Performance Compression Top',
      brand: 'Apex',
      price: '$65.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOX0XCMdaSxagxoyRBtLy_03H3dGYWoIeV_KUnY4UFbctOC4bl2afAynnZVhImW-C_s3T5dXnvkaMRvy-dO3elwGcBNNNS2xkwWNshKb2c1uiSGxF8kAk7QReo4hkLIVIa8e1b_vNza0b1EkdKJ0d7CRV-nvIBkT7_XCWTvbTRcVNCxcNWckmm4QiWOLT55OHEGYxtCR6Ss8Z7ZPkpS67N58CutkghhDPQYhUndN9czgX2NxHhyMk6GEPPYfebBdGAcxsEDRQKXbI',
      rating: 4.7,
      colors: ['#000000', '#94a3b8'],
    }
  ];

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
