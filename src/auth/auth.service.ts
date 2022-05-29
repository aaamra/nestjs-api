import { ForbiddenException, Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { LoginDto, SignUpDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user)
      throw new ForbiddenException(
        'your credentials does not match our records',
      );

    const matchedPW = await verify(user.password, dto.password);

    if (!matchedPW)
      throw new ForbiddenException(
        'your credentials does not match our records',
      );

    delete user.password;

    return await this.signToken(user.id, user.name, user.email);
  }

  async signup(dto: SignUpDto) {
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

      return await this.signToken(user.id, user.name, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // error code for duplicate field
        if (error.code === 'P2002') {
          throw new ForbiddenException('email already taken');
        }
      }
      throw error;
    }
  }

  async signToken(
    id: number,
    name: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const access_token = await this.jwt.signAsync(
      { id, name, email },
      { expiresIn: '15m', secret: this.config.get('JWT_SECRET') },
    );

    return {
      access_token,
    };
  }
}
