import { IAppointmentRDS } from '../../domain/repositories/IAppointmentRDS';
import { Appointment } from '../../domain/entities/Appointment';

export class MySQLAppointmentRepository implements IAppointmentRDS {
  async saveToCountryDatabase(appointment: Appointment): Promise<boolean> {
    // Simulamos el guardado exitoso en la base de datos MySQL (PE o CL)
    // Se elimina el conector real (mysql2).
    console.log(`[MySQL Mock] Guardando cita ${appointment.id} en base de datos de ${appointment.countryISO}... OK`);
    return true;
  }
}
