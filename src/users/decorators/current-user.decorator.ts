import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: any, context: ExecutionContext) => {
	const requset = context.switchToHttp().getRequest();
	return requset.currentUser;
});
