import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetReportDto } from './dtos/get-report.dto';
import { Report } from './reptort.entity';

@Injectable()
export class ReportsService {
	constructor(@InjectRepository(Report) private reportsRepository: Repository<Report>) {}

	async create(retportDto: CreateReportDto, user: User): Promise<Report> {
		const report = this.reportsRepository.create(retportDto);
		report.user = user;
		return await this.reportsRepository.save(report);
	}

	async approveReports(id: string, approve: ApproveReportDto): Promise<Report> {
		const report = await this.reportsRepository.findOne(id);

		if (!report) {
			throw new NotFoundException('no report with this id');
		}

		report.approved = approve.approved;

		return this.reportsRepository.save(report);
	}

	async getEstimate(dto: GetReportDto) {
		return this.reportsRepository
			.createQueryBuilder()
			.select('AVG(price)', 'price')
			.where('make = :make', { make: dto.make })
			.andWhere('model - :model', { model: dto.model })
			.andWhere('lng - :lng BETWEEN -5 AND 5', { lng: dto.lng })
			.andWhere('lat - :lat BETWEEN -5 AND 5', { lat: dto.lat })
			.andWhere('year - :year BETWEEN -3 AND 3', { year: dto.year })
			.andWhere('approved IS TRUE')
			.orderBy('ABS(mileage - :mileage)', 'DESC')
			.setParameters({ millage: dto.mileage })
			.limit(3)
			.getRawOne();
	}
}
