import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/utils/public.util';
import { UserDTO } from 'src/user/user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
	) {}

	@Post('register')
	@Public()
	async register(@Body() dto: UserDTO) {
		return this.userService.create(dto);
	}

	@Post('login')
	@Public()
	@UseGuards(LocalAuthGuard)
	async login(@Req() req: Request) {
		return this.authService.login(req.user as UserDTO);
	}

	@Post('renew-token')
	@Public()
	@UseGuards(RefreshJwtAuthGuard)
	async renewToken(@Req() req: Request) {
		return this.authService.renewToken(req.user as UserDTO);
	}
}
