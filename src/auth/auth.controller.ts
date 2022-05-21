import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: AuthDto) {
    console.log(dto);
    return this.authService.login();
  }

  @Post('signup')
  signup() {
    return this.authService.signup();
  }
}
