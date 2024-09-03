import { IBookingRepository } from '../interfaces/iBookingRepository';
import BookingModel, { IBooking } from '../model/schemas/booking.schema';
import { Booking } from '../model/booking.entities';
import { BookingStatus } from '../interfaces/Status.enums';

export class BookingRepository implements IBookingRepository {

  async initiateBooking(data:Booking): Promise<IBooking | null> {
    try {
      const booking = new BookingModel({
        userId: data.userId,
        flightChartId: data.flightChartId,
        status: BookingStatus.pending,
        paymentStatus: BookingStatus.pending,
        travelClass: data.travelClass,
        departureTime:data.departureTime,
        travellerType: data.travellerType,
        totalPrice: data.totalPrice,
        travellers: [], 
        seats: [],
        fareType:data.fareType || 'Regular',
        fareBreakdown:data.fareBreakdown
    });
    await booking.save();
    return booking;
        } catch (e: any) {
      throw new Error(e);
    }
  }

  async findById(id: string): Promise<IBooking | null> {
      try{
          const Booking = await BookingModel.findById(id)
          return Booking
      }catch (e: any) {
      throw new Error(e);
    }
  }

  async addTraveller(id: string, travellers: Array<any>): Promise<IBooking | null> {
    try {
        const booking = await BookingModel.findByIdAndUpdate(
            id,
            { 
                travellers: travellers,
                status: BookingStatus.addedTraveller
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
    try{
      const booking = await BookingModel.findByIdAndUpdate(
        id,
        { 
            seats: seats,
            status: BookingStatus.addedSeatBooking
        },
        { new: true }
    );  
    
    return booking
  }catch(e:any){
      throw new Error(e.message || 'error adding seat');
    }
}

async  paymentCompleted(bookingId: string,paymentId:string): Promise<IBooking | null> {
  const booking = await BookingModel.findById(bookingId);
  if (booking) {
      booking.paymentStatus = 'completed';
      booking.status= 'confirmed';
      booking.paymentId=paymentId;
      await booking.save();
  }
  return booking;
}

}
