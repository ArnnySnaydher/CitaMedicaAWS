import 'reflect-metadata';
import { container } from 'tsyringe';

// Implementaciones
import { DynamoDBAppointmentRepository } from './database/DynamoDBAppointmentRepository';
import { MySQLAppointmentRepository } from './database/MySQLAppointmentRepository';
import { SNSPublisher } from './messaging/SNSPublisher';
import { EventBridgePublisher } from './messaging/EventBridgePublisher';

// Registrar tokens
container.register('IAppointmentRepository', {
  useClass: DynamoDBAppointmentRepository
});

container.register('IAppointmentRDS', {
  useClass: MySQLAppointmentRepository
});

container.register('SNSAppointmentPublisher', {
  useClass: SNSPublisher
});

container.register('EventBridgePublisher', {
  useClass: EventBridgePublisher
});

export { container };
