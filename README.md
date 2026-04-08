# Sistema de Agendamiento Médico Serverless (AWS)

Este proyecto implementa un backend escalable para el agendamiento de citas médicas utilizando una arquitectura híbrida de **Terraform** (para infraestructura base) y **Serverless Framework** (para lógica de negocio).

## 🚀 Arquitectura: Clean Architecture + SOLID
El proyecto sigue los principios de **Clean Architecture**, dividiendo la lógica en capas para garantizar mantenibilidad y testabilidad:

- **Domain**: Entidades de negocio y contratos (interfaces).
- **Application**: Casos de uso puros (Crear, Procesar, Completar).
- **Infrastructure**: Implementaciones técnicas (AWS SDK, MySQL).
- **Interface Adapters**: Controladores y transformadores de entrada (API/SQS).

## 🏗️ Stack Tecnológico
- **Lenguaje**: Node.js + TypeScript.
- **Infraestructura**: AWS (Lambda, DynamoDB, SNS, SQS, EventBridge).
- **IaC**: Terraform (Recursos persistentes) y Serverless Framework (Funciones).
- **Base de Datos**: DynamoDB (Estado de cita) y MySQL (Simulado para registros regionales).
- **Testing**: Jest con TS-Jest.
- **Documentación**: Swagger/OpenAPI (Auto-generado).

## 📊 Diagrama de Flujo
1. **API Gateway** recibe la solicitud y activa la Lambda `appointment`.
2. Se registra en **DynamoDB** con estado `pending`.
3. Se publica un mensaje en **SNS** con un filtro por país (`PE` o `CL`).
4. **SNS** enruta el mensaje a la cola **SQS** correspondiente.
5. Una Lambda regional (`appointment_pe` o `cl`) procesa el mensaje y guarda en **MySQL**.
6. Se emite un evento a **EventBridge**.
7. Una regla de EventBridge captura el éxito y lo envía a una cola de **Confirmación**.
8. La Lambda principal actualiza el estado en **DynamoDB** a `completed`.

## 🛠️ Cómo Desplegar

### 1. Infraestructura Base (Terraform)
```bash
cd terraform
terraform init
terraform apply -auto-approve
```

### 2. Backend (Serverless)
```bash
npm install
npx serverless deploy
```

## 📖 Documentación de la API
Una vez desplegado, puedes acceder a :
`https://<api-id>.execute-api.us-east-1.amazonaws.com/swagger`

## 🧪 Pruebas Unitarias
```bash
npx jest
```

---
*Desarrollado como parte de la prueba técnica de arquitectura serverless AWS.*
