import PDFDocument from 'pdfkit';
import { IBooking } from '../model/schemas/booking.schema';
import fs from 'fs';
import path from 'path';

interface Traveller {
  firstName: string;
  lastName?: string; // Assuming lastName may also be present
}

export class PDFService {
  private logoPath: string;

  constructor() {
    this.logoPath = path.join(__dirname, '../assets/GODSPEED.png');
  }

  async generateTicketPDF(booking: IBooking): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      const buffers: any[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      this.generateHeader(doc);
      this.generateCustomerInformation(doc, booking);
      this.generateTicketTable(doc, booking);
      this.generateFooter(doc);

      doc.end();
    });
  }

  private generateHeader(doc: PDFKit.PDFDocument): void {
    doc
      .image(this.logoPath, 50, 45, { width: 50 })
      .fillColor('#444444')
      .fontSize(20)
      .text('Volare Flights', 110, 57)
      .fontSize(10)
      .text('123 Bengaluru', 200, 65, { align: 'right' })
      .text('Bengaluru, KA, 10025', 200, 80, { align: 'right' })
      .moveDown();
  }

  private generateCustomerInformation(doc: PDFKit.PDFDocument, booking: IBooking): void {
    doc
      .fillColor('#444444')
      .fontSize(20)
      .text('Flight Ticket', 50, 160);

    this.generateHr(doc, 185);

    const customerInformationTop = 200;

    // Booking Number
    doc
      .fontSize(10)
      .text('Booking Number:', 50, customerInformationTop)
      // .text(booking._id || '', 150, customerInformationTop);

    // Booking Date
    doc
      .text('Booking Date:', 50, customerInformationTop + 15)
      // .text(this.formatDate(new Date(booking.createdAt || '')), 150, customerInformationTop + 15);

    // Passenger Name
    doc
      .text('Passenger Name:', 50, customerInformationTop + 30);

    if (booking.travellers.length > 0) {
      const traveller = booking.travellers[0] as Traveller; // Cast to correct type
      doc.text(`${traveller.firstName || 'N/A'} ${traveller.lastName || ''}`, 150, customerInformationTop + 30);
    } else {
      doc.text('N/A', 150, customerInformationTop + 30);
    }

    this.generateHr(doc, 252);
  }

  private generateTicketTable(doc: PDFKit.PDFDocument, booking: IBooking): void {
    const ticketTableTop = 330;

    this.generateTableRow(
      doc,
      ticketTableTop,
      'Flight',
      'From',
      'To',
      'Date',
      'Departure'
    );
    this.generateHr(doc, ticketTableTop + 20);

    this.generateTableRow(
      doc,
      ticketTableTop + 30,
      booking.flightChartId.toString(),
      'Mattanur', 
      'Kochi', 
      this.formatDate(new Date(booking.departureTime)),
      new Date(booking.departureTime).toLocaleTimeString()
    );

    this.generateHr(doc, ticketTableTop + 55);

    const pricingTableTop = ticketTableTop + 70;

    this.generateTableRow(
      doc,
      pricingTableTop,
      'Base Fare',
      'Taxes',
      'Charges',
      'Discount',
      'Total Price'
    );
    this.generateHr(doc, pricingTableTop + 20);

    this.generateTableRow(
      doc,
      pricingTableTop + 30,
      `Rs${booking.fareBreakdown.baseFare.toFixed(2)}`,
      `Rs${booking.fareBreakdown.taxAmount.toFixed(2)}`,
      `Rs${booking.fareBreakdown.chargesAmount.toFixed(2)}`,
      `Rs${booking.fareBreakdown.couponDiscount.toFixed(2)}`,
      `Rs${booking.totalPrice.toFixed(2)}`
    );
  }

  private generateFooter(doc: PDFKit.PDFDocument): void {
    doc
      .fontSize(10)
      .text(
        'Thank you for choosing volare Flights. We wish you a pleasant flight!',
        50,
        700,
        { align: 'center', width: 500 }
      );
  }

  private generateTableRow(
    doc: PDFKit.PDFDocument,
    y: number,
    item1: string,
    item2: string,
    item3: string,
    item4: string,
    item5: string
  ): void {
    doc
      .fontSize(10)
      .text(item1, 50, y)
      .text(item2, 150, y)
      .text(item3, 250, y)
      .text(item4, 350, y)
      .text(item5, 450, y);
  }

  private generateHr(doc: PDFKit.PDFDocument, y: number): void {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}
