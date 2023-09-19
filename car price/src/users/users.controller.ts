import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './services/users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './services/auth.service';
import { User } from './user.entity';
import { CurrentUser } from './utils/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
// @UseInterceptors(new SerializeInterceptor(UserDto)) // removes password from response
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user: User = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  @HttpCode(200)
  async singinUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user: User = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  async userProfile(@CurrentUser() currentUser: User) {
    console.log(currentUser);

    return currentUser;
  }

  @Get('/logout')
  async userLogout(@Session() session: any) {
    session.userId = null;
    return 'OK';
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));

    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  @Get('/')
  async findAllUsers(@Query('email') email: string) {
    const users = await this.userService.find(email);

    if (!users) throw new NotFoundException('user not found');

    return users;
  }

  @Delete('/delete/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/update/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
