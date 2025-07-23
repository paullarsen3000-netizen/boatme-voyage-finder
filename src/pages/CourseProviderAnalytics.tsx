import { useState } from "react";
import { KPICard } from "@/components/analytics/KPICard";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { generateCourseAnalytics, getDateRangeData } from "@/lib/analyticsData";
import { useToast } from "@/hooks/use-toast";

export default function CourseProviderAnalytics() {
  const [dateRange, setDateRange] = useState('30d');
  const { toast } = useToast();
  const analytics = generateCourseAnalytics();

  const handleExport = () => {
    toast({
      title: "Course Analytics Exported",
      description: "Your training analytics report has been downloaded.",
    });
  };

  const enrollmentTrend = getDateRangeData(dateRange as any);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Course Provider Analytics</h1>
          <p className="text-muted-foreground">
            Track student enrollment and course performance
          </p>
        </div>
      </div>

      <AnalyticsFilters 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExport={handleExport}
      />

      {/* Course KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analytics.kpis.map((metric, index) => (
          <KPICard key={index} metric={metric} />
        ))}
      </div>

      {/* Course Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Student Enrollment Trend"
          data={analytics.enrollmentData}
          type="line"
          color="hsl(var(--primary))"
        />
        
        <AnalyticsChart
          title="Course Popularity"
          data={analytics.coursePopularity}
          type="bar"
          color="hsl(var(--secondary))"
        />
      </div>

      {/* Additional Course Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Weekly Enrollment"
          data={enrollmentTrend}
          type="bar"
          height={250}
        />
        
        <AnalyticsChart
          title="Student Demographics"
          data={[
            { date: 'Beginners', value: 45 },
            { date: 'Intermediate', value: 35 },
            { date: 'Advanced', value: 20 }
          ]}
          type="pie"
          height={250}
        />
      </div>

      {/* Performance Summary */}
      <AnalyticsChart
        title="Monthly Revenue from Courses"
        data={analytics.enrollmentData.map(item => ({
          ...item,
          value: item.value * 680 // Average course price
        }))}
        type="line"
        height={300}
        color="#82ca9d"
      />
    </div>
  );
}