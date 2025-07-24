import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { BookingFilters } from '@/components/booking-history/BookingFilters';
import { BookingHistoryTable } from '@/components/booking-history/BookingHistoryTable';
import { EarningsSummaryCard } from '@/components/booking-history/EarningsSummaryCard';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/hooks/useBookings';
import { usePayouts } from '@/hooks/usePayouts';
import { Booking, BookingFilters as BookingFiltersType, PaginationData } from '@/types/booking';
import { ExportUtils } from '@/lib/exportUtils';
import { transformSupabaseBookings } from '@/lib/bookingTransforms';

export default function OwnerEarnings() {
  const { user } = useAuth();
  const { bookings: supabaseBookings, loading: bookingsLoading, error: bookingsError } = useBookings();
  const { summary: payoutSummary, loading: payoutsLoading, error: payoutsError } = usePayouts();
  const [activeTab, setActiveTab] = useState('earnings');
  const [filters, setFilters] = useState<BookingFiltersType>({});
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    hasNext: false,
    hasPrev: false
  });

  // Transform Supabase bookings to match UI expectations (filter owner bookings)
  const ownerBookings = transformSupabaseBookings(supabaseBookings);
  const loading = bookingsLoading || payoutsLoading;
  const error = bookingsError || payoutsError;
  
  const applyFilters = (bookings: Booking[]): Booking[] => {
    let filtered = [...bookings];

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(booking => filters.status!.includes(booking.status));
    }

    // Filter by date range
    if (filters.dateRange) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.startDate);
        return bookingDate >= filters.dateRange!.from && bookingDate <= filters.dateRange!.to;
      });
    }

    // Filter by item type
    if (filters.itemType) {
      filtered = filtered.filter(booking => booking.itemType === filters.itemType);
    }

    // Sort
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'date':
            aValue = new Date(a.startDate);
            bValue = new Date(b.startDate);
            break;
          case 'amount':
            aValue = a.ownerEarnings;
            bValue = b.ownerEarnings;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        } else {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
      });
    }

    return filtered;
  };

  const filteredBookings = applyFilters(ownerBookings);

  // Update pagination
  useEffect(() => {
    const total = filteredBookings.length;
    const hasNext = pagination.page * pagination.limit < total;
    const hasPrev = pagination.page > 1;

    setPagination(prev => ({
      ...prev,
      total,
      hasNext,
      hasPrev
    }));
  }, [filteredBookings.length, pagination.page, pagination.limit]);

  const paginatedBookings = filteredBookings.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleDownloadReport = async () => {
    if (payoutSummary && user) {
      const mockEarnings = {
        totalEarnings: payoutSummary.totalEarnings,
        totalWithdrawn: payoutSummary.totalPaid,
        pendingPayouts: payoutSummary.pendingAmount,
        availableBalance: payoutSummary.availableBalance,
        totalBookings: ownerBookings.length,
        monthlyBookings: ownerBookings.filter(b => {
          const date = new Date(b.startDate);
          const now = new Date();
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length,
        completedBookings: ownerBookings.filter(b => b.status === 'completed').length,
        averageBookingValue: ownerBookings.length > 0 ? 
          ownerBookings.reduce((sum, b) => sum + b.totalAmount, 0) / ownerBookings.length : 0,
        monthlyEarnings: payoutSummary.totalEarnings * 0.1 // Estimate
      };
      
      await ExportUtils.generateEarningsReportPDF(
        mockEarnings,
        filteredBookings,
        user.email || 'Owner'
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Earnings & Bookings</h1>
          <p className="text-muted-foreground">
            Track your revenue and manage bookings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => ExportUtils.exportEarningsToCSV(filteredBookings)} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleDownloadReport}>
            <FileText className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="earnings">Earnings Overview</TabsTrigger>
          <TabsTrigger value="bookings">Booking History</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="space-y-6">
          {payoutSummary && (
            <EarningsSummaryCard 
              summary={{
                totalEarnings: payoutSummary.totalEarnings,
                monthlyEarnings: payoutSummary.totalEarnings * 0.1, // Estimate
                totalBookings: ownerBookings.length,
                monthlyBookings: ownerBookings.filter(b => {
                  const date = new Date(b.startDate);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length,
                pendingPayouts: payoutSummary.pendingAmount,
                completedBookings: ownerBookings.filter(b => b.status === 'completed').length,
                averageBookingValue: ownerBookings.length > 0 ? 
                  ownerBookings.reduce((sum, b) => sum + b.totalAmount, 0) / ownerBookings.length : 0
              }}
              onDownloadReport={handleDownloadReport}
            />
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingHistoryTable
                bookings={ownerBookings.slice(0, 5)}
                userRole="owner"
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <BookingFilters
            filters={filters}
            onFiltersChange={setFilters}
            userRole="owner"
          />

          <BookingHistoryTable
            bookings={paginatedBookings}
            userRole="owner"
            pagination={pagination}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}