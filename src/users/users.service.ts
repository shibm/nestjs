import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Create a new user in MongoDB
   */
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException(
          `A user with email "${createUserDto.email}" already exists.`,
        );
      }
      throw error;
    }
  }

  /**
   * Retrieve all users
   */
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().sort({ createdAt: -1 }).exec();
  }

  /**
   * Find a user by their MongoDB ObjectId
   */
  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" was not found.`);
    }
    return user;
  }

  /**
   * Update an existing user by MongoDB ObjectId
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
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
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException(
          `A user with email "${updateUserDto.email}" already exists.`,
        );
      }
      throw error;
    }
  }

  /**
   * Remove a user by MongoDB ObjectId
   */
  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException(`User with ID "${id}" was not found.`);
    }

    return {
      message: 'User successfully deleted.',
      deletedId: id,
    };
  }
}
