var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema.js';
let ProductsService = class ProductsService {
    productModel;
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create(createProductDto) {
        const createdProduct = new this.productModel(createProductDto);
        return createdProduct.save();
    }
    async findAll(query) {
        const { search, category, minPrice, maxPrice, page = 1, limit = 10 } = query;
        const filter = {};
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
    async findOne(id) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" was not found.`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        const updatedProduct = await this.productModel
            .findByIdAndUpdate(id, { $set: updateProductDto }, {
            returnDocument: 'after',
            runValidators: true,
        })
            .exec();
        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID "${id}" was not found.`);
        }
        return updatedProduct;
    }
    async remove(id) {
        const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
        if (!deletedProduct) {
            throw new NotFoundException(`Product with ID "${id}" was not found.`);
        }
        return {
            message: 'Product successfully deleted.',
            deletedId: id,
        };
    }
};
ProductsService = __decorate([
    Injectable(),
    __param(0, InjectModel(Product.name)),
    __metadata("design:paramtypes", [Model])
], ProductsService);
export { ProductsService };
//# sourceMappingURL=products.service.js.map