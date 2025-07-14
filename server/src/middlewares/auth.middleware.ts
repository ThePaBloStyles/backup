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

export const clientAuthMiddleware = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	try {
		const Authorization = req.headers.authorization;
		console.log('🔐 Verificando autenticación de cliente:', Authorization ? '✓ Token presente' : '✗ Sin token');
		
		if (!Authorization) {
			return res.status(401).json({
				success: false,
				message: 'Debes iniciar sesión para realizar compras',
				error: 'AUTHENTICATION_REQUIRED',
				requireLogin: true
			});
		}

		const userId = verifyToken(Authorization);
		const findUser = await userModel.findById(userId);
		
		if (!findUser) {
			return res.status(401).json({
				success: false,
				message: 'Token de autenticación inválido',
				error: 'INVALID_TOKEN',
				requireLogin: true
			});
		}

		// Verificar que el usuario tenga rol de cliente (si tienes roles)
		// Si no tienes sistema de roles, esto se puede omitir
		// if (findUser.role !== 'client') {
		// 	return res.status(403).json({
		// 		success: false,
		// 		message: 'Acceso denegado. Se requiere cuenta de cliente',
		// 		error: 'INSUFFICIENT_PERMISSIONS'
		// 	});
		// }

		req.user = findUser;
		console.log('✅ Cliente autenticado:', findUser.email);
		next();
	} catch (error) {
		console.error('❌ Error en autenticación de cliente:', error);
		return res.status(401).json({
			success: false,
			message: 'Error en la autenticación. Por favor, inicia sesión nuevamente',
			error: 'AUTHENTICATION_ERROR',
			requireLogin: true
		});
	}
};
