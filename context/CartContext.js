'use client'

import React, { createContext, useState, useContext } from "react";

// Create the Cart Context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const isProductInCart = (productId) => {
    return cart.some((product) => product.id === productId);
  };

  const addProduct = (newProduct) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (product) => product.id === newProduct.id
      );

      if (existingProduct) {
        return prevCart.map((product) =>
          product.id === newProduct.id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        );
      } else {
        return [...prevCart, { ...newProduct, quantity: 1 }];
      }
    });
  };

  const addStock = (productId) => {
    setCart((prevCart) =>
      prevCart.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const removeStock = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((product) =>
          product.id === productId
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
        .filter((product) => product.quantity > 0)
    );
  };

  const removeProduct = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((product) => product.id !== productId)
    );
  };

  const clearCart = () => setCart([]);

  const getTotalItems = () =>
    cart.reduce((total, product) => total + product.quantity, 0);

  const getTotalPrice = () =>
    cart.reduce((total, product) => total + product.quantity * product.price, 0);

  const getProductQuantity = (productId) => {
    const product = cart.find((product) => product.id === productId);
    return product ? product.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addProduct,
        addStock,
        removeStock,
        removeProduct,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isProductInCart,
        getProductQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to Use Cart Context
export const useCartContext = () => useContext(CartContext);
