import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService, AuthResult } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * 注册新账号，返回 JWT token 及用户信息
   */
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<AuthResult> {
    return this.authService.register(dto);
  }

  /**
   * POST /auth/login
   * 使用邮箱+密码登录，返回 JWT token 及用户信息
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<AuthResult> {
    return this.authService.login(dto);
  }

  /**
   * GET /auth/profile
   * 获取当前登录用户信息，需要携带有效 JWT
   * 示例：Authorization: Bearer <token>
   */
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req: { user: AuthResult['user'] }): AuthResult['user'] {
    return req.user;
  }
}
