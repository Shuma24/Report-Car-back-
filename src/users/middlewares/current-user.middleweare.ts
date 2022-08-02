import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../user.entity';

import { UsersService } from '../users.service';

declare global {
	namespace Express {
		interface Request {
			currentUser?: User;
		}
	}
}
@Injectable()
export class CurrentUserMiddleweare implements NestMiddleware {
	constructor(private userServices: UsersService) {}
	async use(req: Request, res: Response, next: NextFunction) {
		const { userId }: any = req.session || {};

		if (userId) {
			const user = await this.userServices.findOne(userId);
			req.currentUser = user;
		}
		next();
	}
}
