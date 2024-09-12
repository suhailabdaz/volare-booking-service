import PDFDocument from 'pdfkit';
import { IBooking } from '../model/schemas/booking.schema'; // Assume you have a Booking type defined
import fs from 'fs';
import path from 'path';

interface Traveller{
  firstName:string 
  
}

export class PDFService {
  // private fontRegular: string;
  // private fontBold: string;
  private logoPath: string;

  constructor() {
    // this.fontRegular = path.join(__dirname, '../assets/fonts/Roboto-Regular.ttf');
    // this.fontBold = path.join(__dirname, '../assets/fonts/Roboto-Bold.ttf');
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
      // .font(this.fontBold)
      .fontSize(20)
      .text('Your Airline Name', 110, 57)
      .fontSize(10)
      .text('123 Main Street', 200, 65, { align: 'right' })
      .text('New York, NY, 10025', 200, 80, { align: 'right' })
      .moveDown();
  }

  private generateCustomerInformation(doc: PDFKit.PDFDocument, booking: IBooking): void {
    doc
      .fillColor('#444444')
      // .font(this.fontBold)
      .fontSize(20)
      .text('Flight Ticket', 50, 160);

    this.generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
      .fontSize(10)
      // .font(this.fontBold)
      .text('Booking Number:', 50, customerInformationTop)
      // .font(this.fontRegular)
      // .text(booking._id||'', 150, customerInformationTop)
      // .font(this.fontBold)
      .text('Booking Date:', 50, customerInformationTop + 15)
      // .font(this.fontRegular)
      // .text(this.formatDate(new Date(booking.createdAt || '')), 150, customerInformationTop + 15)
      // .font(this.fontBold)
      .text('Passenger Name:', 50, customerInformationTop + 30)
      // .font(this.fontRegular)
      // .text(booking.travellers[0]?.firstName || 'N/A', 150, customerInformationTop + 30)

    this.generateHr(doc, 252);
  }

  private generateTicketTable(doc: PDFKit.PDFDocument, booking: IBooking): void {
    const ticketTableTop = 330;

    // doc.font(this.fontBold);
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
    // doc.font(this.fontRegular);

    this.generateTableRow(
      doc,
      ticketTableTop + 30,
      booking.flightChartId.toString(),
      'New York',
      'Los Angeles',
      this.formatDate(new Date(booking.departureTime)),
      new Date(booking.departureTime).toLocaleTimeString()
    );

    this.generateHr(doc, ticketTableTop + 55);

    const pricingTableTop = ticketTableTop + 70;

    // doc.font(this.fontBold);
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
    // doc.font(this.fontRegular);

    this.generateTableRow(
      doc,
      pricingTableTop + 30,
      `$${booking.fareBreakdown.baseFare}`,
      `$${booking.fareBreakdown.taxAmount}`,
      `$${booking.fareBreakdown.chargesAmount}`,
      `$${booking.fareBreakdown.couponDiscount}`,
      `$${booking.totalPrice}`
    );
  }

  private generateFooter(doc: PDFKit.PDFDocument): void {
    doc
      .fontSize(10)
      .text(
        'Thank you for choosing our airline. We wish you a pleasant flight!',
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
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}