import { useState } from "react";
import { KPICard } from "@/components/analytics/KPICard";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { generateAdminAnalytics, getDateRangeData } from "@/lib/analyticsData";
import { useToast } from "@/hooks/use-toast";

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('30d');
  const { toast } = useToast();
  const analytics = generateAdminAnalytics();

  const handleExport = () => {
    toast({
      title: "Platform Report Generated",
      description: "Comprehensive analytics report exported successfully.",
    });
  };

  const platformData = getDateRangeData(dateRange as any);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Platform Analytics</h1>
          <p className="text-muted-foreground">
            Monitor overall platform performance and growth
          </p>
        </div>
      </div>

      <AnalyticsFilters 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExport={handleExport}
      />

      {/* Platform KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analytics.kpis.map((metric, index) => (
          <KPICard key={index} metric={metric} />
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Platform Revenue Growth"
          data={analytics.revenueData}
          type="bar"
          color="hsl(var(--primary))"
        />
        
        <AnalyticsChart
          title="Bookings by Province"
          data={analytics.provinceData}
          type="pie"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Daily Active Users"
          data={platformData}
          type="line"
          height={250}
          color="#8884d8"
        />
        
        <AnalyticsChart
          title="Service Distribution"
          data={[
            { date: 'Boat Rentals', value: 72 },
            { date: 'Skipper Courses', value: 28 }
          ]}
          type="pie"
          height={250}
        />
      </div>

      {/* Regional Performance */}
      <AnalyticsChart
        title="Monthly Transaction Volume"
        data={analytics.revenueData.map(item => ({
          ...item,
          value: Math.floor(item.value / 1000) // Convert to transaction count
        }))}
        type="line"
        height={300}
        color="hsl(var(--secondary))"
      />
    </div>
  );
}