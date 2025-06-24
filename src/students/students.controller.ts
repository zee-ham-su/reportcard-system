import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common';

@ApiTags('Students')
@Controller('students')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  @ApiResponse({ status: 409, description: 'Student ID already exists' })
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({ status: 200, description: 'Returns all students' })
  async findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiResponse({ status: 200, description: 'Returns the student' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Get('student-id/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get student by student ID' })
  @ApiResponse({ status: 200, description: 'Returns the student' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findByStudentId(@Param('studentId') studentId: string) {
    return this.studentsService.findByStudentId(studentId);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update student' })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete student' })
  @ApiResponse({ status: 200, description: 'Student deleted successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async remove(@Param('id') id: string) {
    await this.studentsService.remove(id);
    return { message: 'Student deleted successfully' };
  }

  @Get('class/:classId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get students by class' })
  @ApiResponse({ status: 200, description: 'Returns students in the specified class' })
  async findByClass(@Param('classId') classId: string) {
    return this.studentsService.findByClass(classId);
  }

  @Get('grade/:gradeLevel')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get students by grade level' })
  @ApiResponse({ status: 200, description: 'Returns students in the specified grade level' })
  async findByGradeLevel(@Param('gradeLevel') gradeLevel: string) {
    return this.studentsService.findByGradeLevel(gradeLevel);
  }
}
