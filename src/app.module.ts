import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/reptort.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env.${process.env.NODE_ENV}` }),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					type: 'sqlite',
					database: config.get<string>('DB_NAME'),
					entities: [User, Report],
					synchronize: true,
				};
			},
		}),
		UsersModule,
		ReportsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
