import { IBooking } from "../model/schemas/booking.schema";
import { Booking } from "../model/booking.entities";
import { Coupon } from "../model/coupon.entities";
import { contactDetails } from "./iBookingInterface";


export interface IBookingRepository {
  initiateBooking(data:Booking):Promise<IBooking | null>;
  findById(id:string):Promise<IBooking | null>;
  addTraveller(id:string,travellers:Array<any>,contactDetails:contactDetails):Promise<IBooking | null>;
  seatSelection(id:string,travellers:Array<any>):Promise<IBooking | null>;
  paymentCompleted(bookingId:string,paymentId:string):Promise<IBooking | null>;
  applyCoupon(bookingId:string,coupon:Coupon|null):Promise<IBooking | null>
}
