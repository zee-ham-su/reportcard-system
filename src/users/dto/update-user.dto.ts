import { IsEmail, IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common';

export class UpdateUserDto {
  @ApiProperty({ required: false, example: 'john.doe@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, enum: UserRole, example: UserRole.TEACHER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: '123 Main St, City, Country' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
