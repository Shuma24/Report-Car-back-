import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
	let service: AuthService;
	let fakeUserService: Partial<UsersService>;

	beforeEach(async () => {
		const user: User[] = [];
		fakeUserService = {
			find: (email: string) => {
				const filtredUsers = user.filter((user) => user.email === email);
				return Promise.resolve(filtredUsers);
			},
			create: async (email: string, password: string) => {
				const users = { id: Math.floor(Math.random() * 999999), email, password } as User;
				user.push(users);
				return await Promise.resolve(users);
			},
		};
		const module = await Test.createTestingModule({
			providers: [AuthService, { provide: UsersService, useValue: fakeUserService }],
		}).compile();

		service = module.get(AuthService);
	});

	it('can create instance of auth service', async () => {
		expect(service).toBeDefined();
	});

	it('create new user with hash paswword', async () => {
		const user = await service.signup('sadds@gmail.com', '123456');
		expect(user.password).not.toEqual('123456');
		const [salt, hash] = user.password.split('.');
		expect(salt).toBeDefined();
		expect(hash).toBeDefined();
	});

	it('throws an error if email is in use', async () => {
		expect.assertions(1);
		fakeUserService.find = () =>
			Promise.resolve([{ id: 1, email: 'a@a.a', password: 'q' } as User]);
		await expect(service.signup('user@mail.com', 'qwerty')).rejects.toBeInstanceOf(
			BadRequestException,
		);
	});

	it('throws if signin is called with and unused email', async () => {
		await expect(service.signin('asdfasdf@asdf.com', 'asdfsadf')).rejects.toThrowError(
			NotFoundException,
		);
	});

	it('returns a user if correct password is provided', async () => {
		await service.signup('asdf@asdf.com', 'mypassword');

		const user = await service.signin('asdf@asdf.com', 'mypassword');
		expect(user).toBeDefined();
	});
});
