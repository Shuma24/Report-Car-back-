import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetReportDto } from './dtos/get-report.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
	constructor(private reportsService: ReportsService) {}

	@Post()
	@UseGuards(AuthGuard)
	@Serialize(ReportDto)
	async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
		return await this.reportsService.create(body, user);
	}

	@Patch(':id')
	approveReport(@Param('id') id: string, @Body() approve: ApproveReportDto) {
		return this.reportsService.approveReports(id, approve);
	}

	@Get()
	async getEstimate(@Query() query: GetReportDto) {
		return await this.reportsService.getEstimate(query);
	}
}
