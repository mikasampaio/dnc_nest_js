import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.services';
import { CreateUserDTO, UpdateUserDTO } from './dtos/user.dtos';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
import { ParamsId } from 'src/shared/decorators/params.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';

@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@ParamsId() id: number) {
    return this.userService.getById(Number(id));
  }

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    return await this.userService.createUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateUser(@ParamsId() id: number, @Body() body: UpdateUserDTO) {
    return this.userService.updateUser(Number(id), body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@ParamsId() id: number) {
    return await this.userService.deleteUser(Number(id));
  }
}
