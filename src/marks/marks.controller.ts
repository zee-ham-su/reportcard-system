import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MarksService } from './marks.service';
import { CreateMarkDto, UpdateMarkDto } from './dto/mark.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common';

@ApiTags('Marks')
@Controller('marks')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class MarksController {
  constructor(private readonly marksService: MarksService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create a new mark entry' })
  @ApiResponse({ status: 201, description: 'Mark created successfully' })
  async create(@Body() createMarkDto: CreateMarkDto) {
    return this.marksService.create(createMarkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all marks' })
  @ApiResponse({ status: 200, description: 'List of all marks' })
  async findAll() {
    return this.marksService.findAll();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get marks by student ID' })
  @ApiResponse({ status: 200, description: 'Student marks' })
  async findByStudent(@Param('studentId') studentId: string) {
    return this.marksService.findByStudent(studentId);
  }

  @Get('class/:classId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get marks by class ID' })
  @ApiResponse({ status: 200, description: 'Class marks' })
  async findByClass(@Param('classId') classId: string) {
    return this.marksService.findByClass(classId);
  }

  @Get('subject/:subjectId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get marks by subject ID' })
  @ApiResponse({ status: 200, description: 'Subject marks' })
  async findBySubject(@Param('subjectId') subjectId: string) {
    return this.marksService.findBySubject(subjectId);
  }

  @Get('report-card/:studentId')
  @ApiOperation({ summary: 'Get student report card' })
  @ApiQuery({ name: 'term', required: false })
  @ApiQuery({ name: 'academicYear', required: false })
  @ApiResponse({ status: 200, description: 'Student report card' })
  async getStudentReportCard(
    @Param('studentId') studentId: string,
    @Query('term') term?: string,
    @Query('academicYear') academicYear?: string,
  ) {
    return this.marksService.getStudentReportCard(studentId, term, academicYear);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get mark by ID' })
  @ApiResponse({ status: 200, description: 'Mark details' })
  @ApiResponse({ status: 404, description: 'Mark not found' })
  async findOne(@Param('id') id: string) {
    return this.marksService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update mark' })
  @ApiResponse({ status: 200, description: 'Mark updated successfully' })
  @ApiResponse({ status: 404, description: 'Mark not found' })
  async update(@Param('id') id: string, @Body() updateMarkDto: UpdateMarkDto) {
    return this.marksService.update(id, updateMarkDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete mark' })
  @ApiResponse({ status: 200, description: 'Mark deleted successfully' })
  @ApiResponse({ status: 404, description: 'Mark not found' })
  async remove(@Param('id') id: string) {
    await this.marksService.remove(id);
    return { message: 'Mark deleted successfully' };
  }
}
