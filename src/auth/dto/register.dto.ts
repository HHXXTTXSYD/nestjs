import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

/** 注册请求体 */
export class RegisterDto {
  /** 用户名，不能为空 */
  @IsString()
  @IsNotEmpty()
  name: string;

  /** 邮箱，必须符合邮箱格式 */
  @IsEmail()
  email: string;

  /** 密码，至少 6 位 */
  @IsString()
  @MinLength(6)
  password: string;

  /** 个人简介，可选 */
  @IsString()
  @IsOptional()
  bio?: string;
}
