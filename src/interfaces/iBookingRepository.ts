import { IBooking } from "../model/schemas/booking.schema";
import { Booking } from "../model/booking.entities";


export interface IBookingRepository {
  getAllBookings(): Promise<IBooking[]|IBooking | null>;
   
}
