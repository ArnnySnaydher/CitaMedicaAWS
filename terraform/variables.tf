variable "aws_region" {
  description = "Región de AWS"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nombre del proyecto base"
  type        = string
  default     = "citamedica-serverless"
}

variable "dynamodb_table_name" {
  description = "Nombre DynamoDB (estado state/pending)"
  type        = string
  default     = "appointments-table-dev"
}

variable "mysql_server_name" {
  description = "Endpoint del RDS MySQL (ya existente)"
  type        = string
  default     = "mysql-citamedica-001"
}

variable "mysql_admin_login" {
  description = "Usuario MySQL"
  type        = string
  default     = "dbadmin"
}

variable "mysql_admin_password" {
  description = "Contraseña MySQL"
  type        = string
  sensitive   = true
  default     = "P@ssw0rd1234!"
}

variable "sns_topic_name" {
  description = "Nombre SNS Topic"
  type        = string
  default     = "appointments-topic"
}

variable "sqs_pe_name" {
  description = "Cola SQS Perú"
  type        = string
  default     = "SQS_PE"
}

variable "sqs_cl_name" {
  description = "Cola SQS Chile"
  type        = string
  default     = "SQS_CL"
}

variable "sqs_completion_name" {
  description = "Cola SQS Finalización"
  type        = string
  default     = "SQS_Confirmation"
}

variable "eventbus_name" {
  description = "Bus de Eventos (EventBridge)"
  type        = string
  default     = "appointments-bus"
}
