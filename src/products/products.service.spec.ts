import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';
import { ProductsService } from './products.service.js';
import { Product } from './schemas/product.schema.js';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProduct = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Laptop',
    description: 'High-end gaming laptop',
    price: 1299.99,
    category: 'Electronics',
    inStock: true,
    tags: ['gaming', 'laptop'],
  };

  function MockProductModel(this: any, dto: any) {
    Object.assign(this, dto);
    this.save = vi.fn().mockResolvedValue({ _id: mockProduct._id, ...dto });
  }

  MockProductModel.find = vi.fn();
  MockProductModel.findById = vi.fn();
  MockProductModel.findByIdAndUpdate = vi.fn();
  MockProductModel.findByIdAndDelete = vi.fn();
  MockProductModel.countDocuments = vi.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: MockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new product', async () => {
      const createDto = {
        title: 'Test Laptop',
        price: 1299.99,
        category: 'Electronics',
      };

      const result = await service.create(createDto);
      expect(result).toHaveProperty('_id', mockProduct._id);
      expect(result.title).toBe(createDto.title);
    });
  });

  describe('findAll', () => {
    it('should return paginated products with metadata', async () => {
      const mockQueryChain = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockProduct]),
      };

      MockProductModel.find.mockReturnValue(mockQueryChain);
      MockProductModel.countDocuments.mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      });

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.page).toBe(1);
      expect(MockProductModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product when a valid existing ID is provided', async () => {
      MockProductModel.findById.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockProduct),
      });

      const result = await service.findOne(mockProduct._id);
      expect(result).toEqual(mockProduct);
      expect(MockProductModel.findById).toHaveBeenCalledWith(mockProduct._id);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      MockProductModel.findById.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('507f1f77bcf86cd799439099')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the updated product', async () => {
      const updatedMock = { ...mockProduct, price: 999.99 };
      MockProductModel.findByIdAndUpdate.mockReturnValue({
        exec: vi.fn().mockResolvedValue(updatedMock),
      });

      const result = await service.update(mockProduct._id, { price: 999.99 });
      expect(result.price).toBe(999.99);
      expect(MockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockProduct._id,
        { $set: { price: 999.99 } },
        { returnDocument: 'after', runValidators: true },
      );
    });

    it('should throw NotFoundException if product to update is not found', async () => {
      MockProductModel.findByIdAndUpdate.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('507f1f77bcf86cd799439099', { price: 999.99 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the product and return success response', async () => {
      MockProductModel.findByIdAndDelete.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockProduct),
      });

      const result = await service.remove(mockProduct._id);
      expect(result).toEqual({
        message: 'Product successfully deleted.',
        deletedId: mockProduct._id,
      });
      expect(MockProductModel.findByIdAndDelete).toHaveBeenCalledWith(
        mockProduct._id,
      );
    });

    it('should throw NotFoundException if product to remove is not found', async () => {
      MockProductModel.findByIdAndDelete.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(service.remove('507f1f77bcf86cd799439099')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
