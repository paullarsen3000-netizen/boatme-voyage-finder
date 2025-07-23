import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText } from 'lucide-react';
import { BookingFilters } from '@/components/booking-history/BookingFilters';
import { BookingHistoryTable } from '@/components/booking-history/BookingHistoryTable';
import { EarningsSummaryCard } from '@/components/booking-history/EarningsSummaryCard';
import { useAuth } from '@/contexts/AuthContext';
import { Booking, BookingFilters as BookingFiltersType, PaginationData } from '@/types/booking';
import { mockBookings, getBookingsForUser, getEarningsForOwner } from '@/lib/mockData';
import { ExportUtils } from '@/lib/exportUtils';

export default function OwnerEarnings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('earnings');
  const [filters, setFilters] = useState<BookingFiltersType>({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    hasNext: false,
    hasPrev: false
  });

  // Mock owner bookings and earnings (in real app, this would come from Supabase)
  const ownerBookings = user ? getBookingsForUser(user.id, 'owner') : [];
  const earningsSummary = user ? getEarningsForOwner(user.id) : null;
  
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
    if (earningsSummary && user) {
      await ExportUtils.generateEarningsReportPDF(
        earningsSummary,
        filteredBookings,
        user.email || 'Owner'
      );
    }
  };

  const handleExportCSV = () => {
    ExportUtils.exportEarningsToCSV(filteredBookings);
  };

  if (!earningsSummary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
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
          <Button onClick={handleExportCSV} variant="outline">
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
          <EarningsSummaryCard 
            summary={earningsSummary}
            onDownloadReport={handleDownloadReport}
          />
          
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