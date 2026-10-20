import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Mechanical Keyboard',
    description: 'Hot-swappable switches',
    price: 89.99,
    category: 'Accessories',
    inStock: true,
    tags: ['keyboard', 'pc'],
  };

  const mockProductsService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const createDto: CreateProductDto = {
        title: 'Test Mechanical Keyboard',
        price: 89.99,
        category: 'Accessories',
      };

      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createDto);
      expect(result).toEqual(mockProduct);
      expect(mockProductsService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of products', async () => {
      const mockResponse = {
        data: [mockProduct],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockProductsService.findAll.mockResolvedValue(mockResponse);

      const query = { page: 1, limit: 10 };
      const result = await controller.findAll(query);
      expect(result).toEqual(mockResponse);
      expect(mockProductsService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne(mockProduct._id);
      expect(result).toEqual(mockProduct);
      expect(mockProductsService.findOne).toHaveBeenCalledWith(mockProduct._id);
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      const updateDto: UpdateProductDto = { price: 79.99 };
      const updatedProduct = { ...mockProduct, price: 79.99 };
      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(mockProduct._id, updateDto);
      expect(result).toEqual(updatedProduct);
      expect(mockProductsService.update).toHaveBeenCalledWith(
        mockProduct._id,
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove the product and return confirmation', async () => {
      const deleteResult = {
        message: 'Product successfully deleted.',
        deletedId: mockProduct._id,
      };
      mockProductsService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove(mockProduct._id);
      expect(result).toEqual(deleteResult);
      expect(mockProductsService.remove).toHaveBeenCalledWith(mockProduct._id);
    });
  });
});

