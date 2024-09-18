import { Booking } from "../model/booking.entities";
import { Coupon } from "../model/coupon.entities";
import { IBooking } from "../model/schemas/booking.schema";

export interface contactDetails {
  phone: string;
  email: string;
}

export interface IBookingInterface {
  initiateBooking(data:Booking):any
  getBooking(data:string):any
  updateBooking(data:{bookingId:string,travellers:Array<any>,contactDetails:contactDetails}):any
  updateSeatBooking(data:{bookingId:string,seats:Array<any>}):any
  checkoutSession(data:{bookingId:string}):any
  ticketConfirmation(data:{bookingId:string,paymentId:string}):any
  applyCoupon(data:{bookingId:string,coupon:Coupon|null}):any
  getBookingByStatus(data:{id:string,status:string}):any
}
