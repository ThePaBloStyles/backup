import { Response, NextFunction } from 'express';
import { verifyToken } from '../services/Auth.services';
import userModel from '../models/User.model';
import { RequestWithUser } from '../interfaces/User.interface';

export const authMiddleware = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const Authorization = req.headers.authorization/* req.header('Authorization') */;
		console.log(Authorization)
		if (!Authorization) {
			return res.status(404).json({
				message: 'Authentication token missing',
			});
		}

		const userId = verifyToken(Authorization);
		//@ts-ignore
		const findUser = await userModel.findById(userId)
		if (!findUser) {
			return res.status(401).json({
				message: 'Wrong authentication token',
			});
		}
		req.user = findUser;
		next();
	} catch (error) {
		return res.status(401).json({
			message: 'Error in authentication token',
		});
	}
};
