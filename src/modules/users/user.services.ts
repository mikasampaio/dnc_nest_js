import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO } from './dtos/user.dtos';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getUsers(): Promise<Omit<User, 'password'>[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
    });
  }

  getById(id: number): Promise<Omit<User, 'password'>> {
    const user = this.findUserById(id);

    return user;
  }

  async createUser(data: CreateUserDTO): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: [{ email: data.email }, { username: data.username }],
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

    const newUser = await this.userRepository.save({
      ...data,
      createdAt: new Date(),
    });

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
      name: newUser.name,
    };
  }

  async updateUser(
    id: number,
    data: UpdateUserDTO,
  ): Promise<Omit<User, 'password'>> {
    await this.findUserById(id);

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    await this.userRepository.update(id, {
      ...data,
      updatedAt: new Date(),
    });

    const updatedUser = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'createdAt', 'updatedAt', 'name'],
    });

    return updatedUser!;
  }

  async deleteUser(id: number): Promise<void> {
    await this.findUserById(id);

    await this.userRepository.delete(id);
  }

  private async findUserById(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'createdAt', 'updatedAt', 'name'],
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
