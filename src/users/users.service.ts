import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SALT_ROUNDS = 10;

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  bio?: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
    const user: User = {
      id: this.idCounter++,
      ...createUserDto,
      password: hashedPassword,
    };
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  /** 按邮箱精确查找用户，用于登录验证；未找到返回 undefined */
  findOneByEmail(email: string): User | undefined {
    return this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
  }

  search(name?: string, email?: string): User[] {
    return this.users.filter((u) => {
      if (name && !u.name.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }
      if (email && u.email.toLowerCase() !== email.toLowerCase()) {
        return false;
      }
      return true;
    });
  }

  private findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = this.findOne(id);
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, SALT_ROUNDS);
    }
    Object.assign(user, updateUserDto);
    return user;
  }

  remove(id: number): void {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User #${id} not found`);
    }
    this.users.splice(index, 1);
  }
}
