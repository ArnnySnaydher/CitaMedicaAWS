import 'reflect-metadata';
import { SQSEvent } from 'aws-lambda';
import { AppointmentController } from '../../interface-adapters/controllers/AppointmentController';

const controller = new AppointmentController();

export const main = async (event: SQSEvent): Promise<void> => {
  console.log('Appointment PE handler triggered', JSON.stringify(event));
  await controller.processSQSMessage(event);
};
