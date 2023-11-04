import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'class-validator';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

    private logger: Logger = new Logger(UserService.name);
    
    /**
     * The create function saves a user object to the database, removes the password field, and returns
     * a UserDTO object.
     * @param {UserDTO} dto - The `dto` parameter is an object of type `UserDTO`. It is used to create
     * a new user by saving the `dto` object to the user repository (`userRepo`).
     * @returns an instance of the UserDTO class.
     */
    async create(dto: UserDTO) {
        const user: User = await this.userRepo.save(dto);
        delete user.password;
        return plainToClass(UserDTO, user);
    }

    /**
     * The `findAll` function retrieves all users from the database, removes the password field from
     * each user object, and returns an array of user DTOs.
     * @returns The `findAll` function returns an array of `UserDTO` objects.
     */
    async findAll() {
        const users: User[] = await this.userRepo.find();
        return users.map((user) => {
            delete user.password;
            return plainToClass(UserDTO, user);
        });
    }

    /**
     * The function findById retrieves a user by their ID, removes the password field from the user
     * object, and returns a UserDTO object.
     * @param {number} id - The `id` parameter is a number that represents the unique identifier of a
     * user.
     * @returns a Promise that resolves to an instance of the UserDTO class.
     */
    async findById(id: number) {
        const user: User = await this.userRepo.findOneBy({ id: id });
        delete user?.password;
        return plainToClass(UserDTO, user);
    }

    
    /**
     * The function finds and returns a user object based on the provided username.
     * @param {string} username - A string representing the username of the user you want to find.
     * @returns a Promise that resolves to a User object.
     */
    async findEntireObjByUserName(username: string): Promise<User> {
        return this.userRepo.findOneBy({ username: username });
    }

    /**
     * The function deletes a user by their ID if they exist, otherwise it throws an error.
     * @param {number} id - The `id` parameter is a number that represents the unique identifier of the
     * user that needs to be deleted.
     */
    async deleteById(id: number) {
        const user: User = await this.userRepo.findOneBy({ id: id });
        if (isEmpty(user)) {
            this.logger.error(`cannot find user of id ${id}`)
            throw new HttpException(`cannot find user of id ${id}`, HttpStatus.NO_CONTENT)
        }
        this.userRepo.remove(user);
    }
}
