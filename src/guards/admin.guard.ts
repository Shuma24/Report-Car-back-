import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminAuthorizationGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest();

		if (!req.currentUser) {
			return false;
		}

		return req.currentUser.admin;
	}
}
