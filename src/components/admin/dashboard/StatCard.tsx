import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  iconBgClass?: string;
  iconColorClass?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  iconBgClass = 'bg-primary-fixed',
  iconColorClass = 'text-on-primary-fixed'
}: StatCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between h-40">
      <div className="flex justify-between items-start">
        <span className="font-label-md text-label-md text-outline uppercase tracking-wider">
          {title}
        </span>
        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', iconBgClass, iconColorClass)}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>
      
      <div>
        <div className="font-display-lg text-display-lg text-on-surface">{value}</div>
        
        {trend && (
          <div 
            className={cn(
              'flex items-center gap-1 mt-2 font-label-md text-label-md',
              trend.isPositive ? 'text-primary' : 'text-error'
            )}
          >
            <span className="material-symbols-outlined text-[16px]">
              {trend.isPositive ? 'trending_up' : 'trending_down'}
            </span>
            <span>
              {trend.isPositive ? '+' : ''}{trend.value}% {trend.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
