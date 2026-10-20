var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength, } from 'class-validator';
export class CreateProductDto {
    title;
    description;
    price;
    category;
    inStock;
    tags;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    MinLength(2, { message: 'Title must be at least 2 characters long' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "title", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number' }),
    Min(0, { message: 'Price cannot be negative' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Category is required' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "category", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "inStock", void 0);
__decorate([
    IsOptional(),
    IsArray(),
    IsString({ each: true, message: 'Each tag must be a string' }),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "tags", void 0);
//# sourceMappingURL=create-product.dto.js.map