// Obtener un producto por su id
import itemModel from "../models/Item.model";

export const getItemById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await itemModel.findById(id);
        if (!item) return res.status(404).json({ message: 'Producto no encontrado' });
        res.status(200).json({ item });
    } catch (error) {
        res.status(400).json({ message: 'Error al obtener producto', error });
    }
};
// ...existing code...

export const deleteItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ message: 'Falta el id del producto' });
        const deleted = await import("../services/Item.services").then(m => m.deleteItem(id as string));
        if (!deleted) return res.status(404).json({ message: 'Producto no encontrado' });
        res.status(200).json({ message: 'Producto eliminado', item: deleted });
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar producto', error });
    }
};
import { createItem, findItemAndEdit, findItems, findItemAndAddPrice } from "@/services/Item.services";
import { Request, Response } from "express";

export const postItem = async (req: Request, res: Response) => {
    try {
        const itemData = req.body;
        // Validar duplicado por 'code'
        if (itemData.code) {
            const exists = await import("../models/Item.model").then(m => m.default.findOne({ code: itemData.code }));
            if (exists) {
                return res.status(409).json({ message: 'Ya existe un producto con ese código', item: exists });
            }
        }
        const item = await createItem(itemData);
        res.status(201).json({ message: 'Item created successfully', item });
    } catch (error) {
        res.status(400).json({ message: 'Error creating item', error });
    }
}

export const getItems = async (req: Request, res: Response) => {
    try {
        const items = await findItems();
        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching items', error });
    }
}

export const putItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        const itemData = req.body;
        const item = await findItemAndEdit(id as string, itemData);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item updated successfully', item });
    } catch (error) {
        res.status(400).json({ message: 'Error updating item', error });
    }
}


export const putPrice = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        const newPrice = req.body;
        const item = await findItemAndAddPrice(id as string, newPrice);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item updated successfully', item });
    } catch (error) {
        res.status(400).json({ message: 'Error updating item', error });
    }
}