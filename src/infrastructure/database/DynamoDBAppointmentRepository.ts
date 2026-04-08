import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { Appointment } from '../../domain/entities/Appointment';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export class DynamoDBAppointmentRepository implements IAppointmentRepository {
  private docClient: DynamoDBDocumentClient;
  private tableName = process.env.DYNAMODB_TABLE || 'appointments-table-dev';

  constructor() {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async save(appointment: Appointment): Promise<Appointment> {
    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: appointment
      })
    );
    return appointment;
  }

  async updateStatus(id: string, insuredId: string, status: string): Promise<void> {
    await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: 'set #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':updatedAt': new Date().toISOString()
        }
      })
    );
  }

  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    const response = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'InsuredIdIndex',
        KeyConditionExpression: 'insuredId = :insuredId',
        ExpressionAttributeValues: {
          ':insuredId': insuredId
        }
      })
    );
    return (response.Items as Appointment[]) || [];
  }
}
