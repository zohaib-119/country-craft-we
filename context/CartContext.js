'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import * as Sentry from '@sentry/react';

// Create the Cart Context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data: session } = useSession();
  const [cart, setCart] = useState([]);
  const guestStorageKey = 'cart_guest';
  const userStorageKey = session?.user?.email ? `cart_${session.user.email}` : guestStorageKey;

  useEffect(() => {
    const syncCartWithLocalStorage = () => {
      try {
        const storedCart = userStorageKey ? localStorage.getItem(userStorageKey) : null;
        const guestCart = localStorage.getItem(guestStorageKey);

        if (session?.user) {
          if ((!storedCart || JSON.parse(storedCart).length === 0) && guestCart) {
            const parsedGuestCart = JSON.parse(guestCart);
            setCart(parsedGuestCart);
            localStorage.setItem(userStorageKey, JSON.stringify(parsedGuestCart));
            localStorage.removeItem(guestStorageKey);
          } else if (storedCart) {
            setCart(JSON.parse(storedCart));
          }
        } else if (guestCart) {
          setCart(JSON.parse(guestCart));
        }
      } catch (error) {
        console.error('Error syncing cart with local storage:', error);
        Sentry.captureException(error);
      }
    };

    syncCartWithLocalStorage();
  }, [userStorageKey, session?.user]);

  const saveCartToLocalStorage = (updatedCart) => {
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error saving cart to local storage:', error);
      Sentry.captureException(error);
    }
  };

  const isProductInCart = (productId) => {
    return cart.some((product) => product.id === productId);
  };

  const addProduct = (newProduct) => {
    try {
      const existingProduct = cart.find(
        (product) => product.id === newProduct.id
      );

      let updatedCart;

      if (existingProduct) {
        updatedCart = cart.map((product) =>
          product.id === newProduct.id
            ? { ...product, quantity: product.quantity + 1, stockQuantity: newProduct.stockQuantity }
            : product
        );
      } else {
        updatedCart = [...cart, { ...newProduct, quantity: 1 }];
      }

      setCart(updatedCart);
      saveCartToLocalStorage(updatedCart);
    } catch (error) {
      console.error('Failed to add product:', error);
      Sentry.captureException(error);
    }
  };

  const addStock = (productId) => {
    try {
      const updatedCart = cart.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      );
      setCart(updatedCart);
      saveCartToLocalStorage(updatedCart);
    } catch (error) {
      console.error('Failed to add stock:', error);
      Sentry.captureException(error);
    }
  };

  const removeStock = (productId) => {
    try {
      const updatedCart = cart
        .map((product) =>
          product.id === productId
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
        .filter((product) => product.quantity > 0);

      setCart(updatedCart);
      saveCartToLocalStorage(updatedCart);
    } catch (error) {
      console.error('Failed to remove stock:', error);
      Sentry.captureException(error);
    }
  };

  const removeProduct = (productId) => {
    try {
      const updatedCart = cart.filter((product) => product.id !== productId);
      setCart(updatedCart);
      saveCartToLocalStorage(updatedCart);
    } catch (error) {
      console.error('Failed to remove product:', error);
      Sentry.captureException(error);
    }
  };

  const clearCart = () => {
    try {
      setCart([]);
      saveCartToLocalStorage([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      Sentry.captureException(error);
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