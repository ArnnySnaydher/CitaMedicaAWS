export type AppointmentStatus = 'pending' | 'completed' | 'failed';

export interface AppointmentRequest {
  insuredId: string;
  scheduleId: number;
  countryISO: 'PE' | 'CL';
}

export interface Appointment {
  id?: string;
  insuredId: string;
  scheduleId: number;
  countryISO: 'PE' | 'CL';
  status: AppointmentStatus;
  createdAt?: string;
  updatedAt?: string;
}
