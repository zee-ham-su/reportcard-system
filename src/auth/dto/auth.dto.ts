import { IsEmail, IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.TEACHER })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: '123 Main St, City, Country' })
  @IsOptional()
  @IsString()
  address?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  password: string;
}
