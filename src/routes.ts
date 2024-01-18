import {Router} from 'express';
import {
	getAuthenticatedUser, //
	login,
	logout,
	refreshAccessToken,
	register,
} from './controller/auth.controller';

export const routes = (router: Router) => {
	router.post('/api/register', register);
	router.post('/api/login', login);
	router.get('/api/user', getAuthenticatedUser);
	router.post('/api/refresh', refreshAccessToken);
	router.post('/api/logout', logout);
};
