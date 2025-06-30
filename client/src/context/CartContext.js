import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    const exists = cartItems.find(i => i._id === item._id);
    if (exists) {
      setCartItems(cartItems.map(i =>
        i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(i => i._id !== id));
  };

  const increaseQty = (id) => {
    setCartItems(cartItems.map(i =>
      i._id === id ? { ...i, quantity: i.quantity + 1 } : i
    ));
  };

  const decreaseQty = (id) => {
    setCartItems(cartItems.map(i =>
      i._id === id
        ? { ...i, quantity: Math.max(1, i.quantity - 1) }
        : i
    ));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      totalPrice,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};
    