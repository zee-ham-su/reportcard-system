# School Report Portal - Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **MongoDB Atlas Account** (or local MongoDB installation)

## Installation Steps

### 1. Clone and Install Dependencies

```bash
cd /home/shai/reportcard-system
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:

```env
# Environment Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/school-report-portal?retryWrites=true&w=majority

# JWT Configuration (Generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=24h

# Application Configuration
APP_NAME=School Report Portal
APP_VERSION=1.0.0
```

### 3. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update the `MONGODB_URI` in `.env`

### 4. Start the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, visit:
- **API Documentation**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/v1

## Default User Creation

After starting the application, you can create an admin user by making a POST request to:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "admin123456",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

## Project Structure

```
src/
├── auth/              # Authentication module
├── users/             # User management
├── students/          # Student management
├── teachers/          # Teacher management
├── subjects/          # Subject management
├── classes/           # Class management
├── marks/             # Marks/grades management
├── reports/           # PDF report generation
├── common/            # Shared types and utilities
├── app.module.ts      # Main application module
└── main.ts           # Application entry point
```

## Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Features

### Core Modules

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (Admin, Teacher, Student)
   - User registration and login

2. **User Management**
   - Create and manage user accounts
   - Role assignment
   - Profile management

3. **Student Management**
   - Student registration
   - Class assignment
   - Personal information management

4. **Teacher Management**
   - Teacher profiles
   - Subject assignment
   - Class management

5. **Subject Management**
   - Create and manage subjects
   - Credit system
   - Subject categories

6. **Class Management**
   - Class creation and management
   - Student enrollment
   - Teacher assignment

7. **Marks Management**
   - Enter and update student marks
   - Automatic grade calculation
   - Term-based marking system

8. **Report Generation**
   - PDF report card generation
   - Student-specific reports
   - Academic year and term filtering

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

#### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

#### Students
- `POST /api/v1/students` - Create student
- `GET /api/v1/students` - Get all students
- `GET /api/v1/students/:id` - Get student by ID
- `PUT /api/v1/students/:id` - Update student
- `DELETE /api/v1/students/:id` - Delete student

#### Teachers
- `POST /api/v1/teachers` - Create teacher
- `GET /api/v1/teachers` - Get all teachers
- `GET /api/v1/teachers/:id` - Get teacher by ID
- `PUT /api/v1/teachers/:id` - Update teacher
- `DELETE /api/v1/teachers/:id` - Delete teacher

#### Subjects
- `POST /api/v1/subjects` - Create subject
- `GET /api/v1/subjects` - Get all subjects
- `GET /api/v1/subjects/:id` - Get subject by ID
- `PUT /api/v1/subjects/:id` - Update subject
- `DELETE /api/v1/subjects/:id` - Delete subject

#### Classes
- `POST /api/v1/classes` - Create class
- `GET /api/v1/classes` - Get all classes
- `GET /api/v1/classes/:id` - Get class by ID
- `PUT /api/v1/classes/:id` - Update class
- `DELETE /api/v1/classes/:id` - Delete class

#### Marks
- `POST /api/v1/marks` - Create mark entry
- `GET /api/v1/marks` - Get all marks
- `GET /api/v1/marks/student/:studentId` - Get marks by student
- `PUT /api/v1/marks/:id` - Update mark
- `DELETE /api/v1/marks/:id` - Delete mark

#### Reports
- `GET /api/v1/reports/student/:studentId` - Generate student report card (PDF)
- `GET /api/v1/reports/class/:classId` - Generate class report

## Development Guidelines

### Code Structure
- Follow NestJS conventions and best practices
- Use TypeScript for type safety
- Implement proper error handling
- Add comprehensive validation using class-validator
- Use Swagger for API documentation

### Database Design
- MongoDB with Mongoose ODM
- Proper schema validation
- Indexing for performance
- Relationships using ObjectId references

### Security
- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Role-based access control

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your MongoDB URI in `.env`
   - Check network connectivity
   - Ensure IP is whitelisted in MongoDB Atlas

2. **Authentication Issues**
   - Check JWT_SECRET is properly set
   - Verify token format in Authorization header

3. **Build Errors**
   - Ensure all dependencies are installed
   - Check TypeScript configuration
   - Verify import paths

### Getting Help

For additional support:
1. Check the API documentation at `/api/docs`
2. Review the logs for detailed error messages
3. Ensure all environment variables are properly configured

## License

This project is licensed under the MIT License.
