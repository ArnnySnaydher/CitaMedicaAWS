import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { AppointmentController } from '../../interface-adapters/controllers/AppointmentController';

const controller = new AppointmentController();

export const main = async (event: APIGatewayProxyEvent | SQSEvent): Promise<APIGatewayProxyResult | void> => {
  console.log('Appointment handler triggered', JSON.stringify(event));
  
  if ('Records' in event) {
    // SQS evento confirmación
    await controller.handleConfirmationMessage(event);
    return;
  }

  // Soporta REST API V1 y HTTP API V2 payloads
  const isV2Method = (event as any).requestContext?.http?.method;
  const method = isV2Method ? isV2Method : event.httpMethod;

  if (method === 'POST') {
    return controller.createAppointment(event);
  } else if (method === 'GET') {
    return controller.getAppointments(event);
  }

  return { statusCode: 404, body: 'Not found' };
};
