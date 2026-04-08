terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# 1. Base de Datos (Reemplazo de Cosmos DB)
resource "aws_dynamodb_table" "appointments" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
  
  attribute {
    name = "insuredId"
    type = "S"
  }

  global_secondary_index {
    name               = "InsuredIdIndex"
    hash_key           = "insuredId"
    projection_type    = "ALL"
  }
}

# 2. Infraestructura de Mensajería (Reemplazo de Service Bus)
# 2.1 SNS Topic
resource "aws_sns_topic" "appointment_topic" {
  name = var.sns_topic_name
}

# 2.2 SQS Queues
resource "aws_sqs_queue" "pe_queue" {
  name = var.sqs_pe_name
}

resource "aws_sqs_queue" "cl_queue" {
  name = var.sqs_cl_name
}

resource "aws_sqs_queue" "completion_queue" {
  name = var.sqs_completion_name
}

# 2.3 Suscripciones SNS -> SQS con filtros
resource "aws_sns_topic_subscription" "pe_sub" {
  topic_arn = aws_sns_topic.appointment_topic.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.pe_queue.arn

  filter_policy = jsonencode({
    countryISO = ["PE"]
  })
}

resource "aws_sns_topic_subscription" "cl_sub" {
  topic_arn = aws_sns_topic.appointment_topic.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.cl_queue.arn

  filter_policy = jsonencode({
    countryISO = ["CL"]
  })
}

# Permitir a SNS enviar mensajes a SQS
resource "aws_sqs_queue_policy" "sns_to_pe" {
  queue_url = aws_sqs_queue.pe_queue.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = { Service = "sns.amazonaws.com" }
        Action = "sqs:SendMessage"
        Resource = aws_sqs_queue.pe_queue.arn
        Condition = {
          ArnEquals = { "aws:SourceArn" = aws_sns_topic.appointment_topic.arn }
        }
      }
    ]
  })
}

resource "aws_sqs_queue_policy" "sns_to_cl" {
  queue_url = aws_sqs_queue.cl_queue.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = { Service = "sns.amazonaws.com" }
        Action = "sqs:SendMessage"
        Resource = aws_sqs_queue.cl_queue.arn
        Condition = {
          ArnEquals = { "aws:SourceArn" = aws_sns_topic.appointment_topic.arn }
        }
      }
    ]
  })
}

# 3. EventBridge (Reemplazo de confirmaciones)
resource "aws_cloudwatch_event_bus" "appointments_bus" {
  name = var.eventbus_name
}

resource "aws_cloudwatch_event_rule" "confirmation_rule" {
  name           = "appointment-confirmation-rule"
  event_bus_name = aws_cloudwatch_event_bus.appointments_bus.name
  event_pattern  = jsonencode({
    source      = ["appointments.pe", "appointments.cl"]
    "detail-type" = ["AppointmentConfirmed"]
  })
}

resource "aws_cloudwatch_event_target" "sqs_target" {
  rule           = aws_cloudwatch_event_rule.confirmation_rule.name
  event_bus_name = aws_cloudwatch_event_bus.appointments_bus.name
  arn            = aws_sqs_queue.completion_queue.arn
}

resource "aws_sqs_queue_policy" "events_to_completion" {
  queue_url = aws_sqs_queue.completion_queue.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = { Service = "events.amazonaws.com" }
        Action = "sqs:SendMessage"
        Resource = aws_sqs_queue.completion_queue.arn
        Condition = {
          ArnEquals = { "aws:SourceArn" = aws_cloudwatch_event_rule.confirmation_rule.arn }
        }
      }
    ]
  })
}
