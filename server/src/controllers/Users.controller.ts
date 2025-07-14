import { findAllUsers, createUser } from "../services/Users.services";
import { Request, Response } from "express";
import userModel from '../models/User.model';
import orderModel from '../models/Order.model';
import bcrypt from 'bcryptjs';

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ state: false, message: 'Usuario no encontrado' });
    res.status(200).json({ state: true, user });
  } catch (error) {
    res.status(400).json({ state: false, message: 'Error al obtener usuario' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, role, password, name } = req.body;
  try {
    const updateFields: any = {};
    if (username || name) updateFields.name = username || name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }
    const updated = await userModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
    if (!updated) return res.status(404).json({ state: false, message: 'Usuario no encontrado' });
    res.status(200).json({ state: true, user: updated });
  } catch (error) {
    res.status(400).json({ state: false, message: 'Error al actualizar usuario' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await userModel.findByIdAndDelete(id);
    res.status(200).json({ state: true, message: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ state: false, message: 'Error al eliminar usuario' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ state: true, users });
  } catch (error) {
    res.status(400).json({ state: false, message: 'Error al obtener usuarios' });
  }
};

export const newUser = async (req: Request, res: Response) => {
  try {
    const { userData } = req.body;
    const newUser = new userModel(userData);
    await newUser.save();
    res.status(200).json({ state: true, newUser });
  } catch (error) {
    res.status(400).json({ state: false, message: 'Error al crear usuario' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, lastName, phone, address } = req.body;
  
  try {
    const updateFields: any = {};
    if (name) updateFields.name = name;
    if (lastName) updateFields.lastName = lastName;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    
    const updated = await userModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ 
        state: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    res.status(200).json({ 
      state: true, 
      message: 'Perfil actualizado correctamente',
      user: updated 
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(400).json({ 
      state: false, 
      message: 'Error al actualizar el perfil' 
    });
  }
};

export const changeUserPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  
  try {
    // Buscar el usuario
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ 
        state: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    // Verificar la contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        state: false, 
        message: 'La contraseña actual es incorrecta' 
      });
    }
    
    // Validar que la nueva contraseña tenga al menos 6 caracteres
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        state: false, 
        message: 'La nueva contraseña debe tener al menos 6 caracteres' 
      });
    }
    
    // Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    
    // Actualizar la contraseña
    const updated = await userModel.findByIdAndUpdate(
      id,
      { $set: { password: hashedNewPassword } },
      { new: true }
    );
    
    res.status(200).json({ 
      state: true, 
      message: 'Contraseña cambiada correctamente' 
    });
    
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(400).json({ 
      state: false, 
      message: 'Error al cambiar la contraseña' 
    });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    // Buscar órdenes del usuario
    const orders = await orderModel.find({ 
      'customer.userId': id 
    }).sort({ createdAt: -1 }); // Ordenar por fecha descendente
    
    res.status(200).json({ 
      state: true, 
      orders 
    });
    
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(400).json({ 
      state: false, 
      message: 'Error al obtener el historial de compras' 
    });
  }
};