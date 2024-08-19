import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  flightChartId: mongoose.Schema.Types.ObjectId;
  travellers:[];
  travelClass: string;
  seats: {
    seatNumber: string;
    travellerId: mongoose.Schema.Types.ObjectId;
    class: 'economy' | 'business' | 'firstClass';
  }[];
  totalPrice: number;
  travellerType: {
    adults: number;
    children: number;
    infants: number;
  };
  fareBreakdown: {
    baseFare: number;
    taxAmount: number;
    chargesAmount: number;
  };
  fareType: string;
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
  fareType:{
    type:String
  },
  travellers: [],
  travelClass: {
    type: String,
    required: true
  },
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
  travellerType: {
    adults: { type: Number, required: true },
    children: { type: Number, required: true },
    infants: { type: Number, required: true }
  },
  fareBreakdown: {
    baseFare: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    chargesAmount: { type: Number, required: true }
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