import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
export declare class UsersService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<UserDocument>;
    findAll(): Promise<UserDocument[]>;
    findOne(id: string): Promise<UserDocument>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument>;
    remove(id: string): Promise<{
        message: string;
        deletedId: string;
    }>;
}
