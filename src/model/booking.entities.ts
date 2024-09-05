export class Booking {
  constructor(
    public readonly userId: string,
    public readonly flightChartId: string,
    public readonly fareType: string,
    public readonly travellers: Array<{}>,
    public readonly travelClass: string,
    public readonly seats: {
      seatNumber: string;
      travellerId: string;
      class: 'economyClass' | 'businessClass' | 'firstClass';
    }[],
    public readonly totalPrice: number,
    public readonly travellerType: {
      adults: number;
      children: number;
      infants: number;
    },
    public readonly fareBreakdown: {
      baseFare: number;
      taxAmount: number;
      chargesAmount: number;
      couponDiscount: number;
    },
    public status: 'pending' | 'confirmed' | 'cancelled' | 'traveller' | 'seats' | 'expired',
    public paymentStatus: 'pending' | 'completed' | 'failed',
    public departureTime: Date,
    public readonly contactDetails: {
      phone: string;
      email: string;
    },
    public readonly _id?: string,
    public paymentId?: string,
    public readonly couponCode?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}