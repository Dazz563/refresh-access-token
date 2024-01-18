import 'reflect-metadata';
import {DataSource} from 'typeorm';

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'root',
	password: 'Darrennienaber01',
	database: 'refresh_token',
	synchronize: true,
	logging: false,
	entities: ['src/entity/**/*{.ts,.js}'],
	migrations: ['src/migration/**/*{.ts,.js}'],
	subscribers: [],
});
