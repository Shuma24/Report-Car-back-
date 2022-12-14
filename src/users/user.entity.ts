import { Report } from 'src/reports/reptort.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ default: false })
	admin: boolean;

	@OneToMany(() => Report, (report) => report.user)
	reports: Report[];
}
