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
import { Injectable, NotFoundException, ConflictException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema.js';
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        try {
            const createdUser = new this.userModel(createUserDto);
            return await createdUser.save();
        }
        catch (error) {
            if (error?.code === 11000) {
                throw new ConflictException(`A user with email "${createUserDto.email}" already exists.`);
            }
            throw error;
        }
    }
    async findAll() {
        return this.userModel.find().sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" was not found.`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        try {
            const updatedUser = await this.userModel
                .findByIdAndUpdate(id, { $set: updateUserDto }, {
                returnDocument: 'after',
                runValidators: true,
            })
                .exec();
            if (!updatedUser) {
                throw new NotFoundException(`User with ID "${id}" was not found.`);
            }
            return updatedUser;
        }
        catch (error) {
            if (error?.code === 11000) {
                throw new ConflictException(`A user with email "${updateUserDto.email}" already exists.`);
            }
            throw error;
        }
    }
    async remove(id) {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException(`User with ID "${id}" was not found.`);
        }
        return {
            message: 'User successfully deleted.',
            deletedId: id,
        };
    }
};
UsersService = __decorate([
    Injectable(),
    __param(0, InjectModel(User.name)),
    __metadata("design:paramtypes", [Model])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map