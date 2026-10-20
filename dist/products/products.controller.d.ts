import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { QueryProductDto } from './dto/query-product.dto.js';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/product.schema.js").Product, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/product.schema.js").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(query: QueryProductDto): Promise<import("./products.service.js").PaginatedProductsResponse>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/product.schema.js").Product, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/product.schema.js").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/product.schema.js").Product, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/product.schema.js").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<{
        message: string;
        deletedId: string;
    }>;
}
