import { IsString, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'MATH101' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Basic mathematics course', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  credits: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 'Science', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  maxMarks?: number;

  @ApiProperty({ example: 40, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000)
  passingMarks?: number;
}

export class UpdateSubjectDto extends CreateSubjectDto {}
