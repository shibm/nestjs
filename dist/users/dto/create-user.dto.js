var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsBoolean, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, } from 'class-validator';
export class CreateUserDto {
    name;
    email;
    role;
    age;
    isActive;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'Name is required' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    IsEmail({}, { message: 'A valid email address is required' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    IsOptional(),
    IsEnum(['user', 'admin'], {
        message: 'Role must be either "user" or "admin"',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(0, { message: 'Age must be a positive integer' }),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "age", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-user.dto.js.map