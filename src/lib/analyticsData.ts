import { addDays, subDays, format } from 'date-fns';

export interface KPIMetric {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  format: 'currency' | 'number' | 'percentage';
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ListingPerformance {
  id: string;
  name: string;
  bookings: number;
  earnings: number;
  views: number;
  conversionRate: number;
}

// Mock analytics data generator
export const generateOwnerAnalytics = () => {
  const now = new Date();
  
  // KPI Metrics
  const kpis: KPIMetric[] = [
    {
      title: "Total Earnings",
      value: 45750,
      change: 12.5,
      trend: 'up',
      format: 'currency'
    },
    {
      title: "Bookings This Month",
      value: 23,
      change: 8.3,
      trend: 'up',
      format: 'number'
    },
    {
      title: "Average Daily Rate",
      value: 850,
      change: -2.1,
      trend: 'down',
      format: 'currency'
    },
    {
      title: "Occupancy Rate",
      value: 68,
      change: 5.7,
      trend: 'up',
      format: 'percentage'
    }
  ];

  // Earnings over time (last 6 months)
  const earningsData: ChartDataPoint[] = Array.from({ length: 6 }, (_, i) => {
    const date = subDays(now, (5 - i) * 30);
    return {
      date: format(date, 'MMM yyyy'),
      value: Math.floor(Math.random() * 20000) + 30000
    };
  });

  // Bookings trend (last 12 months)
  const bookingsData: ChartDataPoint[] = Array.from({ length: 12 }, (_, i) => {
    const date = subDays(now, (11 - i) * 30);
    return {
      date: format(date, 'MMM'),
      value: Math.floor(Math.random() * 15) + 5
    };
  });

  // Top performing listings
  const topListings: ListingPerformance[] = [
    {
      id: '1',
      name: 'Luxury Yacht Aurora',
      bookings: 12,
      earnings: 18500,
      views: 245,
      conversionRate: 4.9
    },
    {
      id: '2', 
      name: 'Speedboat Thunder',
      bookings: 8,
      earnings: 12200,
      views: 180,
      conversionRate: 4.4
    },
    {
      id: '3',
      name: 'Family Cruiser Serenity',
      bookings: 6,
      earnings: 9800,
      views: 156,
      conversionRate: 3.8
    }
  ];

  return { kpis, earningsData, bookingsData, topListings };
};

export const generateCourseAnalytics = () => {
  const now = new Date();
  
  const kpis: KPIMetric[] = [
    {
      title: "Students This Month",
      value: 42,
      change: 15.8,
      trend: 'up',
      format: 'number'
    },
    {
      title: "Course Revenue",
      value: 28500,
      change: 9.2,
      trend: 'up',
      format: 'currency'
    },
    {
      title: "Completion Rate",
      value: 87,
      change: 3.4,
      trend: 'up',
      format: 'percentage'
    },
    {
      title: "Average Rating",
      value: 4.8,
      change: 0.2,
      trend: 'up',
      format: 'number'
    }
  ];

  const enrollmentData: ChartDataPoint[] = Array.from({ length: 6 }, (_, i) => {
    const date = subDays(now, (5 - i) * 30);
    return {
      date: format(date, 'MMM yyyy'),
      value: Math.floor(Math.random() * 30) + 20
    };
  });

  const coursePopularity = [
    { date: 'Basic Skipper', value: 35 },
    { date: 'Advanced Navigation', value: 22 },
    { date: 'Safety Course', value: 18 },
    { date: 'Commercial License', value: 12 }
  ];

  return { kpis, enrollmentData, coursePopularity };
};

export const generateAdminAnalytics = () => {
  const kpis: KPIMetric[] = [
    {
      title: "Active Users",
      value: 1247,
      change: 18.3,
      trend: 'up',
      format: 'number'
    },
    {
      title: "Total Revenue",
      value: 125000,
      change: 12.7,
      trend: 'up',
      format: 'currency'
    },
    {
      title: "Platform Growth",
      value: 23.5,
      change: 4.2,
      trend: 'up',
      format: 'percentage'
    },
    {
      title: "Avg Session Time",
      value: 12.5,
      change: -1.2,
      trend: 'down',
      format: 'number'
    }
  ];

  const revenueData: ChartDataPoint[] = Array.from({ length: 12 }, (_, i) => {
    const date = subDays(new Date(), (11 - i) * 30);
    return {
      date: format(date, 'MMM'),
      value: Math.floor(Math.random() * 50000) + 80000
    };
  });

  const provinceData = [
    { date: 'Western Cape', value: 35 },
    { date: 'KwaZulu-Natal', value: 28 },
    { date: 'Eastern Cape', value: 18 },
    { date: 'Gauteng', value: 12 },
    { date: 'Other', value: 7 }
  ];

  return { kpis, revenueData, provinceData };
};

export const getDateRangeData = (range: '7d' | '30d' | '90d' | '1y') => {
  const now = new Date();
  let days: number;
  
  switch (range) {
    case '7d': days = 7; break;
    case '30d': days = 30; break;
    case '90d': days = 90; break;
    case '1y': days = 365; break;
  }
  
  return Array.from({ length: Math.min(days, 30) }, (_, i) => {
    const date = subDays(now, days - i);
    return {
      date: format(date, days <= 7 ? 'EEE' : 'MMM d'),
      value: Math.floor(Math.random() * 1000) + 500
    };
  });
};