import { IsString, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({ example: 'Grade 10 - A' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'GRADE10A' })
  @IsString()
  code: string;

  @ApiProperty({ example: '2025', required: false })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiProperty({ example: ['MATH101', 'ENG101'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @ApiProperty({ example: ['studentId1', 'studentId2'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  students?: string[];

  @ApiProperty({ example: ['teacherId1'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  teachers?: string[];
}

export class UpdateClassDto extends CreateClassDto {}
