import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserMiddleweare } from './middlewares/current-user.middleweare';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UsersService, AuthService],
	controllers: [UsersController],
})
export class UsersModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CurrentUserMiddleweare).forRoutes('*');
	}
}
