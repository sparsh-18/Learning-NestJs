import { NestInterceptor, ExecutionContext, CallHandler, Inject, forwardRef } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "src/users/services/users.service";

export class CurrentUserInterceptor implements NestInterceptor {
    
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService;

    async intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Promise<Observable<void>> {
        
        const request = context.switchToHttp().getRequest();
        const userId = request.session.userId;
        const user = await this.userService.findOne(userId);
        // console.log(user);
        
        if (user) request.user = user; // adding logged in user to request
  
      return next.handle();
    }
  }
  