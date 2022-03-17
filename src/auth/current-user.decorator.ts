import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        // ?? sama aja kyk or
        // jika user authentiacted, maka akan return user object / null 
        return request.user ?? null;
    }
);