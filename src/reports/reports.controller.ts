import {
  Controller,
  Get,
  Param,
  Query,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { ReportsService } from './reports.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole, TermType } from '../common';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('student/:studentId/report-card')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Generate and download student report card PDF' })
  @ApiQuery({ name: 'term', enum: TermType })
  @ApiQuery({ name: 'academicYear', example: '2024-25' })
  @ApiResponse({ status: 200, description: 'PDF report card generated successfully' })
  async downloadReportCard(
    @Param('studentId') studentId: string,
    @Query('term') term: TermType,
    @Query('academicYear') academicYear: string,
    @Response() res: ExpressResponse,
  ) {
    const pdfBuffer = await this.reportsService.generateReportCard(
      studentId,
      term,
      academicYear,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="report-card-${studentId}-${term}-${academicYear}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Get('student/:studentId/history')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get student report history' })
  @ApiResponse({ status: 200, description: 'Returns student report history' })
  async getStudentReports(@Param('studentId') studentId: string) {
    return this.reportsService.getStudentReports(studentId);
  }

  @Get('class/:classId/summary')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get class performance summary' })
  @ApiQuery({ name: 'term', enum: TermType })
  @ApiQuery({ name: 'academicYear', example: '2024-25' })
  @ApiResponse({ status: 200, description: 'Returns class performance summary' })
  async getClassReports(
    @Param('classId') classId: string,
    @Query('term') term: TermType,
    @Query('academicYear') academicYear: string,
  ) {
    return this.reportsService.getClassReports(classId, term, academicYear);
  }

  @Get('student/:studentId/data')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get report card data (without PDF)' })
  @ApiQuery({ name: 'term', enum: TermType })
  @ApiQuery({ name: 'academicYear', example: '2024-25' })
  @ApiResponse({ status: 200, description: 'Returns report card data' })
  async getReportCardData(
    @Param('studentId') studentId: string,
    @Query('term') term: TermType,
    @Query('academicYear') academicYear: string,
  ) {
    return this.reportsService.getReportCardData(studentId, term, academicYear);
  }
}
