import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto.js';

/**
 * Data Transfer Object (DTO) for updating an existing Product.
 * Inherits all validation rules from CreateProductDto, but makes every field optional.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}

