import { getDictionary } from '@/dictionaries';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import { CategoryDistribution } from '@/components/admin/dashboard/CategoryDistribution';
import { RecentProducts } from '@/components/admin/dashboard/RecentProducts';
import { BestSellingProducts } from '@/components/admin/dashboard/BestSellingProducts';

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);

  return (
    <>
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={dict.admin.dashboard.totalProducts}
          value="0"
          icon="inventory_2"
          trend={{ value: 0, label: dict.admin.dashboard.vsLastMonth, isPositive: true }}
          iconBgClass="bg-primary-fixed"
          iconColorClass="text-on-primary-fixed"
        />
        <StatCard 
          title={dict.admin.dashboard.totalCategories}
          value="0"
          icon="category"
          trend={{ value: 0, label: dict.admin.dashboard.vsLastMonth, isPositive: true }}
          iconBgClass="bg-surface-variant"
          iconColorClass="text-on-surface-variant"
        />
        <StatCard 
          title={dict.admin.dashboard.totalBrands}
          value="0"
          icon="sell"
          trend={{ value: 0, label: dict.admin.dashboard.vsLastMonth, isPositive: true }}
          iconBgClass="bg-secondary-fixed-dim"
          iconColorClass="text-on-secondary-fixed-variant"
        />
        <StatCard 
          title={dict.admin.dashboard.totalUsers}
          value="0"
          icon="group"
          trend={{ value: 0, label: dict.admin.dashboard.vsLastMonth, isPositive: true }}
          iconBgClass="bg-tertiary-fixed"
          iconColorClass="text-on-tertiary-fixed"
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mock Chart for Activity (Replacing Revenue Chart) */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-sm text-headline-sm text-on-surface m-0">
              Hoạt động hệ thống
            </h2>
            <button className="text-primary font-label-md text-label-md hover:underline">
              {dict.admin.dashboard.viewDetails}
            </button>
          </div>
          
          {/* Mock Chart Area */}
          <div className="flex-1 bg-surface rounded-lg relative overflow-hidden min-h-[300px] border border-outline-variant/50">
            {/* CSS representation of a line chart grid & line */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,80 C20,70 30,90 50,50 C70,10 80,40 100,20 L100,100 L0,100 Z" fill="url(#gradient-primary)" opacity="0.1"></path>
              <path d="M0,80 C20,70 30,90 50,50 C70,10 80,40 100,20" fill="none" stroke="#0058bc" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
              <defs>
                <linearGradient id="gradient-primary" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#0058bc"></stop>
                  <stop offset="100%" stopColor="#0058bc" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        
        <CategoryDistribution dict={dict} />
      </div>

      {/* Activity / Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
        <RecentProducts dict={dict} />
        <BestSellingProducts dict={dict} />
      </div>
    </>
  );
}
