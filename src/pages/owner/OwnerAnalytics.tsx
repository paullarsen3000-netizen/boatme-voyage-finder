import { useState } from "react";
import { KPICard } from "@/components/analytics/KPICard";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { ListingPerformanceTable } from "@/components/analytics/ListingPerformanceTable";
import { generateOwnerAnalytics, getDateRangeData } from "@/lib/analyticsData";
import { useToast } from "@/hooks/use-toast";

export default function OwnerAnalytics() {
  const [dateRange, setDateRange] = useState('30d');
  const { toast } = useToast();
  const analytics = generateOwnerAnalytics();

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your analytics report is being prepared for download.",
    });
  };

  const trendData = getDateRangeData(dateRange as any);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Owner Analytics</h1>
          <p className="text-muted-foreground">
            Track your rental performance and earnings
          </p>
        </div>
      </div>

      <AnalyticsFilters 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExport={handleExport}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analytics.kpis.map((metric, index) => (
          <KPICard key={index} metric={metric} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Earnings Over Time"
          data={analytics.earningsData}
          type="line"
          color="hsl(var(--primary))"
        />
        
        <AnalyticsChart
          title="Monthly Bookings"
          data={analytics.bookingsData}
          type="bar"
          color="hsl(var(--secondary))"
        />
      </div>

      {/* Performance Table */}
      <ListingPerformanceTable listings={analytics.topListings} />

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Revenue Trend"
          data={trendData}
          type="line"
          height={250}
        />
        
        <AnalyticsChart
          title="Booking Distribution"
          data={[
            { date: 'Weekdays', value: 65 },
            { date: 'Weekends', value: 35 }
          ]}
          type="pie"
          height={250}
        />
      </div>
    </div>
  );
}