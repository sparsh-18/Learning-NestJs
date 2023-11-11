import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
} from '@nestjs/common';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';
import { Public } from 'src/utils/public.util';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Post()
	@HttpCode(201)
	@Public()
	async create(@Body() dto: UserDTO) {
		return this.userService.create(dto);
	}

	@Get('/all')
	@HttpCode(200)
	async getAll() {
		return this.userService.findAll();
	}

	@Get('/:id')
	@HttpCode(200)
	async getById(@Param('id') id: number) {
		return this.userService.findById(id);
	}

	@Delete('/:id')
	@HttpCode(200)
	async deleteById(@Param('id') id: number) {
		return this.userService.deleteById(id);
	}
}
