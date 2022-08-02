import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Session,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
	constructor(private userService: UsersService, private authService: AuthService) {}

	@Post('signup')
	async createUser(@Body() body: CreateUserDto, @Session() session: any): Promise<User> {
		const user = await this.authService.signup(body.email, body.password);
		session.userId = user.id;
		return user;
	}

	@Post('signin')
	async signinUser(@Body() body: CreateUserDto, @Session() session: any): Promise<User> {
		const user = await this.authService.signin(body.email, body.password);
		session.userId = user.id;
		return user;
	}

	@Get('user')
	@UseGuards(AuthGuard)
	currentUser(@CurrentUser() user: User): User {
		return user;
	}

	@Post('signout')
	userSignOut(@Session() session: any): any {
		return (session.userId = null);
	}

	@Get(':id')
	async findUser(@Param('id') id: string): Promise<User> {
		return await this.userService.findOne(parseInt(id));
	}

	@Get()
	async findAllUsers(@Query('email') email: string): Promise<User[]> {
		return await this.userService.find(email);
	}

	@Delete(':id')
	async removeUser(@Param('id') id: string): Promise<User> {
		return await this.userService.remove(parseInt(id));
	}

	@Patch(':id')
	async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> {
		return await this.userService.update(parseInt(id), body);
	}
}
