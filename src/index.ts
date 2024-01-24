import cookieParser from 'cookie-parser';
import express from 'express';
require('dotenv').config();
import cors from 'cors';
import {AppDataSource} from './config/data-source';
import {routes} from './routes';

AppDataSource.initialize().then(async () => {
	const app = express();

	app.use(express.json());
	app.use(express.urlencoded({extended: true}));
	app.use(cookieParser());

	app.use(
		cors({
			origin: 'http://localhost:4200',
			credentials: true,
		})
	);

	// app.use((req, res, next) => {
	// 	console.log('Request Method:', req.method);
	// 	console.log('Request URL:', req.url);
	// 	console.log('Request Headers:', req.headers);
	// 	console.log('Request Body:', req.body);
	// 	next();
	// });

	routes(app);

	app.listen(3000, () => {
		console.log('Server started on http://localhost:3000');
		console.log('Connection to database established');
	});
});
