import { IBooking } from "../model/schemas/booking.schema";
import { Booking } from "../model/booking.entities";


export interface IBookingRepository {
  initiateBooking(data:Booking):Promise<IBooking | null>;
  findById(id:string):Promise<IBooking | null>;
  addTraveller(id:string,travellers:Array<any>):Promise<IBooking | null>;
  seatSelection(id:string,travellers:Array<any>):Promise<IBooking | null>;
}
