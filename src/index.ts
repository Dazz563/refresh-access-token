import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import {AppDataSource} from './config/data-source';

AppDataSource.initialize().then(async () => {
	const app = express();

	app.use(express.json());
	app.use(express.urlencoded({extended: true}));
	app.use(cookieParser());

	app.use(
		cors({
			origin: ['http://localhost:3000', 'https://localhost:4200'],
			credentials: true,
		})
	);

	app.get('/', (req, res) => {
		res.send('Hello World!');
	});

	app.listen(3000, () => {
		console.log('Server started on http://localhost:3000');
		console.log('Connection to database established');
	});
});
