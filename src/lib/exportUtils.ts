import jsPDF from 'jspdf';
import { Booking, EarningsSummary } from '@/types/booking';
import { format } from 'date-fns';

export class ExportUtils {
  static generateBookingsCSV(bookings: Booking[], userRole: 'renter' | 'owner' | 'admin'): string {
    const headers = userRole === 'owner' 
      ? ['Booking ID', 'Guest Name', 'Guest Email', 'Item Name', 'Start Date', 'End Date', 'Status', 'Total Amount', 'Earnings', 'Created At']
      : ['Booking ID', 'Item Name', 'Owner Name', 'Start Date', 'End Date', 'Status', 'Total Amount', 'Location', 'Created At'];

    const rows = bookings.map(booking => {
      if (userRole === 'owner') {
        return [
          booking.bookingId,
          booking.guestName,
          booking.guestEmail,
          booking.itemName,
          booking.startDate,
          booking.endDate,
          booking.status,
          booking.totalAmount.toString(),
          booking.ownerEarnings.toString(),
          format(new Date(booking.createdAt), 'yyyy-MM-dd HH:mm:ss')
        ];
      } else {
        return [
          booking.bookingId,
          booking.itemName,
          booking.ownerName,
          booking.startDate,
          booking.endDate,
          booking.status,
          booking.totalAmount.toString(),
          booking.location,
          format(new Date(booking.createdAt), 'yyyy-MM-dd HH:mm:ss')
        ];
      }
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  static downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  static async generateEarningsReportPDF(
    summary: EarningsSummary, 
    bookings: Booking[],
    ownerName: string
  ): Promise<void> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(14, 165, 233); // Primary blue
    pdf.text('BoatMe.co.za', 20, yPosition);
    
    yPosition += 10;
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Earnings Report', 20, yPosition);
    
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated for: ${ownerName}`, 20, yPosition);
    pdf.text(`Date: ${format(new Date(), 'MMMM dd, yyyy')}`, pageWidth - 60, yPosition);

    yPosition += 20;

    // Summary Section
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Earnings Summary', 20, yPosition);
    yPosition += 10;

    const summaryData = [
      ['Total Earnings:', `R${summary.totalEarnings.toLocaleString()}`],
      ['Monthly Earnings:', `R${summary.monthlyEarnings.toLocaleString()}`],
      ['Total Bookings:', summary.totalBookings.toString()],
      ['Completed Bookings:', summary.completedBookings.toString()],
      ['Average Booking Value:', `R${summary.averageBookingValue.toLocaleString()}`],
      ['Pending Payouts:', `R${summary.pendingPayouts.toLocaleString()}`],
    ];

    pdf.setFontSize(10);
    summaryData.forEach(([label, value]) => {
      pdf.text(label, 20, yPosition);
      pdf.text(value, 120, yPosition);
      yPosition += 6;
    });

    yPosition += 15;

    // Bookings Table
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Recent Bookings', 20, yPosition);
    yPosition += 10;

    // Table headers
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    const headers = ['ID', 'Guest', 'Dates', 'Status', 'Earnings'];
    const columnWidths = [30, 50, 40, 25, 30];
    let xPosition = 20;

    headers.forEach((header, index) => {
      pdf.text(header, xPosition, yPosition);
      xPosition += columnWidths[index];
    });

    yPosition += 8;

    // Table rows
    pdf.setTextColor(0, 0, 0);
    const recentBookings = bookings.slice(0, 10); // Show last 10 bookings

    recentBookings.forEach((booking) => {
      if (yPosition > 250) { // New page if needed
        pdf.addPage();
        yPosition = 20;
      }

      xPosition = 20;
      const rowData = [
        booking.bookingId.substring(0, 12),
        booking.guestName.substring(0, 20),
        `${format(new Date(booking.startDate), 'MMM dd')} - ${format(new Date(booking.endDate), 'MMM dd')}`,
        booking.status,
        `R${booking.ownerEarnings.toLocaleString()}`
      ];

      rowData.forEach((data, index) => {
        pdf.text(data, xPosition, yPosition);
        xPosition += columnWidths[index];
      });

      yPosition += 6;
    });

    // Footer
    yPosition = pdf.internal.pageSize.getHeight() - 20;
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('This report was generated automatically by BoatMe.co.za', 20, yPosition);
    pdf.text(`Page 1 of 1`, pageWidth - 30, yPosition);

    // Download
    pdf.save(`earnings-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  }

  static exportBookingsToCSV(bookings: Booking[], userRole: 'renter' | 'owner' | 'admin'): void {
    const csvContent = this.generateBookingsCSV(bookings, userRole);
    const filename = `bookings-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    this.downloadCSV(csvContent, filename);
  }

  static exportEarningsToCSV(bookings: Booking[]): void {
    const headers = ['Booking ID', 'Guest Name', 'Item Name', 'Start Date', 'End Date', 'Status', 'Total Amount', 'Service Fee', 'Earnings'];
    
    const rows = bookings.map(booking => [
      booking.bookingId,
      booking.guestName,
      booking.itemName,
      booking.startDate,
      booking.endDate,
      booking.status,
      booking.totalAmount.toString(),
      booking.serviceFee.toString(),
      booking.ownerEarnings.toString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const filename = `earnings-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    this.downloadCSV(csvContent, filename);
  }
}