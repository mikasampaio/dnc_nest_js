import { Delete, Get, HttpException, HttpStatus, Injectable, Patch, Post } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { UserCreateInput, UserUpdateInput } from "src/generated/prisma/models";
import type { User } from "src/generated/prisma/client";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    @Get()
    getUsers() {
        return this.prisma.user.findMany({
            omit: { password: true }
        });
    }

    @Get(':id')
    getById(id: number) {
        const user = this.prisma.user.findUnique({
            where: { id },
            omit: { password: true }
        })

        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        return user;
    }

    @Post()
    async createUser(data: UserCreateInput): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email, username: data.username, },
        })

        if (user) throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

        return this.prisma.user.create({
            data: {
                ...data,
                createdAt: new Date(),
            }
        })
    }

    @Patch(':id')
    updateUser(id: number, data: UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            }
        })
    }

    @Delete(':id')
    async deleteUser(id: number): Promise<void> {
        await this.prisma.user.delete({
            where: { id }

        })
    }
}