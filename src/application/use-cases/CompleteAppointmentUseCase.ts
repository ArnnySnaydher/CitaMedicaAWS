import { inject, injectable } from 'tsyringe';
import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';

@injectable()
export class CompleteAppointmentUseCase {
  constructor(
    @inject('IAppointmentRepository') private repository: IAppointmentRepository
  ) {}

  async execute(id: string, insuredId: string): Promise<void> {
    await this.repository.updateStatus(id, insuredId, 'completed');
  }
}
