import { Router } from 'express';
import { updateUserRole } from '../controllers/Admin.controller';

const router = Router();

// Ruta para cambiar el rol de un usuario
router.put('/user/role', updateUserRole);

export default router;
