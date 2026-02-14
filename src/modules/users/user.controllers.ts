import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.services';
import { CreateUserDTO, UpdateUserDTO } from './dtos/user.dtos';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
import { ParamsId } from 'src/shared/decorators/params.decorator';

@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  getById(@ParamsId() id: number) {
    return this.userService.getById(Number(id));
  }

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    return await this.userService.createUser(body);
  }

  @Put(':id')
  updateUser(@ParamsId() id: number, @Body() body: UpdateUserDTO) {
    return this.userService.updateUser(Number(id), body);
  }

  @Delete(':id')
  async deleteUser(@ParamsId() id: number) {
    return await this.userService.deleteUser(Number(id));
  }
}
