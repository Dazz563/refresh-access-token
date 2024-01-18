import {Request, Response} from 'express';
import bcryptjs from 'bcryptjs';

import {AppDataSource} from '../config/data-source';
import {User} from '../entity/user.entity';
import {signJwt, verifyJwt} from '../utils/jwt';
import {Token} from '../entity/token.entity';
import {MoreThanOrEqual} from 'typeorm';

const userRepository = AppDataSource.getRepository(User);
const tokenRepository = AppDataSource.getRepository(Token);

export interface JwtPayload {
	userId: number;
	email: string;
}

export const register = async (req: Request, res: Response) => {
	try {
		const {name, email, password} = req.body;
		console.log('req body: ', req.body);

		// Validate presence of name, email, and password
		if (!name || !email || !password) {
			return res.status(400).json({error: 'Missing required fields'});
		}

		// Save user to database
		const user = await userRepository.save({
			name,
			email,
			password: await bcryptjs.hash(password, 12),
		});

		return res.json(user);
	} catch (error) {
		console.error('Error:', error);

		return res.status(500).json({error: 'Internal Server Error'});
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const {email, password} = req.body;
		console.log('req body: ', req.body);

		// Validate presence of email and password
		if (!email || !password) {
			return res.status(400).json({error: 'Missing required fields'});
		}

		// Find user in database
		const user = await userRepository.findOne({
			where: {email},
		});

		console.log('user', user);

		// Validate presence of user
		if (!user) {
			return res.status(404).json({error: 'Invalid credentials'});
		}

		// Validate password
		const isPasswordValid = await bcryptjs.compare(password, user.password);

		// Return error if password is invalid
		if (!isPasswordValid) {
			return res.status(401).json({error: 'Invalid password'});
		}

		// Create refreshToken
		const refreshToken = signJwt(
			{
				userId: user.id,
				email: user.email,
			},
			'JWT_REFRESH_TOKEN',
			{
				expiresIn: '1w',
			}
		);

		// Set refreshToken in cookie
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week (adjust according to application needs)
		});

		// Save refreshToken to database
		await tokenRepository.save({
			userId: user.id,
			token: refreshToken,
			expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week (adjust according to application needs)
		});

		const token = signJwt(
			{
				userId: user.id,
				email: user.email,
			},
			'JWT_ACCESS_TOKEN',
			{
				expiresIn: '30s', // up this to 15 minutes just for testing (adjust according to application needs)
			}
		);

		return res.json({
			token,
		});
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).json({error: 'Internal Server Error'});
	}
};

export const getAuthenticatedUser = async (req: Request, res: Response) => {
	try {
		const accessToken = req.header('Authorization')?.split(' ')[1] || '';

		// Validate presence of accessToken
		const payload: JwtPayload = verifyJwt(accessToken, 'JWT_ACCESS_TOKEN');

		if (!payload) {
			return res.status(401).json({error: 'unauthenticated'});
		}

		// Find user in database
		const user = await userRepository.findOne({
			where: {id: payload.userId},
		});

		// Validate presence of user
		if (!user) {
			return res.status(404).json({error: 'unauthenticated'});
		}

		const {password, ...data} = user;

		return res.json(data);
	} catch (error) {
		console.error('Error:', error);
		return res.status(401).json({error: 'unauthenticated'});
	}
};

export const refreshAccessToken = async (req: Request, res: Response) => {
	try {
		const refreshToken = req.cookies['refreshToken'];

		// Validate presence of refreshToken
		const payload: JwtPayload = verifyJwt(refreshToken, 'JWT_REFRESH_TOKEN');

		console.log('payload', payload);

		if (!payload) {
			return res.status(401).json({error: 'unauthenticated'});
		}

		// Find token in database
		const dbToken = await tokenRepository.findOne({
			where: {
				userId: payload.userId,
				expiredAt: MoreThanOrEqual(new Date()),
			},
		});

		console.log('dbToken', dbToken);

		// Check the expiration date of the token
		if (!dbToken) {
			console.log('trigger');

			return res.status(401).json({error: 'unauthenticated'});
		}

		// Create accessToken and refreshToken
		const token = signJwt(
			{
				userId: payload.userId,
				email: payload.email,
			},
			'JWT_ACCESS_TOKEN',
			{
				expiresIn: '30s',
			}
		);

		return res.json({
			token,
		});
	} catch (error) {
		console.error('Error:', error);
		return res.status(401).json({error: 'unauthenticated'});
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		const refreshToken = req.cookies['refreshToken'];

		// Delete refreshToken from database
		await tokenRepository.delete({token: refreshToken});

		res.clearCookie('refreshToken');

		return res.json({message: 'Successfully logged out'});
	} catch (error) {
		console.error('Error:', error);
		return res.status(500).json({error: 'Internal Server Error'});
	}
};
