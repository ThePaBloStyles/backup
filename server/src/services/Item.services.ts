export const deleteItem = async (id: string) => {
    return await itemModel.findByIdAndDelete(id);
}
import itemModel from "@/models/Item.model";

export const createItem = async (itemData: any) => {
    const item = await itemModel.create(itemData);
    return item;
}

export const findItems = async () => {
    const items = await itemModel.find().sort({ createdAt: -1 });
    return items;
}

export const findItemAndEdit = async (id: string, itemData: any) => {
    const item = await itemModel.findByIdAndUpdate(id, itemData, {
        new: true,
    });
    return item;
}

export const findItemAndAddPrice = async (id: string, newPrice: any) => {
    const item : any = await itemModel.findById(id);
    if (!item) {
        throw new Error('Item not found');
    }
    const newItem = item
    newItem.price.push(newPrice);
    return await itemModel.findByIdAndUpdate(id, newItem, {
        new: true
    });
}