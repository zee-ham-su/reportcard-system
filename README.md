# School Report Portal

A comprehensive Node.js backend application built with NestJS for managing student report cards and academic records.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin, Teacher, Student)
- **User Management**: Create and manage users with different roles
- **Student Management**: Complete student information management with class assignments
- **Teacher Management**: Teacher profiles with subject and class assignments
- **Subject Management**: Manage academic subjects with credits and grading criteria
- **Class Management**: Organize students into classes with grade levels
- **Marks Management**: Enter and track student marks across subjects and terms
- **Report Generation**: Generate PDF report cards with comprehensive academic performance
- **Academic Analytics**: Class performance summaries and student progress tracking

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Class Validator & Class Transformer
- **PDF Generation**: PDFKit
- **Documentation**: Swagger/OpenAPI
- **ODM**: Mongoose

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd reportcard-system
```

2. Install dependencies:
```bash
npm install
```

3. Environment Setup:
   - Copy `.env.example` to `.env`
   - Update the MongoDB connection string with your Atlas credentials
   - Generate a secure JWT secret key

4. Start the development server:
```bash
npm run start:dev
```

5. Access the API:
   - API: http://localhost:3000/api/v1
   - Documentation: http://localhost:3000/api/docs

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - User login

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Students
- `POST /api/v1/students` - Create a new student
- `GET /api/v1/students` - Get all students
- `GET /api/v1/students/:id` - Get student by ID
- `PUT /api/v1/students/:id` - Update student
- `DELETE /api/v1/students/:id` - Delete student
- `GET /api/v1/students/class/:classId` - Get students by class
- `GET /api/v1/students/grade/:gradeLevel` - Get students by grade level

### Reports
- `GET /api/v1/reports/student/:studentId/report-card` - Download PDF report card
- `GET /api/v1/reports/student/:studentId/history` - Get student report history
- `GET /api/v1/reports/class/:classId/summary` - Get class performance summary
- `GET /api/v1/reports/student/:studentId/data` - Get report card data (JSON)

## Environment Variables

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-report-portal?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
APP_NAME=School Report Portal
APP_VERSION=1.0.0
```

## Database Schema

### Collections:
- **Users**: Authentication and basic user information
- **Students**: Student profiles and academic information
- **Teachers**: Teacher profiles and assignments
- **Subjects**: Academic subjects and grading criteria
- **Classes**: Class organization and management
- **Marks**: Student marks and academic performance

## Role-Based Access Control

### Admin
- Full access to all endpoints
- User management capabilities
- System configuration

### Teacher
- Manage students in assigned classes
- Enter and update marks
- Generate reports for assigned students

### Student
- View own academic records
- Access personal report cards

## Grading System

- **Letter Grades**: A+, A, A-, B+, B, B-, C+, C, C-, D, F
- **GPA Scale**: 4.0 scale
- **Percentage Calculation**: Automatic calculation based on marks
- **Term Support**: First Term, Second Term, Third Term, Annual

## PDF Report Cards

Report cards include:
- Student information and class details
- Subject-wise marks and grades
- Overall percentage and GPA
- Term and academic year information
- Professional formatting with school branding

## Development Commands

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run tests
npm run test

# Run linting
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── auth/                 # Authentication module
├── users/               # User management
├── students/            # Student management
├── teachers/            # Teacher management
├── subjects/            # Subject management
├── classes/             # Class management
├── marks/               # Marks management
├── reports/             # Report generation
├── common/              # Shared utilities and types
├── app.module.ts        # Main application module
└── main.ts             # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
