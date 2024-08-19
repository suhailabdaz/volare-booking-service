import { IBookingInterface } from '../interfaces/iBookingInterface';
import { IBookingRepository } from '../interfaces/iBookingRepository';
import { Booking } from '../model/booking.entities';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { MongoError } from 'mongodb';

export class BookingService implements IBookingInterface {
  private repository: IBookingRepository;

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

  async updateBooking(data:{bookingId:string,travellers:Array<any>}) {
    try {

      const booking = await this.repository.addTraveller(data.bookingId,data.travellers);
      return booking
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting booking: ${error.message}`);
      }
      throw error;
    }
  }

}
