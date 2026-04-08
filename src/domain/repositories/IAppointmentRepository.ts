import { Appointment } from '../entities/Appointment';

export interface IAppointmentRepository {
  save(appointment: Appointment): Promise<Appointment>;
  updateStatus(id: string, insuredId: string, status: string): Promise<void>;
  findByInsuredId(insuredId: string): Promise<Appointment[]>;
}
