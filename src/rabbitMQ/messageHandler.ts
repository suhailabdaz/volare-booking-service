import { BookingController } from '../controller/bookingController';
import { BookingRepository } from '../repository/bookingRepository';
import { BookingService } from '../services/booking.service';
import rabbitClient from './client';

const userRepository = new BookingRepository();
const service = new BookingService(userRepository);
const controller = new BookingController(service);

export default class MessageHandler {
  static async handle(
    operation: string,
    data: any,
    correlationId: string,
    replyTo: string
  ) {
    let response = data;
    console.log('The operation in booking service is', operation, data);

    switch (operation) {
      case 'initiate-booking':
        response = await controller.initiateBooking.bind(controller)(data);
        break;
      case 'get-booking':
        response = await controller.getBooking.bind(controller)(data);
        break;
      case 'update-booking':
        response = await controller.updateBooking.bind(controller)(data);
        break;
      default:
        response = 'Request-key notfound';
        break;
    }
    await rabbitClient.produce(response, correlationId, replyTo);
  }
}
