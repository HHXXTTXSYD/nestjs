import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { User } from '../users/users.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/** JWT payload 结构 */
export interface JwtPayload {
  sub: number;
  email: string;
}

/** 登录成功后返回的数据 */
export interface AuthResult {
  accessToken: string;
  user: Omit<User, 'password'>;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 注册新用户
   * - 检查邮箱是否已被注册
   * - 密码加密由 UsersService.create 统一处理
   * - 返回 JWT access token 及用户信息（不含密码）
   */
  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = this.usersService.findOneByEmail(dto.email);
    if (existing) {
      throw new ConflictException('该邮箱已被注册');
    }

    const user = await this.usersService.create(dto);
    return this.buildAuthResult(user);
  }

  /**
   * 用户登录
   * - 根据邮箱查找用户，不存在则返回 401
   * - 使用 bcrypt 比对密码，错误则返回 401
   * - 返回 JWT access token 及用户信息（不含密码）
   */
  async login(dto: LoginDto): Promise<AuthResult> {
    const user = this.usersService.findOneByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    return this.buildAuthResult(user);
  }

  /**
   * 构造统一的认证返回结果
   * - 签发 JWT，payload 中写入 userId 和 email
   * - 去除密码字段后返回用户信息
   */
  private buildAuthResult(user: User): AuthResult {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    const { password: _password, ...userWithoutPassword } = user;
    return { accessToken, user: userWithoutPassword };
  }
}
