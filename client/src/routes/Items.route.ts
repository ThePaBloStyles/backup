import axios from "axios";

const urlServer = import.meta.env.VITE_SERVER || 'http://localhost:7000';

export const createItem = async (item: any) => {
    try {
        const response = await axios.post(`${urlServer}/api/items`, item)
    
        return response.data;
    } catch (error) {
        console.error('Error creating item:', error);
        throw error;
    }
}

export const getItems = async () => {
    try {
        const response = await axios.get(`${urlServer}/api/items`)
    
        return response.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
}


export const editItem = async (id: string, item: any) => {
    try {
        const response = await axios.put(`${urlServer}/api/items`, item, {
            params: { id: id }
        })
    
        return response.data;
    } catch (error) {
        console.error('Error editing item:', error);
        throw error;
    }
}

export const getItemById = async (id: string) => {
    try {
        const response = await axios.get(`${urlServer}/api/items/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching item by id:', error);
        throw error;
    }
}