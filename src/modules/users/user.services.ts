import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import type { User } from 'src/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO } from './dtos/user.dtos';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  getUsers(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      omit: { password: true },
    });
  }

  getById(id: number): Promise<Omit<User, 'password'>> {
    const user = this.findUserById(id);

    return user;
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (user) {
      if (user.email === data.email) {
        throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
      }

      if (user.username === data.username) {
        throw new HttpException(
          'Username already in use',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    data.password = hashedPassword;

    return this.prisma.user.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
  }

  async updateUser(id: number, data: UpdateUserDTO): Promise<User> {
    await this.findUserById(id);

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.findUserById(id);

    await this.prisma.user.delete({
      where: { id },
    });
  }

  private async findUserById(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
