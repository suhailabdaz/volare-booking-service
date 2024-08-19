import { Booking } from "../model/booking.entities";
import { IBooking } from "../model/schemas/booking.schema";

export interface IBookingInterface {
  initiateBooking(data:Booking):any
  getBooking(data:string):any
  updateBooking(data:{bookingId:string,travellers:Array<any>}):any
}
