import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  sayHi() {
    return 'hello world';
  }
}
