import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { UsersService } from "../services/users.service";

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(
        private userService: UsersService
    ) {}
    
    async use(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        const {userId} = req.session || {};

        if (userId) {
            const user = await this.userService.findOne(userId);
            //@ts-ignore
            req.user = user;
        }

        next();
    }
}