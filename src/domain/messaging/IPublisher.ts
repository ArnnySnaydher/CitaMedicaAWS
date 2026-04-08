export interface IPublisher {
  publish(topicOrBus: string, message: any, attributes?: any): Promise<void>;
}
