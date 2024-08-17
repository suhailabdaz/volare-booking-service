import { IBookingRepository } from '../interfaces/iBookingRepository';
import BookingModel, { IBooking } from '../model/schemas/booking.schema';
import { Booking } from '../model/booking.entities';

export class BookingRepository implements IBookingRepository {
 

  async getAllBookings(): Promise<IBooking[]|IBooking | null> {
    try {
      const Bookings = BookingModel.find();
      return Bookings;
    } catch (e: any) {
      throw new Error('db error');
    }
  }

 
}
