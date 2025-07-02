import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState([]);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('cartProducts');
      if (stored) setCartProducts(JSON.parse(stored));
    })();
  }, []);

  // Save cart to AsyncStorage on change
  useEffect(() => {
    AsyncStorage.setItem('cartProducts', JSON.stringify(cartProducts));
  }, [cartProducts]);

  const addToCart = (product) => {
    setCartProducts((prev) => {
      // Check if product already exists (by id), if yes, increase quantity
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, amount) => {
    setCartProducts((prev) =>
      prev
        .map((p) =>
          p.id === productId ? { ...p, quantity: Math.max(1, (p.quantity || 1) + amount) } : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCartProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Call this on logout
  const clearCart = async () => {
    setCartProducts([]);
    await AsyncStorage.removeItem('cartProducts');
  };

  const value = { cartProducts, addToCart, updateQuantity, removeFromCart, clearCart };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext); 