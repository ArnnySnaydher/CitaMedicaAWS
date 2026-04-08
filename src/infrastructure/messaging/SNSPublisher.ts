import { IPublisher } from '../../domain/messaging/IPublisher';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export class SNSPublisher implements IPublisher {
  private sns: SNSClient;

  constructor() {
    this.sns = new SNSClient({ region: process.env.AWS_REGION || 'us-east-1' });
  }

  async publish(topicArn: string, message: any, attributes?: any): Promise<void> {
    const messageAttributes: any = {};
    
    if (attributes && attributes.countryISO) {
      messageAttributes['countryISO'] = {
        DataType: 'String',
        StringValue: attributes.countryISO
      };
    }

    await this.sns.send(
      new PublishCommand({
        TopicArn: topicArn,
        Message: JSON.stringify(message),
        MessageAttributes: Object.keys(messageAttributes).length > 0 ? messageAttributes : undefined
      })
    );
  }
}
