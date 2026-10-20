import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { QueryProductDto } from './dto/query-product.dto.js';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe.js';

/**
 * Controller handling all incoming HTTP requests for /products
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * POST /products
   * Creates a new product. Returns 201 Created by default.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * GET /products
   * Retrieves products with optional filters, search, and pagination.
   */
  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  /**
   * GET /products/:id
   * Retrieves a single product by its MongoDB ObjectID.
   * ParseObjectIdPipe ensures only valid 24-char hex strings are processed.
   */
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.productsService.findOne(id);
  }

  /**
   * PATCH /products/:id
   * Partially updates a product.
   */
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * DELETE /products/:id
   * Removes a product by ID.
   */
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.productsService.remove(id);
  }
}

