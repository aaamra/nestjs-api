import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
