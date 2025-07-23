import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Calendar } from 'lucide-react';
import { BookingFilters } from '@/components/booking-history/BookingFilters';
import { BookingHistoryTable } from '@/components/booking-history/BookingHistoryTable';
import { useAuth } from '@/contexts/AuthContext';
import { Booking, BookingFilters as BookingFiltersType, PaginationData } from '@/types/booking';
import { mockBookings, getBookingsForUser } from '@/lib/mockData';
import { ExportUtils } from '@/lib/exportUtils';

export default function BookingHistory() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<BookingFiltersType>({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    hasNext: false,
    hasPrev: false
  });

  // Mock user bookings (in real app, this would come from Supabase)
  const userBookings = user ? getBookingsForUser(user.id, 'renter') : [];
  
  const filterBookingsByTab = (bookings: Booking[], tab: string): Booking[] => {
    switch (tab) {
      case 'upcoming':
        return bookings.filter(b => b.status === 'upcoming' || b.status === 'confirmed');
      case 'completed':
        return bookings.filter(b => b.status === 'completed');
      case 'cancelled':
        return bookings.filter(b => b.status === 'cancelled');
      default:
        return bookings;
    }
  };

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
            aValue = a.totalAmount;
            bValue = b.totalAmount;
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

  const tabFilteredBookings = filterBookingsByTab(userBookings, activeTab);
  const filteredBookings = applyFilters(tabFilteredBookings);

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

  const handleExport = () => {
    ExportUtils.exportBookingsToCSV(filteredBookings, 'renter');
  };

  const getTabCounts = () => {
    return {
      all: userBookings.length,
      upcoming: userBookings.filter(b => b.status === 'upcoming' || b.status === 'confirmed').length,
      completed: userBookings.filter(b => b.status === 'completed').length,
      cancelled: userBookings.filter(b => b.status === 'cancelled').length,
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your booking history
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All
            {tabCounts.all > 0 && (
              <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                {tabCounts.all}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            Upcoming
            {tabCounts.upcoming > 0 && (
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                {tabCounts.upcoming}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            Completed
            {tabCounts.completed > 0 && (
              <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs">
                {tabCounts.completed}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            Cancelled
            {tabCounts.cancelled > 0 && (
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                {tabCounts.cancelled}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          <BookingFilters
            filters={filters}
            onFiltersChange={setFilters}
            userRole="renter"
          />

          <TabsContent value={activeTab} className="space-y-4">
            <BookingHistoryTable
              bookings={paginatedBookings}
              userRole="renter"
              pagination={pagination}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}