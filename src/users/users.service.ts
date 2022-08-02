import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	async create(email: string, password: string): Promise<User> {
		const user = this.userRepository.create({ email, password });

		return await this.userRepository.save(user);
	}

	async findOne(id: number): Promise<User> {
		if (!id) {
			return null;
		} else {
			return await this.userRepository.findOne(id);
		}
	}

	async find(email: string): Promise<User[]> {
		return await this.userRepository.find({ email: email });
	}

	async update(id: number, atrs: Partial<User>): Promise<User> {
		const user = await this.userRepository.findOne(id);
		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}
		Object.assign(user, atrs);
		return await this.userRepository.save(user);
	}

	async remove(id: number): Promise<User> {
		const user = await this.userRepository.findOne(id);
		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}
		return await this.userRepository.remove(user);
	}
}
