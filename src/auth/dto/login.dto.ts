import { IsEmail, IsString, MinLength } from 'class-validator';

/** 登录请求体 */
export class LoginDto {
  /** 邮箱 */
  @IsEmail()
  email: string;

  /** 密码，至少 6 位 */
  @IsString()
  @MinLength(6)
  password: string;
}
