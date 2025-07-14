import { createItem, findItemAndEdit, findItems, findItemAndAddPrice } from "@/services/Item.services";
import { Request, Response } from "express";

export const postItem = async (req: Request, res: Response) => {
    try {
        const itemData = req.body;
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