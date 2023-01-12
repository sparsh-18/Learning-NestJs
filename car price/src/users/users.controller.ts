import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {
	constructor(private userService: UsersService) { }

	@Post('/signup')
	createUser(@Body() body: CreateUserDto) {
		this.userService.create(body.email, body.password);
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
