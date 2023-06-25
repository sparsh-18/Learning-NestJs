import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "../user.entity";

@Injectable()
export class AuthService {
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService;

    async signup(email: string, password: string) {
        // see if email is in use
        const users: User[] = await this.userService.find(email);
        if (users && users.length > 0)
            throw new BadRequestException("email is in use");
        
        // Hash the password
        // skipping for now will implement later

        // creating the user
        const newUser: User = await this.userService.create(email, password);
        return newUser;
    }

    async signin(email: string, password: string) {
        const [user]: User[] = await this.userService.find(email);
        // console.log(user);
        if (!user)
            throw new NotFoundException("user not found");
        
        // un hashing the password
        // skip for now

        // match password
        if (password !== user.password) {
            throw new UnauthorizedException("wrong password")
        }

        return user;
    }
}