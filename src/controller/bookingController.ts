import { IBookingInterface } from '../interfaces/iBookingInterface';
import { Booking } from '../model/booking.entities';

export class BookingController {
  private service: IBookingInterface;

  constructor(service: IBookingInterface) {
    this.service = service;
  }

  
  initiateBooking = async (data:Booking) => {
    try {
      
      const response = await this.service.initiateBooking(data);
      return response;
    } catch (e: any) {
      console.log(e);
    }
  };

  getBooking = async (data:string) => {
    try {
      
      const response = await this.service.getBooking(data);
      return response;
    } catch (e: any) {
      console.log(e);
    }
  };

  updateBooking = async (data:{bookingId:string,travellers:Array<any>}) => {
    try {
      const response = await this.service.updateBooking(data);
      return response;
    } catch (e: any) {
      console.log(e);
    }
  };

  updateSeatBooking = async (data:{bookingId:string,seats:Array<any>}) => {
    try {
      const response = await this.service.updateSeatBooking(data);
      return response;
    } catch (e: any) {
      console.log(e);
    }
  };

  checkoutSession = async (data:{bookingId:string}) => {
    try {
      const response = await this.service.checkoutSession(data);
      return response;
    } catch (e: any) {
      console.log(e);
    }
  };
}
