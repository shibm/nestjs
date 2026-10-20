import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a Product.
 * Uses class-validator decorators to enforce strict runtime payload validation.
 */
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Title must be at least 2 characters long' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];
}

