import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/user/user.dto';
import { plainToClass } from 'class-transformer';
import { AuthResponseDTO } from './auth-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    private logger: Logger = new Logger(UserService.name);

    /**
     * The function validates a user by checking if the provided password matches the stored password,
     * and returns the user object without the password if the validation is successful.
     * @param {UserDTO} dto - UserDTO object containing the username and password of the user to be
     * validated.
     * @returns a Promise that resolves to a Partial<User> object if the passwords match, or null if
     * they do not.
     */
    async validateUser(dto: UserDTO): Promise<Partial<User>> {
        const user: User = await this.userService.findEntireObjByUserName(dto.username);
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
            refresh_token: this.jwtService.sign(payload, {expiresIn: '7d'}),
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
}

function isMatchPasswords(enteredPassword: string, actualPassword: string) {
    return actualPassword === enteredPassword;
}

