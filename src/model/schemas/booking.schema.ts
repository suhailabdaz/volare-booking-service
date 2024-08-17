import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  flightChartId: mongoose.Schema.Types.ObjectId;
  travellers: mongoose.Schema.Types.ObjectId[];
  seats: {
    seatNumber: string;
    travellerId: mongoose.Schema.Types.ObjectId;
    class: 'economy' | 'business' | 'firstClass';
  }[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
}

const bookingSchema: Schema<IBooking> = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  flightChartId: {
    type: Schema.Types.ObjectId,
    ref: 'FlightCharts',
    required: true
  },
  travellers: [{
    type: Schema.Types.ObjectId,
    ref: 'Traveller'
  }],
  seats: [{
    seatNumber: String,
    travellerId: {
      type: Schema.Types.ObjectId,
      ref: 'Traveller'
    },
    class: {
      type: String,
      enum: ['economy', 'business', 'firstClass']
    }
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentId: String
}, {
  timestamps: true
});

const BookingModel: Model<IBooking> = mongoose.model('Bookings', bookingSchema);
export default BookingModel;