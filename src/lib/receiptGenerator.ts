import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from './supabase';

export interface BookingData {
  id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  providerName: string;
  providerEmail: string;
  itemName: string;
  itemType: 'boat' | 'course';
  bookingDate: string;
  startDate: string;
  endDate: string;
  baseAmount: number;
  serviceFee: number;
  vatAmount: number;
  totalAmount: number;
  paymentMethod: string;
  location: string;
  createdAt: string;
}

export interface ReceiptData {
  id: string;
  bookingId: string;
  receiptNumber: string;
  type: 'receipt' | 'invoice';
  generatedAt: string;
  pdfUrl?: string;
}

class ReceiptGenerator {
  private generateReceiptNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-4);
    return `BME-${year}${month}-${timestamp}`;
  }

  private generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const timestamp = Date.now().toString().slice(-4);
    return `INV-${year}-${timestamp}`;
  }

  async generateReceiptHTML(booking: BookingData, type: 'receipt' | 'invoice' = 'receipt'): Promise<string> {
    const receiptNumber = type === 'receipt' ? this.generateReceiptNumber() : this.generateInvoiceNumber();
    const documentTitle = type === 'receipt' ? 'Receipt' : 'Tax Invoice';
    const currentDate = new Date().toLocaleDateString('en-ZA');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: white;
            color: #333;
          }
          .receipt-container { 
            max-width: 600px; 
            margin: 0 auto;
            background: white;
            border: 1px solid #e5e7eb;
          }
          .header { 
            background: #0ea5e9; 
            color: white; 
            padding: 20px; 
            text-align: center;
          }
          .company-name { 
            font-size: 24px; 
            font-weight: bold; 
            margin: 0;
          }
          .document-type { 
            font-size: 18px; 
            margin: 5px 0 0 0;
          }
          .content { 
            padding: 20px;
          }
          .receipt-info { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 20px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 15px;
          }
          .info-section h3 { 
            margin: 0 0 10px 0; 
            color: #334155;
            font-size: 14px;
            text-transform: uppercase;
          }
          .info-section p { 
            margin: 3px 0; 
            font-size: 14px;
          }
          .booking-details { 
            margin: 20px 0;
          }
          .details-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0;
          }
          .details-table th, .details-table td { 
            padding: 8px 12px; 
            text-align: left; 
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }
          .details-table th { 
            background: #f8fafc; 
            font-weight: 600;
            color: #334155;
          }
          .amount-breakdown { 
            margin-top: 20px;
            border-top: 2px solid #e5e7eb;
            padding-top: 15px;
          }
          .amount-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 5px 0;
          }
          .total-row { 
            font-weight: bold; 
            font-size: 16px; 
            border-top: 1px solid #334155; 
            padding-top: 8px; 
            margin-top: 8px;
          }
          .footer { 
            background: #f8fafc; 
            padding: 15px 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #64748b;
            border-top: 1px solid #e5e7eb;
          }
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(14, 165, 233, 0.1);
            z-index: -1;
            pointer-events: none;
          }
        </style>
      </head>
      <body>
        <div class="watermark">BoatMe</div>
        <div class="receipt-container">
          <div class="header">
            <h1 class="company-name">BoatMe.co.za</h1>
            <p class="document-type">${documentTitle}</p>
          </div>
          
          <div class="content">
            <div class="receipt-info">
              <div class="info-section">
                <h3>${documentTitle} Details</h3>
                <p><strong>${documentTitle} #:</strong> ${receiptNumber}</p>
                <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                <p><strong>Date Issued:</strong> ${currentDate}</p>
                <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
              </div>
              <div class="info-section">
                <h3>Customer Details</h3>
                <p><strong>${booking.customerName}</strong></p>
                <p>${booking.customerEmail}</p>
                ${booking.customerPhone ? `<p>${booking.customerPhone}</p>` : ''}
              </div>
            </div>

            <div class="booking-details">
              <h3>Booking Information</h3>
              <table class="details-table">
                <tr>
                  <th>Description</th>
                  <td>${booking.itemName}</td>
                </tr>
                <tr>
                  <th>Type</th>
                  <td>${booking.itemType === 'boat' ? 'Boat Rental' : 'Skipper Course'}</td>
                </tr>
                <tr>
                  <th>Provider</th>
                  <td>${booking.providerName}</td>
                </tr>
                <tr>
                  <th>Location</th>
                  <td>${booking.location}</td>
                </tr>
                <tr>
                  <th>Start Date</th>
                  <td>${booking.startDate}</td>
                </tr>
                <tr>
                  <th>End Date</th>
                  <td>${booking.endDate}</td>
                </tr>
              </table>
            </div>

            <div class="amount-breakdown">
              <div class="amount-row">
                <span>Base Amount:</span>
                <span>R${booking.baseAmount.toLocaleString()}.00</span>
              </div>
              ${booking.serviceFee > 0 ? `
                <div class="amount-row">
                  <span>Service Fee:</span>
                  <span>R${booking.serviceFee.toLocaleString()}.00</span>
                </div>
              ` : ''}
              ${booking.vatAmount > 0 ? `
                <div class="amount-row">
                  <span>VAT (15%):</span>
                  <span>R${booking.vatAmount.toLocaleString()}.00</span>
                </div>
              ` : ''}
              <div class="amount-row total-row">
                <span>Total Paid:</span>
                <span>R${booking.totalAmount.toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This ${type} was generated by BoatMe.co.za on ${currentDate}</p>
            ${type === 'invoice' ? '<p>This document serves as a valid tax invoice under South African Revenue Service guidelines</p>' : ''}
            <p>For support, contact us at support@boatme.co.za</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async generatePDF(booking: BookingData, type: 'receipt' | 'invoice' = 'receipt'): Promise<Blob> {
    const htmlContent = await this.generateReceiptHTML(booking, type);
    
    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    document.body.appendChild(container);

    try {
      // Generate canvas from HTML
      const canvas = await html2canvas(container, {
        width: 800,
        height: 1200,
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        imgWidth,
        imgHeight
      );

      return pdf.output('blob');
    } finally {
      document.body.removeChild(container);
    }
  }

  async downloadReceipt(booking: BookingData, type: 'receipt' | 'invoice' = 'receipt'): Promise<void> {
    const pdfBlob = await this.generatePDF(booking, type);
    const url = URL.createObjectURL(pdfBlob);
    
    const documentType = type === 'receipt' ? 'Receipt' : 'Invoice';
    const filename = `${documentType}_${booking.bookingId}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  async saveReceiptRecord(
    booking: BookingData, 
    type: 'receipt' | 'invoice' = 'receipt'
  ): Promise<ReceiptData> {
    const receiptNumber = type === 'receipt' ? this.generateReceiptNumber() : this.generateInvoiceNumber();
    
    const receiptData = {
      booking_id: booking.id,
      receipt_number: receiptNumber,
      type,
      generated_at: new Date().toISOString(),
      customer_email: booking.customerEmail,
      provider_email: booking.providerEmail,
      amount: booking.totalAmount
    };

    const { data, error } = await supabase
      .from('receipts')
      .insert(receiptData)
      .select()
      .single();

    if (error) {
      console.error('Error saving receipt record:', error);
      throw error;
    }

    return {
      id: data.id,
      bookingId: data.booking_id,
      receiptNumber: data.receipt_number,
      type: data.type,
      generatedAt: data.generated_at
    };
  }

  async getReceiptsByBooking(bookingId: string): Promise<ReceiptData[]> {
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('booking_id', bookingId)
      .order('generated_at', { ascending: false });

    if (error) {
      console.error('Error fetching receipts:', error);
      return [];
    }

    return data.map(receipt => ({
      id: receipt.id,
      bookingId: receipt.booking_id,
      receiptNumber: receipt.receipt_number,
      type: receipt.type,
      generatedAt: receipt.generated_at,
      pdfUrl: receipt.pdf_url
    }));
  }
}

export const receiptGenerator = new ReceiptGenerator();