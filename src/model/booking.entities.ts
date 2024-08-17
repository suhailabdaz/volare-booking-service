export class Booking {
  constructor(
    public readonly userId: string,
    public readonly flightChartId: string,
    public readonly travellers: string[],
    public readonly seats: {
      seatNumber: string;
      travellerId: string;
      class: 'economy' | 'business' | 'firstClass';
    }[],
    public readonly totalPrice: number,
    public status: 'pending' | 'confirmed' | 'cancelled',
    public paymentStatus: 'pending' | 'completed' | 'failed',
    public readonly _id?: string,
    public paymentId?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}