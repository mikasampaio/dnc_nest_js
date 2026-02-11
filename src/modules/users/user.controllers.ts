import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { UserService } from "./user.services";
import type { UserCreateInput, UserUpdateInput } from "src/generated/prisma/models";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {

    }

    @Get()
    getUsers() {
        return this.userService.getUsers();
    }

    @Get(':id')
    getById(@Param('id') id: number) {
        return this.userService.getById(Number(id));
    }


    @Post()
    async createUser(@Body() body: UserCreateInput) {
        return await this.userService.createUser(body);
    }

    @Patch(':id')
    async updateUser(@Param('id') id: number, @Body() UserUpdateInput) {
        return await this.userService.updateUser(Number(id), UserUpdateInput);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        return await this.userService.deleteUser(Number(id));
    }
}