import { IPublisher } from '../../domain/messaging/IPublisher';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

export class EventBridgePublisher implements IPublisher {
  private eb: EventBridgeClient;

  constructor() {
    this.eb = new EventBridgeClient({ region: process.env.AWS_REGION || 'us-east-1' });
  }

  async publish(busName: string, message: any, attributes?: any): Promise<void> {
    await this.eb.send(
      new PutEventsCommand({
        Entries: [
          {
            EventBusName: busName,
            Source: attributes?.source || 'appointments.system',
            DetailType: attributes?.detailType || 'AppointmentEvent',
            Detail: JSON.stringify(message)
          }
        ]
      })
    );
  }
}
