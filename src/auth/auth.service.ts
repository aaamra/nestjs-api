import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

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

  async signup(dto: AuthDto) {
    try {
      const hashedPassword = await hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
        },
      });

      delete user.password;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('email taken');
        }
      }
      throw error;
    }
  }
}
