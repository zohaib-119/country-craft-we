'use client'

import React, { createContext, useState, useContext, useEffect } from "react";

// Create the Cart Context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(()=> {
    const syncCartWithDatabase = async () => {
      try {
        const response = await fetch("/api/cart/products");

        console.log('sync')
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const {items} = await response.json();
  
        if(items.length > 0)
          setCart([...items]);
      } catch (error) {
        console.error("Error fetching cart products:", error);
      }
    };
    syncCartWithDatabase();
  }, []) ;

  const apiRequest = async (action, data = {}) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, ...data }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  };

  const isProductInCart = (productId) => {
    return cart.some((product) => product.id === productId);
  };

  const addProduct = async (newProduct) => {
    try {
      const existingProduct = cart.find(
        (product) => product.id === newProduct.id
      );

      if (existingProduct) {
        apiRequest("addProduct", { product_id: newProduct.id });
        setCart((prevCart) =>
          prevCart.map((product) =>
            product.id === newProduct.id
              ? { ...product, quantity: product.quantity + 1 }
              : product
          )
        );
      } else {
        apiRequest("addProduct", { product_id: newProduct.id });
        setCart((prevCart) => [...prevCart, { ...newProduct, quantity: 1 }]);
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const addStock = async (productId) => {
    try {
      apiRequest("addProduct", { product_id: productId });
      setCart((prevCart) =>
        prevCart.map((product) =>
          product.id === productId
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );
    } catch (error) {
      console.error("Failed to add stock:", error);
    }
  };

  const removeStock = async (productId) => {
    try {
      apiRequest("removeStock", { product_id: productId });
      setCart((prevCart) =>
        prevCart
          .map((product) =>
            product.id === productId
              ? { ...product, quantity: product.quantity - 1 }
              : product
          )
          .filter((product) => product.quantity > 0)
      );
    } catch (error) {
      console.error("Failed to remove stock:", error);
    }
  };

  const removeProduct = async (productId) => {
    try {
      apiRequest("removeProduct", { product_id: productId });
      setCart((prevCart) =>
        prevCart.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Failed to remove product:", error);
    }
  };

  const clearCart = async () => {
    try {
      apiRequest("clearCart");
      setCart([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

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
