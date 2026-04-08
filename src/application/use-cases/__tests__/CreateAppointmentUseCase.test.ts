import 'reflect-metadata';
import { CreateAppointmentUseCase } from '../CreateAppointmentUseCase';
import { IAppointmentRepository } from '../../../domain/repositories/IAppointmentRepository';
import { IPublisher } from '../../../domain/messaging/IPublisher';
import { Appointment } from '../../../domain/entities/Appointment';

describe('CreateAppointmentUseCase', () => {
  let useCase: CreateAppointmentUseCase;
  let mockRepository: jest.Mocked<IAppointmentRepository>;
  let mockPublisher: jest.Mocked<IPublisher>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      updateStatus: jest.fn(),
      findByInsuredId: jest.fn(),
    };

    mockPublisher = {
      publish: jest.fn(),
    };

    useCase = new CreateAppointmentUseCase(mockRepository, mockPublisher);
  });

  it('should create an appointment and publish an event', async () => {
    const payload = {
      insuredId: '12345',
      scheduleId: 101,
      countryISO: 'PE' as 'PE' | 'CL'
    };

    const result = await useCase.execute(payload);

    expect(result).toBeDefined();
    expect(result.status).toBe('pending');
    expect(result.countryISO).toBe('PE');

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockPublisher.publish).toHaveBeenCalledTimes(1);
    expect(mockPublisher.publish).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        insuredId: '12345',
        status: 'pending'
      }),
      { countryISO: 'PE' }
    );
  });
});
