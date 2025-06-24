import { IsString, IsOptional, IsEmail, IsBoolean, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ example: 'Jane' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'TCH001' })
  @IsString()
  teacherId: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'M.Sc. Mathematics' })
  @IsString()
  qualification: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0)
  experience: number;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123 Main St, City', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Mathematics', required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsOptional()
  joiningDate?: Date;

  @ApiProperty({ example: 'profile.jpg', required: false })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}

export class UpdateTeacherDto extends CreateTeacherDto {}
