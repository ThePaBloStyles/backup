import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  img: string;
  brand?: string;
  code: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart && savedCart !== 'undefined' && savedCart !== 'null') {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            // Verificar integridad de cada item
            const validItems = parsedCart.filter(item => 
              item && 
              item._id && 
              typeof item.name === 'string' && 
              typeof item.price === 'number' && 
              typeof item.quantity === 'number' &&
              item.quantity > 0
            );
            
            if (validItems.length !== parsedCart.length) {
              console.warn('Se encontraron items inválidos en el carrito, limpiando...');
            }
            
            setCartItems(validItems);
            console.log('Carrito cargado desde localStorage:', validItems);
          }
        } else {
          console.log('No hay carrito guardado en localStorage');
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        // Si hay error, inicializar carrito vacío
        localStorage.removeItem('cart');
        setCartItems([]);
      } finally {
        setIsLoaded(true);
      }
    };

    loadCartFromStorage();
  }, []);

  // Guardar carrito en localStorage cuando cambie (solo después de la carga inicial)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        console.log('Carrito guardado en localStorage:', cartItems);
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product: any, quantity: number = 1) => {
    if (!product || !product._id) {
      console.error('Producto inválido para agregar al carrito:', product);
      return;
    }

    const price = product.price && product.price.length > 0 
      ? product.price[product.price.length - 1].value 
      : 0;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // Si el producto ya existe, actualizar cantidad
        const updatedItems = prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
            : item
        );
        console.log('Producto actualizado en carrito:', product.name);
        return updatedItems;
      } else {
        // Si es un producto nuevo, agregarlo
        const newItem: CartItem = {
          _id: product._id,
          name: product.name,
          price: price,
          img: product.img || '',
          brand: product.brand || '',
          code: product.code || product.codeProduct || '',
          quantity: Math.min(quantity, product.stock || 1),
          stock: product.stock || 1
        };
        console.log('Producto agregado al carrito:', newItem.name);
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item._id !== productId);
      console.log('Producto removido del carrito:', productId);
      return updatedItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item._id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      );
      console.log('Cantidad actualizada para producto:', productId, 'Nueva cantidad:', quantity);
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    console.log('Carrito limpiado completamente');
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item._id === productId);
  };

  const getCartItemQuantity = (productId: string) => {
    const item = cartItems.find(item => item._id === productId);
    return item ? item.quantity : 0;
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Función para verificar integridad del carrito
  const verifyCartIntegrity = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        const isValid = Array.isArray(parsedCart) && 
                       parsedCart.every(item => 
                         item._id && 
                         typeof item.name === 'string' && 
                         typeof item.price === 'number' && 
                         typeof item.quantity === 'number'
                       );
        console.log('Integridad del carrito:', isValid ? 'VÁLIDO' : 'INVÁLIDO');
        return isValid;
      }
      return true;
    } catch (error) {
      console.error('Error verificando integridad del carrito:', error);
      return false;
    }
  };

  // Debug: mostrar estado del carrito en consola
  useEffect(() => {
    console.log('Estado actual del carrito:', {
      items: cartItems,
      count: cartCount,
      total: cartTotal,
      isLoaded: isLoaded
    });
  }, [cartItems, cartCount, cartTotal, isLoaded]);

  const value: CartContextType = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
