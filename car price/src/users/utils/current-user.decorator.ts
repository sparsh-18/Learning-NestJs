import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: any, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        // return the current user saved into the request by CurrentUserInterceptor
        // console.log(request.session);
        return request.user;
    }
)