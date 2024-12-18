// context/CartContext.js
import React, { createContext, useState, useContext } from "react";

// Create the Cart Context
const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add Product to Cart (with full product details)
  const addProduct = (newProduct) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (product) => product.id === newProduct.id
      );

      if (existingProduct) {
        // Increment quantity if product already exists
        return prevCart.map((product) =>
          product.id === newProduct.id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        );
      } else {
        // Add new product with quantity 1
        return [...prevCart, { ...newProduct, quantity: 1 }];
      }
    });
  };

  // Add Stock (increment quantity) - Pass product.id
  const addStock = (productId) => {
    setCart((prevCart) =>
      prevCart.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  // Remove Stock (decrement quantity) - Pass product.id
  // Automatically removes product if quantity reaches 0
  const removeStock = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((product) =>
          product.id === productId
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
        .filter((product) => product.quantity > 0) // Remove product if quantity is 0
    );
  };

  // Remove Product Completely - Pass product.id
  const removeProduct = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((product) => product.id !== productId)
    );
  };

  // Clear Cart (removes all products)
  const clearCart = () => {
    setCart([]);
  };

  // Get Total Items in Cart
  const getTotalItems = () => {
    return cart.reduce((total, product) => total + product.quantity, 0);
  };

  // Get Cart Total Price
  const getTotalPrice = () => {
    return cart.reduce(
      (total, product) => total + product.quantity * product.price,
      0
    );
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to Use Cart Context
export const useCartContext = () => useContext(CartContext);
