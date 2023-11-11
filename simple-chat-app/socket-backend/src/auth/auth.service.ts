import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/user/user.dto';
import { plainToClass } from 'class-transformer';
import { AuthResponseDTO } from './auth-response.dto';
import { isEmpty } from 'class-validator';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	private logger: Logger = new Logger(AuthService.name);

	/**
	 * The function validates a user by checking if the provided password matches the stored password,
	 * and returns the user object without the password if the validation is successful.
	 * @param {UserDTO} dto - UserDTO object containing the username and password of the user to be
	 * validated.
	 * @returns a Promise that resolves to a Partial<User> object if the passwords match, or null if
	 * they do not.
	 */
	async validateUser(dto: UserDTO): Promise<Partial<User>> {
		const user: User = await this.userService.findEntireObjByUserName(
			dto.username,
		);
		if (isMatchPasswords(dto.password, user.password)) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	/**
	 * The login function generates and returns a token for the given user.
	 * @param {UserDTO} user - The `user` parameter is an object of type `UserDTO`. It contains the
	 * following properties:
	 * @returns An instance of the AuthResponseDTO class is being returned.
	 */
	async login(user: UserDTO) {
		const payload = { username: user.username, sub: user.id };
		const token = {
			access_token: this.jwtService.sign(payload),
			refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
		};
		return plainToClass(AuthResponseDTO, token);
	}

	/**
	 * The function renews a user's token by signing a payload and returning it as an access token.
	 * @param {UserDTO} user - The `user` parameter is an object of type `UserDTO`. It contains
	 * information about the user, such as their username and ID.
	 * @returns an instance of the `AuthResponseDTO` class, which is created using the `plainToClass`
	 * function. The `AuthResponseDTO` object contains an `access_token` property, which is generated
	 * by signing a payload using the `jwtService.sign` method.
	 */
	async renewToken(user: UserDTO) {
		const payload = { username: user.username, sub: user.id };
		const token = {
			access_token: this.jwtService.sign(payload),
		};
		return plainToClass(AuthResponseDTO, token);
	}

	/**
	 * The function `validateJwtToken` takes a JWT token, verifies its authenticity, extracts the
	 * payload, finds the corresponding user in the database, and returns the user if found, otherwise
	 * throws an error.
	 * @param {string} token - The `token` parameter is a string that represents a JSON Web Token
	 * (JWT). It is used for authentication and authorization purposes.
	 * @returns the user object if the token is valid and the user is found. If the token is invalid or
	 * the user is not found, an error is thrown.
	 */
	async validateJwtToken(token: string) {
		this.logger.debug('Authorization extracted ', token);
		token = token.split(' ')[1];
		try {
			const payload = await this.jwtService.verifyAsync(token);
			this.logger.debug('payload ', JSON.stringify(payload));
			const userId = payload.sub;
			const user = await this.userService.findById(userId);
			if (isEmpty(user)) {
				throw new Error('User not Found');
			}
			return user;
		} catch (error) {
			this.logger.error(error);
			throw new Error(error);
		}
	}
}

function isMatchPasswords(enteredPassword: string, actualPassword: string) {
	return actualPassword === enteredPassword;
}
