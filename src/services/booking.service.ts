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
 
  async getAllBookings() {
    try {
      const users = await this.repository.getAllBookings();
      return { success: true, users: users };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error resending OTP: ${error.message}`);
      }
      throw error;
    }
  }

}
