import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item, quantity = 1) => {
    const exists = cartItems.find(i => i._id === item._id);

    if (exists) {
      const newQuantity = exists.quantity + quantity;
      if (newQuantity > exists.stock) {
        alert(`ไม่สามารถเพิ่มสินค้าเกินจำนวนในสต็อกได้ (มีอยู่ ${exists.stock} ชิ้นในสต็อก และ ${exists.quantity} ในตะกร้าแล้ว)`);
        return;
      }
      setCartItems(cartItems.map(i =>
        i._id === item._id ? { ...i, quantity: newQuantity } : i
      ));
    } else {
      if (quantity > item.quantity) {
        alert(`ไม่สามารถเพิ่มสินค้าเกินจำนวนในสต็อกได้ (มีอยู่ ${item.quantity} ชิ้น)`);
        return;
      }
      const newItem = {
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.images && item.images.length > 0 ? item.images[0].url : '',
        stock: item.quantity,
        quantity: quantity
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(i => i._id !== id));
  };

  const increaseQty = (id) => {
    setCartItems(cartItems.map(i => {
      if (i._id === id) {
        if (i.quantity >= i.stock) {
          alert(`สินค้ามีในสต็อกเพียง ${i.stock} ชิ้น`);
          return i;
        }
        return { ...i, quantity: i.quantity + 1 };
      }
      return i;
    }));
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