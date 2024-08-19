# PatientDataProcessor

PatientDataProcessor is a Node.js application that processes structured plain-text messages containing patient information. It extracts relevant data, stores it in a database, and provides an API for submitting messages and retrieving processed data.

## Application Overview

The application follows a modular, layered architecture to ensure separation of concerns, maintainability, and scalability.

### 1. API Layer
- **ExpressJS server**: Handles incoming HTTP requests and routes them to appropriate controllers.
- **Controllers**: Manage request/response lifecycle, input validation, and coordinate between services.
- **Middleware**: Handles cross-cutting concerns like authentication, logging, and error handling.

### 2. Business Logic Layer
- **Services**: Implement core business logic, including message parsing and data extraction.
- **Models**: Define data structures and validation rules for patient information.

### 3. Data Access Layer
- **Repositories**: Abstract database operations, providing a clean interface for data persistence.
- **Database**: Stores processed patient information in MongoDB.

### 4. Utility Modules
- **Error Handling**: Custom error classes and centralised error handling middleware.
- **Logging**: Structured logging for monitoring and debugging.
- **Validation**: Input validation utilities using libraries like Joi or Yup.

### 5. Configuration
- Environment-based configuration management for different deployment scenarios.

### 6. Testing
- Unit tests for individual components.
- Integration tests for API endpoints and database interactions.

## Running the Application
1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Start the application: `npm start`

## API Endpoints

- **POST /api/patient-data/process**
  - Request: A plain-text message in the required format.
  - Response: Extracted patient data in JSON format.
  - Error Handling: Returns meaningful error messages for incorrect or missing data.

## Error Handling and Logging
- Implement a centralized error handling middleware to catch and format all errors.
- Use a structured logging solution (e.g., Winston) to log errors, warnings, and important events.
- Include relevant context (e.g., request ID, user ID) in logs for easier debugging.

## Scalability and Future Extensions
- Use asynchronous processing for time-consuming tasks.
- Implement caching strategies to reduce database load.
- Design the API with versioning to allow for future changes without breaking existing clients.
- Use dependency injection to make the application more modular and easier to extend.
- Consider implementing a message queue (e.g., RabbitMQ, Apache Kafka) for handling high message volumes and ensuring fault tolerance.



