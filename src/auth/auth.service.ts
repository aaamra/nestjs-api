import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login() {
    // hard coded right now
    return {
      username: 'Abdallah',
      email: 'abd@gmail.com',
      source: 'login',
    };
  }

  signup() {
    // hard coded right now
    return {
      username: 'Abdallah',
      email: 'abd@gmail.com',
      source: 'signup',
    };
  }
}
