import { inject, injectable } from 'tsyringe';
import { Appointment } from '../../domain/entities/Appointment';
import { IAppointmentRDS } from '../../domain/repositories/IAppointmentRDS';
import { IPublisher } from '../../domain/messaging/IPublisher';

@injectable()
export class ProcessAppointmentUseCase {
  constructor(
    @inject('IAppointmentRDS') private rdsRepository: IAppointmentRDS,
    @inject('EventBridgePublisher') private publisher: IPublisher
  ) {}

  async execute(appointment: Appointment): Promise<void> {
    try {
      // 1. Guardar localmente en el país correspondiente (MySQL)
      await this.rdsRepository.saveToCountryDatabase(appointment);

      // 2. Emitir conformidad por EventBridge
      await this.publisher.publish(
        process.env.EVENT_BUS_NAME || '',
        appointment,
        {
          source: `appointments.${appointment.countryISO.toLowerCase()}`,
          detailType: 'AppointmentConfirmed'
        }
      );
    } catch (err) {
      console.error(`Error processing appointment for ${appointment.countryISO}`, err);
      throw err;
    }
  }
}
