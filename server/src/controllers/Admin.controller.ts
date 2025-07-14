import { Request, Response } from 'express';
import userModel from '../models/User.model';

// Cambiar el rol de un usuario (solo para administradores)
export const updateUserRole = async (req: Request, res: Response) => {
  const { userId, role } = req.body;
  if (!['usuario', 'administrador', 'bodeguero'].includes(role)) {
    return res.status(400).json({ message: 'Rol inválido' });
  }
  try {
    const user = await userModel.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Rol actualizado', user });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el rol', error: err });
  }
};
