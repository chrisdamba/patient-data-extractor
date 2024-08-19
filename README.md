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


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (version 18 or later)
- npm (usually comes with Node.js)
- MongoDB (for database storage)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/chrisdamba/patient-data-extractor.git
   cd patient-data-extractor
   ```

2. Install dependencies:
   ```
   npm install
   ```


### Running the Application

To start the server in development mode:

```
npm run dev
```

The server will start on `http://localhost:3000` by default.

### Running Tests

To run the test suite:

```
npm test
```

## Testing the Express.js API Endpoint Using Postman

Follow these steps to test the API endpoint:

1. Open Postman.

2. Create a new POST request.

3. Set the request URL to `http://localhost:3000/api/patient-data/process`.

4. In the Headers tab, add a new header:
   - Key: `Content-Type`
   - Value: `application/json`

5. In the Body tab:
   - Select `raw`
   - Choose `JSON` from the dropdown
   - Enter the following JSON:

     ```json
     {
       "message": "EVT|TYPE|20230502112233\nPRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19700101|\nDET|1|I|^^MainDepartment^101^Room 1|Common Cold"
     }
     ```

6. Click "Send" to make the request.

7. You should receive a response with status 200 and a JSON body containing the extracted patient data:

   ```json
   {
     "fullName": {
       "lastName": "Smith",
       "firstName": "John",
       "middleName": "A"
     },
     "dateOfBirth": "1970-01-01",
     "primaryCondition": "Common Cold"
   }
   ```

## API Documentation

### POST /api/patient-data/process

Processes a patient data message.

**Request Body:**

```json
{
  "message": "string"
}
```

**Response:**

- Status: 200 OK
- Body: Extracted patient data

```json
{
  "fullName": {
    "lastName": "string",
    "firstName": "string",
    "middleName": "string"
  },
  "dateOfBirth": "string",
  "primaryCondition": "string"
}
```

**Error Responses:**

- 400 Bad Request: If the message is missing or invalid
- 500 Internal Server Error: If there's an error processing the message

## Built With

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)
