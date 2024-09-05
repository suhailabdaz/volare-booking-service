import { IBookingRepository } from '../interfaces/iBookingRepository';
import BookingModel, { IBooking } from '../model/schemas/booking.schema';
import { Booking } from '../model/booking.entities';
import { BookingStatus } from '../interfaces/Status.enums';
import { Coupon } from '../model/coupon.entities';
import mongoose from 'mongoose';
import { contactDetails } from '../interfaces/iBookingInterface';

export class BookingRepository implements IBookingRepository {
  async initiateBooking(data: Booking): Promise<IBooking | null> {
    try {
      const booking = new BookingModel({
        userId: data.userId,
        flightChartId: data.flightChartId,
        status: BookingStatus.pending,
        paymentStatus: BookingStatus.pending,
        travelClass: data.travelClass,
        departureTime: data.departureTime,
        travellerType: data.travellerType,
        totalPrice: data.totalPrice,
        travellers: [],
        seats: [],
        fareType: data.fareType || 'Regular',
        fareBreakdown: data.fareBreakdown,
      });
      await booking.save();
      return booking;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async findById(id: string): Promise<IBooking | null> {
    try {
      const Booking = await BookingModel.findById(id);
      return Booking;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async addTraveller(
    id: string,
    travellers: Array<any>,
    contactDetails:contactDetails
  ): Promise<IBooking | null> {
    try {
      const booking = await BookingModel.findByIdAndUpdate(
        id,
        {
          travellers: travellers,
          status: BookingStatus.addedTraveller,
          contactDetails:contactDetails
        },
        { new: true }
      );
      if (!booking) {
        throw new Error('Booking not found');
      }
      return booking;
    } catch (e: any) {
      throw new Error(e.message || 'Error adding traveller');
    }
  }

  async seatSelection(id: string, seats: Array<any>): Promise<IBooking | null> {
    try {
      const booking = await BookingModel.findByIdAndUpdate(
        id,
        {
          seats: seats,
          status: BookingStatus.addedSeatBooking,
        },
        { new: true }
      );

      return booking;
    } catch (e: any) {
      throw new Error(e.message || 'error adding seat');
    }
  }

  async paymentCompleted(
    bookingId: string,
    paymentId: string
  ): Promise<IBooking | null> {
    const booking = await BookingModel.findById(bookingId);
    if (booking) {
      booking.paymentStatus = 'completed';
      booking.status = 'confirmed';
      booking.paymentId = paymentId;
      await booking.save();
    }
    return booking;
  }

  async applyCoupon(
    bookingId: string,
    coupon: Coupon
  ): Promise<IBooking | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await BookingModel.findById(bookingId).session(session);

      if (!booking) { 
        throw new Error('Booking not found');
      }
      const discountAmount = (booking.totalPrice * coupon.discount) / 100;
      const newTotalPrice = booking.totalPrice - discountAmount;

      booking.totalPrice = newTotalPrice;
      booking.couponCode = coupon.coupon_code;
      booking.fareBreakdown.couponDiscount = discountAmount;
      await booking.save({ session });
      await session.commitTransaction();
      return booking;
    } catch (error) {
      await session.abortTransaction();
      console.error('Error applying coupon', error);
      throw error;
    } finally {
      session.endSession();
    }
  }
}
