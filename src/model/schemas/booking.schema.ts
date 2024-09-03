import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  flightChartId: mongoose.Schema.Types.ObjectId;
  travellers:Array<{}>;
  travelClass: string;
  seats: {
    seatNumber: string;
    travellerId: string;
    class: 'economyClass' | 'businessClass' | 'firstClass';
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
  status: 'pending' | 'confirmed' | 'cancelled'|'traveller'|'seats'|'expired';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  departureTime: Date; 

}

const bookingSchema: Schema<IBooking> = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  flightChartId: {
    type: Schema.Types.ObjectId,
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
  departureTime: {
    type: Date,
    required: true
  },
  seats: [{
    seatNumber: String,
    travellerId: {
      type: String,
    },
    class: {
      type: String,
      enum: ['economyClass', 'businessClass', 'firstClass']
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

bookingSchema.statics.updateExpiredBookings = async function() {
  const currentTime = new Date();
  await this.updateMany(
    { 
      departureTime: { $lt: currentTime },
      status: { $in: ['pending', 'confirmed', 'traveller', 'seats'] }
    },
    { $set: { status: 'expired' } }
  );
};


bookingSchema.pre(['find', 'findOne'], async function() {
  await (this.model as any).updateExpiredBookings();
});


const BookingModel: Model<IBooking> = mongoose.model('Bookings', bookingSchema);
export default BookingModel;