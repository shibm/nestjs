import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { QueryProductDto } from './dto/query-product.dto.js';

export interface PaginatedProductsResponse {
  data: ProductDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  /**
   * Create a new product in MongoDB
   */
  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  /**
   * Retrieve all products with optional filters, search, and pagination
   */
  async findAll(query: QueryProductDto): Promise<PaginatedProductsResponse> {
    const { search, category, minPrice, maxPrice, page = 1, limit = 10 } = query;
    const filter: Record<string, any> = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Find a single product by MongoDB ObjectID
   */
  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" was not found.`);
    }
    return product;
  }

  /**
   * Update an existing product by MongoDB ObjectID
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, { $set: updateProductDto }, {
        returnDocument: 'after', // returns the updated document instead of the old one
        runValidators: true, // runs schema validators on update
      })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID "${id}" was not found.`);
    }

    return updatedProduct;
  }

  /**
   * Remove a product by MongoDB ObjectID
   */
  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();

    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID "${id}" was not found.`);
    }

    return {
      message: 'Product successfully deleted.',
      deletedId: id,
    };
  }
}
