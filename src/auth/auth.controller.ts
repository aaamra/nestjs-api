import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get()
  hello() {
    return { msg: 'hello world' };
  }
}
