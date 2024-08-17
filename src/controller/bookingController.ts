import { IBookingInterface } from '../interfaces/iBookingInterface';

export class BookingController {
  private service: IBookingInterface;

  constructor(service: IBookingInterface) {
    this.service = service;
  }

getAllBookings = async () => {
    try {
      const response = await this.service.getAllBookings();
      return response;
    } catch (e: any) {
      console.log(e);
    }
  };

}
