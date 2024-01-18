import jwt, {SignOptions} from 'jsonwebtoken';

// Sign jwt token
export const signJwt = (payload: Object, keyName: string, options: SignOptions) => {
	const privateKey = process.env[keyName] as string;
	return jwt.sign(payload, privateKey as string, {
		...options,
		algorithm: 'HS256',
	});
};

export const verifyJwt = <T>(token: string, keyName: string): T | null => {
	const privateKey = process.env[keyName] as string;
	try {
		return jwt.verify(token, privateKey) as T;
	} catch (error) {
		return null;
	}
};
