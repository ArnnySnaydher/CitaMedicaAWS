import { container } from '../../infrastructure/container';
import { CreateAppointmentUseCase } from '../../application/use-cases/CreateAppointmentUseCase';
import { GetAppointmentsUseCase } from '../../application/use-cases/GetAppointmentsUseCase';
import { ProcessAppointmentUseCase } from '../../application/use-cases/ProcessAppointmentUseCase';
import { CompleteAppointmentUseCase } from '../../application/use-cases/CompleteAppointmentUseCase';
import { Appointment } from '../../domain/entities/Appointment';
import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent } from 'aws-lambda';

export class AppointmentController {
  
  async createAppointment(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const body = JSON.parse(event.body || '{}');
      if (!body.insuredId || !body.scheduleId || !body.countryISO) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Validation Error' }) };
      }
      const useCase = container.resolve(CreateAppointmentUseCase);
      const result = await useCase.execute({
        insuredId: body.insuredId,
        scheduleId: body.scheduleId,
        countryISO: body.countryISO
      });
      return { statusCode: 201, body: JSON.stringify(result) };
    } catch (e: any) {
      return { statusCode: 500, body: JSON.stringify({ message: e.message }) };
    }
  }

  async getAppointments(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const insuredId = event.pathParameters?.insuredId;
      if (!insuredId) return { statusCode: 400, body: 'Missing parameter' };

      const useCase = container.resolve(GetAppointmentsUseCase);
      const result = await useCase.execute(insuredId);
      return { statusCode: 200, body: JSON.stringify(result) };
    } catch (e: any) {
      return { statusCode: 500, body: JSON.stringify({ message: e.message }) };
    }
  }

  async processSQSMessage(event: SQSEvent): Promise<void> {
    const useCase = container.resolve(ProcessAppointmentUseCase);
    for (const record of event.Records) {
      // SNS envuelve el mensaje dentro de 'Message'
      const body = JSON.parse(record.body);
      let appointment: Appointment;
      
      if (body.Message) {
        appointment = JSON.parse(body.Message);
      } else {
        appointment = body as Appointment;
      }
      
      await useCase.execute(appointment);
    }
  }

  async handleConfirmationMessage(event: SQSEvent): Promise<void> {
    const useCase = container.resolve(CompleteAppointmentUseCase);
    for (const record of event.Records) {
      // EventBridge envuelve el detalle en la propiedad 'detail'
      const body = JSON.parse(record.body);
      const appointment: Appointment = body.detail || body;
      
      if (!appointment.id || !appointment.insuredId) continue;
      await useCase.execute(appointment.id, appointment.insuredId);
    }
  }
}
