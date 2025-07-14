import React, {
    createContext,
    useEffect,
    ReactNode,
    useContext,
  } from 'react';
import { getItems } from '../routes/Items.route';
  
  // Define the shape of your authentication context value
  interface ItemContextValue {
    items: any[]; // Replace 'any' with your actual item type
  }
  // Create the authentication context
  const ItemContext = createContext<any | undefined>(undefined);
  
  // Create a custom hook to use the authentication context
  export const useItem = () => {
    const context = useContext(ItemContext);
    if (!context) {
      throw new Error('useItem must be used within an ItemProvider');
    }
    return context;
  };
  
  // Define the props for the ItemProvider component
  interface ItemProviderProps {
    children: ReactNode;
    // You can add optional initial values or configuration here
  }
  
  // Create the ItemProvider component
  export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
    const [items, setItems] = React.useState<any[]>([]); // Replace 'any' with your actual item type
    useEffect(() => {
      readItems(); // Fetch items when the component mounts
    }, [])

    // Funciones 
    const readItems = async () => {
        try {
            const response = await getItems() // Adjust the URL as needed
            setItems(response); // Assuming response.data contains the items array
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }
    // Provide the authentication context value
    const value: ItemContextValue = {
        items
    };
  
    return (
      <ItemContext.Provider value={value}>
        {children}
      </ItemContext.Provider>
    );
  };