import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { vi } from 'vitest';
import { UsersService } from './users.service.js';
import { User } from './schemas/user.schema.js';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    _id: '658d4a22f98c657b2cea8f33',
    name: 'Saurabh Bhandari',
    email: 'saurabh@example.com',
    role: 'admin',
    age: 25,
    isActive: true,
  };

  function MockUserModel(this: any, dto: any) {
    Object.assign(this, dto);
    this.save = vi.fn().mockImplementation(() => {
      if (dto.email === 'duplicate@example.com') {
        const error: any = new Error('Duplicate key');
        error.code = 11000;
        return Promise.reject(error);
      }
      return Promise.resolve({ _id: mockUser._id, ...dto });
    });
  }

  MockUserModel.find = vi.fn();
  MockUserModel.findById = vi.fn();
  MockUserModel.findByIdAndUpdate = vi.fn();
  MockUserModel.findByIdAndDelete = vi.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const createDto = {
        name: 'Saurabh Bhandari',
        email: 'saurabh@example.com',
        role: 'admin',
      };

      const result = await service.create(createDto);
      expect(result).toHaveProperty('_id', mockUser._id);
      expect(result.name).toBe(createDto.name);
    });

    it('should throw ConflictException on duplicate email (11000)', async () => {
      const duplicateDto = {
        name: 'Duplicate',
        email: 'duplicate@example.com',
      };

      await expect(service.create(duplicateDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockQueryChain = {
        sort: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockUser]),
      };

      MockUserModel.find.mockReturnValue(mockQueryChain);

      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(MockUserModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      MockUserModel.findById.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne(mockUser._id);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      MockUserModel.findById.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const updated = { ...mockUser, age: 26 };
      MockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: vi.fn().mockResolvedValue(updated),
      });

      const result = await service.update(mockUser._id, { age: 26 });
      expect(result.age).toBe(26);
    });

    it('should throw NotFoundException if user to update does not exist', async () => {
      MockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(service.update('nonexistent', { age: 26 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete and return confirmation', async () => {
      MockUserModel.findByIdAndDelete.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockUser),
      });

      const result = await service.remove(mockUser._id);
      expect(result).toEqual({
        message: 'User successfully deleted.',
        deletedId: mockUser._id,
      });
    });

    it('should throw NotFoundException if user to delete not found', async () => {
      MockUserModel.findByIdAndDelete.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

