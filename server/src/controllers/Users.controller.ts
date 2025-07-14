import { findAllUsers, createUser } from "../services/Users.services";
import { Request, Response } from "express";
import userModel from '../models/User.model';
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