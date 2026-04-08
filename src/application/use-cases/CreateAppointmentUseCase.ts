import { inject, injectable } from 'tsyringe';
import { Appointment } from '../../domain/entities/Appointment';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { IPublisher } from '../../domain/messaging/IPublisher';
import { randomUUID } from 'crypto';

@injectable()
export class CreateAppointmentUseCase {
  constructor(
    @inject('IAppointmentRepository') private repository: IAppointmentRepository,
    @inject('SNSAppointmentPublisher') private publisher: IPublisher
  ) {}

  async execute(data: { insuredId: string; scheduleId: number; countryISO: 'PE' | 'CL' }): Promise<Appointment> {
    const appointment: Appointment = {
      id: randomUUID(),
      insuredId: data.insuredId,
      scheduleId: data.scheduleId,
      countryISO: data.countryISO,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // 1. Guardar estado pending en Dynamo
    await this.repository.save(appointment);

    // 2. Enviar información al SNS (enrutará a SQS base al countryISO)
    await this.publisher.publish(process.env.SNS_TOPIC_ARN || '', appointment, {
      countryISO: data.countryISO
    });

    return appointment;
  }
}
