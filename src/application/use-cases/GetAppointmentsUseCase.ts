import { inject, injectable } from 'tsyringe';
import { Appointment } from '../../domain/entities/Appointment';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';

@injectable()
export class GetAppointmentsUseCase {
  constructor(
    @inject('IAppointmentRepository') private repository: IAppointmentRepository
  ) {}

  async execute(insuredId: string): Promise<Appointment[]> {
    return this.repository.findByInsuredId(insuredId);
  }
}
