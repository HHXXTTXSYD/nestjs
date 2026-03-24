import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', () => {
      const dto = { name: 'Alice', email: 'alice@test.com', password: '123456' };
      const result = controller.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      controller.create({ name: 'Alice', email: 'alice@test.com', password: '123456' });
      controller.create({ name: 'Bob', email: 'bob@test.com', password: '654321' });
      const result = controller.findAll();
      expect(result).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a single user', () => {
      controller.create({ name: 'Alice', email: 'alice@test.com', password: '123456' });
      const result = controller.findOne(1);
      expect(result.name).toBe('Alice');
    });

    it('should throw NotFoundException for non-existent user', () => {
      expect(() => controller.findOne(999)).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', () => {
      controller.create({ name: 'Alice', email: 'alice@test.com', password: '123456' });
      const result = controller.update(1, { name: 'Alice Updated' });
      expect(result.name).toBe('Alice Updated');
      expect(result.email).toBe('alice@test.com');
    });
  });

  describe('remove', () => {
    it('should remove a user', () => {
      controller.create({ name: 'Alice', email: 'alice@test.com', password: '123456' });
      controller.remove(1);
      expect(controller.findAll()).toHaveLength(0);
    });

    it('should throw NotFoundException for non-existent user', () => {
      expect(() => controller.remove(999)).toThrow(NotFoundException);
    });
  });
});
