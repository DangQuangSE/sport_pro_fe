export interface CategoryDistributionProps {
  dict: any;
}

export function CategoryDistribution({ dict }: CategoryDistributionProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline-sm text-headline-sm text-on-surface m-0">
          {dict.admin.dashboard.categoryDistribution}
        </h2>
        <span className="material-symbols-outlined text-outline cursor-pointer">
          more_horiz
        </span>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Mock Pie Chart using conic gradient */}
        <div 
          className="w-48 h-48 rounded-full border-4 border-surface-container-lowest shadow-sm mb-6 relative" 
          style={{ background: 'conic-gradient(#0058bc 0% 55%, #fe9400 55% 85%, #d8e2ff 85% 100%)' }}
        >
          {/* Inner hole for donut style */}
          <div className="absolute inset-4 bg-surface-container-lowest rounded-full flex items-center justify-center flex-col">
            <span className="font-display-xl text-[24px] font-bold text-on-surface leading-none">
              100%
            </span>
            <span className="font-label-sm text-label-sm text-outline mt-1">
              Total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between font-body-sm text-body-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-on-surface">Giày chạy bộ</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface">55%</span>
          </div>
          
          <div className="flex items-center justify-between font-body-sm text-body-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
              <span className="text-on-surface">Quần áo thể thao</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface">30%</span>
          </div>
          
          <div className="flex items-center justify-between font-body-sm text-body-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-fixed"></div>
              <span className="text-on-surface">Phụ kiện</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface">15%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
