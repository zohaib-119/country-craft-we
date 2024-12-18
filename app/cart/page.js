// pages/cart.js

'use client';

import React, { useEffect } from 'react';
import { useCartContext } from '@/context/CartContext'; // Adjust the path as needed

const mockData = [
  {
    id: '1',
    name: 'Product 1',
    price: 29.99,
    quantity: 1,
    stockQuantity: 10,
    image: ['https://via.placeholder.com/150'],
    description: 'Description for product 1',
  },
  {
    id: '2',
    name: 'Product 2',
    price: 19.99,
    quantity: 2,
    stockQuantity: 5,
    image: ['https://via.placeholder.com/150'],
    description: 'Description for product 2',
  },
  {
    id: '3',
    name: 'Product 3',
    price: 39.99,
    quantity: 1,
    stockQuantity: 8,
    image: ['https://via.placeholder.com/150'],
    description: 'Description for product 3',
  },
];

const CartPage = () => {
  const {
    cart,
    getTotalItems,
    getTotalPrice,
    clearCart,
    removeProduct,
    addProduct,
    removeStock,
    addStock,
  } = useCartContext();

  useEffect(() => {
    // Add mock data to cart on component mount
    mockData.forEach((product) => addProduct(product));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center justify-between p-4 border-b">
                <img src={item.image[0]} alt={item.name} className="w-16 h-16 rounded" />
                <div className="flex-grow ml-4">
                  <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-600">Price: ${item.price}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">Stock: {item.stockQuantity}</p>
                </div>
                <div className="flex items-center">
                  <button
                    className={`px-2 py-1 rounded mr-2 ${item.quantity > 1 ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                    onClick={() => removeStock(item.id)}
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <button
                    className={`px-2 py-1 rounded ${item.quantity < item.stockQuantity ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                    onClick={() => addStock(item.id)}
                    disabled={item.quantity >= item.stockQuantity}
                  >
                    +
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 ml-4"
                    onClick={() => removeProduct(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between mt-4">
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              onClick={clearCart}
            >
              Clear Cart
            </button>
            <div className="text-gray-800">
              <p>Total Items: {getTotalItems()}</p>
              <p>Total Price: ${getTotalPrice().toFixed(2)}</p>
            </div>
          </div>

          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 w-full mt-4"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
