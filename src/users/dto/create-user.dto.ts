import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'A valid email address is required' })
  email: string;

  @IsOptional()
  @IsEnum(['user', 'admin'], {
    message: 'Role must be either "user" or "admin"',
  })
  role?: string;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Age must be a positive integer' })
  age?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

