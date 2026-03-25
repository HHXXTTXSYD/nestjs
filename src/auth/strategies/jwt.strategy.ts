import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import type { JwtPayload } from '../auth.service';

/**
 * JWT 认证策略
 * - 从请求头 Authorization: Bearer <token> 中提取 JWT
 * - 验证签名并解码 payload
 * - 根据 payload 中的 email 查找用户，确保用户仍然存在
 * - 验证通过后，将用户对象挂载到 request.user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      // 从 Bearer Token 中提取 JWT
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 不忽略过期时间
      ignoreExpiration: false,
      // 与签发时使用的密钥一致（由 AuthModule 统一注入）
      secretOrKey: process.env.JWT_SECRET ?? 'default_secret_change_in_prod',
    });
  }

  /**
   * JWT 验证通过后调用此方法
   * @param payload 解码后的 JWT payload
   * @returns 当前用户对象（不含密码），将挂载到 request.user
   */
  async validate(payload: JwtPayload) {
    const user = this.usersService.findOneByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Token 无效，用户不存在');
    }
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
