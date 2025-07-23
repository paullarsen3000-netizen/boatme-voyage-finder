import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Eye, 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  MoreVertical 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReceiptDownloadButton } from '@/components/ReceiptDownloadButton';
import { BookingData, receiptGenerator } from '@/lib/receiptGenerator';
import { Booking, PaginationData } from '@/types/booking';
import { Link } from 'react-router-dom';

interface BookingHistoryTableProps {
  bookings: Booking[];
  userRole: 'renter' | 'owner' | 'admin';
  pagination?: PaginationData;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

export function BookingHistoryTable({ 
  bookings, 
  userRole, 
  pagination,
  onPageChange,
  loading = false 
}: BookingHistoryTableProps) {
  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
      case 'confirmed':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    const variants = {
      upcoming: 'default',
      confirmed: 'default',
      completed: 'secondary',
      cancelled: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const convertToReceiptData = (booking: Booking): BookingData => ({
    id: booking.id,
    bookingId: booking.bookingId,
    customerName: booking.guestName,
    customerEmail: booking.guestEmail,
    customerPhone: booking.guestPhone,
    providerName: booking.ownerName,
    providerEmail: booking.ownerEmail,
    itemName: booking.itemName,
    itemType: booking.itemType,
    bookingDate: booking.bookingDate,
    startDate: booking.startDate,
    endDate: booking.endDate,
    baseAmount: booking.baseAmount,
    serviceFee: booking.serviceFee,
    vatAmount: 0,
    totalAmount: booking.totalAmount,
    paymentMethod: booking.paymentMethod,
    location: booking.location,
    createdAt: booking.createdAt
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No bookings found</h3>
            <p className="text-muted-foreground">
              {userRole === 'renter' 
                ? "You haven't made any bookings yet." 
                : "No bookings match your current filters."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Booking History
          <Badge variant="outline">{bookings.length} bookings</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>{userRole === 'owner' ? 'Guest' : 'Item'}</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  {userRole === 'owner' ? 'Earnings' : 'Amount'}
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-mono text-sm">{booking.bookingId}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {userRole === 'owner' ? booking.guestName : booking.itemName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {userRole === 'owner' 
                          ? booking.guestEmail 
                          : `${booking.itemType} • ${booking.ownerName}`}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div>{format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}</div>
                      <div className="text-muted-foreground">{booking.location}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="font-medium">
                      R{(userRole === 'owner' ? booking.ownerEarnings : booking.totalAmount).toLocaleString()}
                    </div>
                    {userRole === 'owner' && (
                      <div className="text-xs text-muted-foreground">
                        of R{booking.totalAmount.toLocaleString()}
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Link to={`/receipt/${booking.bookingId}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      
                      <ReceiptDownloadButton
                        booking={convertToReceiptData(booking)}
                        variant="ghost"
                        size="sm"
                      />
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {booking.status === 'upcoming' && (
                            <DropdownMenuItem className="text-destructive">
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel Booking
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {pagination && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} bookings
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}