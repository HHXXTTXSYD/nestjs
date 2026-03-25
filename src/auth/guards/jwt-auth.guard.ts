import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT 认证守卫
 * 在需要登录才能访问的路由上使用 @UseGuards(JwtAuthGuard)
 * 验证失败时自动返回 401 Unauthorized
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
