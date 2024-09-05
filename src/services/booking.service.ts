import { contactDetails, IBookingInterface } from '../interfaces/iBookingInterface';
import { IBookingRepository } from '../interfaces/iBookingRepository';
import { Booking } from '../model/booking.entities';
import 'dotenv/config';
import Stripe from 'stripe';
import PDFDocument from 'pdfkit';
import { Coupon } from '../model/coupon.entities';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');


export class BookingService implements IBookingInterface {
  private repository: IBookingRepository;
  private encodeSeatInfo(seats: Array<{ seatNumber: string; travellerId: string; class: string }>): string {
    const compressedSeats = seats.map(seat => `${seat.seatNumber},${seat.travellerId},${seat.class}`).join(';');
    return encodeURIComponent(compressedSeats);
  }

  constructor(repository: IBookingRepository) {
    this.repository = repository;
  }
 
  

  async initiateBooking(data:Booking) {
    try {

      const booking = await this.repository.initiateBooking(data);
      return booking
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error initiate booking: ${error.message}`);
      }
      throw error;
    }
  }

  async getBooking(data:string) {
    try {
      const booking = await this.repository.findById(data);
      return booking
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting booking: ${error.message}`);
      }
      throw error;
    }
  }

  async updateBooking(data:{bookingId:string,travellers:Array<any>,contactDetails:contactDetails}) {
    try {

      const booking = await this.repository.addTraveller(data.bookingId,data.travellers,data.contactDetails);
      return booking
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting booking: ${error.message}`);
      }
      throw error;
    }
  }

  async updateSeatBooking(data:{bookingId:string,seats:Array<any>}) {
    try {

      const booking = await this.repository.seatSelection(data.bookingId,data.seats);
      return booking
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting booking: ${error.message}`);
      }
      throw error;
    }
  }

  async checkoutSession(data: { bookingId: string }) {
    try {
      const booking = await this.repository.findById(data.bookingId);
      
      if (booking) {
        const encodedSeats = this.encodeSeatInfo(booking.seats);
        const line_items = [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: 'Flight Booking',
                description: `Booking ID: ${booking._id?.toString()}\n
                Fare Breakdown:\n
                - Base Fare: ₹${booking.fareBreakdown.baseFare.toFixed(2)}\n
                - Tax: ₹${booking.fareBreakdown.taxAmount.toFixed(2)}\n
                - Charges: ₹${booking.fareBreakdown.chargesAmount.toFixed(2)}`
                ,
                metadata: {
                  booking_id: booking._id?.toString(), 
                  base_fare: booking.fareBreakdown.baseFare.toString(),
                  tax_amount: booking.fareBreakdown.taxAmount.toString(),
                  charges_amount: booking.fareBreakdown.chargesAmount.toString(),
                },
              },
              unit_amount: Math.round(booking.totalPrice * 100), 
            },
            quantity: 1,
          },
        ];
        
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: line_items,
          mode: 'payment',
          success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id?.toString()}&flightchart_id=${booking.flightChartId?.toString()}&seats=${encodedSeats}`,
          cancel_url: 'http://localhost:3000/cancel', 
          metadata: {
            flightChartId:booking.flightChartId?.toString(),
            bookingId: booking._id?.toString(),
            seats: JSON.stringify(booking.seats),
          },
        } as Stripe.Checkout.SessionCreateParams);
  
        return { id: session.id };
      }
      throw new Error('Booking not found');
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async ticketConfirmation(data:{bookingId:string,paymentId:string}) {
      try{
        const booking = await this.repository.paymentCompleted(data.bookingId,data.paymentId)
        return booking
      }catch (error) {
      console.error('Error confiming ticket', error);
      throw error;
    }
  }


  async applyCoupon(data:{bookingId:string,coupon:Coupon}) {
    try{
      if(data.coupon == null){
        const booking = await this.repository.findById(data.bookingId)
        return booking
      }else{
      const booking = await this.repository.applyCoupon(data.bookingId,data.coupon) 
      return booking
      }
    }catch (error) {
    console.error('Error confiming ticket', error);
    throw error;
  }
}


//  async  generateTicketPDF(bookingId: string): Promise<Buffer> {
//   const booking = await getBookingDetails(bookingId);
//   const doc = new PDFDocument();
//   let buffers: Array<any> = [];
//   doc.on('data', buffers.push.bind(buffers));
//   doc.on('end', () => {});

//   // Add content to the PDF
//   doc.text(`Booking Confirmation: ${bookingId}`);
//   // Add more booking details...

//   doc.end();
//   return Buffer.concat(buffers);
// }

}
