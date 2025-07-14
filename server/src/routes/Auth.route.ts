import { login } from "@controllers/Auth.controller";
import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router()

router.post('/login', login)
// Ruta para verificar si el token es válido
router.get('/verify', authMiddleware, (req: any, res: any) => {
  // Si llegamos aquí, el middleware de auth ya validó el token
  res.json({
    success: true,
    message: 'Token válido',
    user: {
      _id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      lastName: req.user.lastName,
      role: req.user.role || 'cliente'
    }
  });
});

export default router