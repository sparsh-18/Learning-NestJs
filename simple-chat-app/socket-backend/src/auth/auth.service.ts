import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthDTO } from './auth.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    private logger: Logger = new Logger(UserService.name);

    async validate(dto: AuthDTO) {
        const user: User = await this.userService.findEntireObjByUserName(dto.username);
        if (isMatchPasswords(dto.password, user.password)) {
            return true;
        }
        return false;
    }
}

function isMatchPasswords(enteredPassword: string, actualPassword: string) {
    return actualPassword === enteredPassword;
}

