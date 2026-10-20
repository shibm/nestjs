import { Model } from 'mongoose';
import { ProductDocument } from './schemas/product.schema.js';
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
export declare class ProductsService {
    private readonly productModel;
    constructor(productModel: Model<ProductDocument>);
    create(createProductDto: CreateProductDto): Promise<ProductDocument>;
    findAll(query: QueryProductDto): Promise<PaginatedProductsResponse>;
    findOne(id: string): Promise<ProductDocument>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument>;
    remove(id: string): Promise<{
        message: string;
        deletedId: string;
    }>;
}
