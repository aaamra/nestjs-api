import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
