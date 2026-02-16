import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO, AuthRegisterDTO } from './domain/dtos/auth.dtos';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.services';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async generateToken(user: User) {
    const payload = { sub: user.id, username: user.username };

    return await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      issuer: 'dnc-nest-js',
      audience: 'dnc-users',
    });
  }

  async verifyToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync<{
        sub: string;
        username: string;
      }>(token, {
        secret: process.env.JWT_SECRET_KEY,
        issuer: 'dnc-nest-js',
        audience: 'dnc-users',
      });

      return { valid: true, decoded };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { valid: false, message };
    }
  }

  async login({ email, password }: LoginDTO) {
    const user = await this.userService.findByEmail(email);

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
    const email = await this.userService.findByEmail(data.email);
    const username = await this.userService.findByUsername(data.username);

    if (email) {
      throw new UnauthorizedException('Email already in use');
    }

    if (username) {
      throw new UnauthorizedException('Username already in use');
    }

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      data.password = hashedPassword;
    }

    const createdUser = await this.userService.createUser({
      ...data,
    });

    return {
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      access_token: await this.generateToken(createdUser),
    };
  }
}
