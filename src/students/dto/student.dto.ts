import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsDateString,
  IsMongoId,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GradeLevel } from '../../common';

export class CreateStudentDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'STU-2024-001' })
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'john.doe.student@school.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '2010-05-15' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ enum: GradeLevel, example: GradeLevel.GRADE_5 })
  @IsEnum(GradeLevel)
  gradeLevel: GradeLevel;

  @ApiProperty({ example: '60f7b1b8e1234567890abcde' })
  @IsMongoId()
  classId: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  parentName?: string;

  @ApiProperty({ required: false, example: 'jane.doe@email.com' })
  @IsOptional()
  @IsEmail()
  parentEmail?: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  parentPhone?: string;

  @ApiProperty({ required: false, example: '123 Main St, City, Country' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  admissionDate?: string;
}

export class UpdateStudentDto {
  @ApiProperty({ required: false, example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, example: 'john.doe.student@school.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, example: '2010-05-15' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ required: false, enum: GradeLevel, example: GradeLevel.GRADE_5 })
  @IsOptional()
  @IsEnum(GradeLevel)
  gradeLevel?: GradeLevel;

  @ApiProperty({ required: false, example: '60f7b1b8e1234567890abcde' })
  @IsOptional()
  @IsMongoId()
  classId?: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  parentName?: string;

  @ApiProperty({ required: false, example: 'jane.doe@email.com' })
  @IsOptional()
  @IsEmail()
  parentEmail?: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  parentPhone?: string;

  @ApiProperty({ required: false, example: '123 Main St, City, Country' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
