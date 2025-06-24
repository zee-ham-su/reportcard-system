import { IsString, IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TermType } from '../../common';

export class CreateMarkDto {
  @ApiProperty({ example: 'studentId123' })
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'subjectId123' })
  @IsString()
  subjectId: string;

  @ApiProperty({ example: 'classId123' })
  @IsString()
  classId: string;

  @ApiProperty({ example: 85 })
  @IsNumber()
  @Min(0)
  @Max(1000)
  marksObtained: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  @Max(1000)
  totalMarks: number;

  @ApiProperty({ enum: TermType, example: TermType.FIRST_TERM })
  @IsEnum(TermType)
  term: TermType;

  @ApiProperty({ example: '2025', required: false })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiProperty({ example: 'Excellent performance', required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateMarkDto extends CreateMarkDto {}
