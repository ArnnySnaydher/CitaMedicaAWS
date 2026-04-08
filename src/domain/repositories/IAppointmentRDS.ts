import { Appointment } from '../entities/Appointment';

export interface IAppointmentRDS {
  saveToCountryDatabase(appointment: Appointment): Promise<boolean>;
}
