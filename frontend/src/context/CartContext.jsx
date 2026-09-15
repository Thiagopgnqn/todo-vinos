import React, { createContext, useState, useEffect, useCallback } from 'react';
import Toast from '../components/ui/Toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const [notification, setNotification] = useState({ show: false, message: '', product: null });

  const closeNotification = useCallback(() => {
    setNotification({ show: false, message: '', product: null });
  }, []);

  const addToCart = (product, quantity) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id || item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          (item.product.id === product.id || item.product._id === product._id)
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
    setNotification({
      show: true,
      message: `${product.name} agregado al carrito`,
      product: {
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || product.image,
        winery: product.winery,
      },
    });
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId && item.product._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId || item.product._id === productId) {
          return { ...item, quantity: Math.min(quantity, item.product.stock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
      <Toast
        show={notification.show}
        message={notification.message}
        product={notification.product}
        onClose={closeNotification}
      />
    </CartContext.Provider>
  );
};
