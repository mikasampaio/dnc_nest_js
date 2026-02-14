import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { LoginDTO, AuthRegisterDTO } from './domain/dtos/auth.dtos';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async generateToken(user: User) {
    const payload = { sub: user.id, username: user.username };

    return await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      issuer: 'dnc-nest-js',
      audience: 'dnc-users',
    });
  }

  async login({ email, password }: LoginDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      access_token: await this.generateToken(user),
    };
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (user) {
      if (user.email === data.email) {
        throw new UnauthorizedException('Email already in use');
      }

      if (user.username === data.username) {
        throw new UnauthorizedException('Username already in use');
      }
    }

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      data.password = hashedPassword;
    }

    const createdUser = await this.prisma.user.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });

    return {
      id: createdUser.id,
      name: createdUser.name,
      username: createdUser.username,
      email: createdUser.email,
      access_token: await this.generateToken(createdUser),
    };
  }
}
