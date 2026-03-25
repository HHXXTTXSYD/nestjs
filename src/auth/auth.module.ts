import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * 认证模块
 * - 依赖 UsersModule 获取用户数据
 * - 注册 PassportModule 用于策略集成
 * - 注册 JwtModule，配置签发密钥与过期时间
 * - 提供 AuthService、JwtStrategy
 *
 * 生产环境请通过环境变量 JWT_SECRET 设置强密钥
 */
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'default_secret_change_in_prod',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
