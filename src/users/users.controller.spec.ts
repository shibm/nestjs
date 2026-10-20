import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    _id: '658d4a22f98c657b2cea8f33',
    name: 'Saurabh Bhandari',
    email: 'saurabh@example.com',
    role: 'admin',
    age: 25,
    isActive: true,
  };

  const mockUsersService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const dto: CreateUserDto = {
        name: 'Saurabh Bhandari',
        email: 'saurabh@example.com',
        role: 'admin',
      };
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(dto);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockUsersService.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(mockUser._id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const updateDto: UpdateUserDto = { age: 26 };
      const updated = { ...mockUser, age: 26 };
      mockUsersService.update.mockResolvedValue(updated);

      const result = await controller.update(mockUser._id, updateDto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      const response = {
        message: 'User successfully deleted.',
        deletedId: mockUser._id,
      };
      mockUsersService.remove.mockResolvedValue(response);

      const result = await controller.remove(mockUser._id);
      expect(result).toEqual(response);
    });
  });
});

