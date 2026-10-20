import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { Product, ProductSchema } from './schemas/product.schema.js';

/**
 * Feature Module for Products.
 * Encapsulates the controller, service, and Mongoose schema registration.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

