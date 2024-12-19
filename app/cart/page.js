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
    image: ['https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg'],
    description: 'Description for product 1',
  },
  {
    id: '2',
    name: 'Product 2',
    price: 19.99,
    quantity: 2,
    stockQuantity: 5,
    image: ['https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg'],
    description: 'Description for product 2',
  },
  {
    id: '3',
    name: 'Product 3',
    price: 39.99,
    quantity: 1,
    stockQuantity: 8,
    image: ['https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg'],
    description: 'Description for product 3',
  },
  {
    id: '4',
    name: 'Product 3',
    price: 39.99,
    quantity: 1,
    stockQuantity: 8,
    image: ['https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg'],
    description: 'Description for product 3',
  },
  {
    id: '5',
    name: 'Product 3',
    price: 39.99,
    quantity: 1,
    stockQuantity: 8,
    image: ['https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg'],
    description: 'Description for product 3',
  },
  {
    id: '6',
    name: 'Product 3',
    price: 39.99,
    quantity: 1,
    stockQuantity: 8,
    image: ['https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg'],
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
    <div className="container mx-auto p-4 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 p-4 flex flex-col items-center">
        {/* Replace with a visual image or banner */}
        <div className="fixed w-1/2 bottom-56 h-64 bg-gray-200 mb-4 flex items-center justify-center">
          <img src='https://st4.depositphotos.com/1132653/38639/v/450/depositphotos_386390918-stock-illustration-orange-shopping-trolley-white-background.jpg' alt='cart banner' className="w-full" />
        </div>
      </div>
      <div className="md:w-1/2 min-h-full bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <div className='flex justify-between w-full'>
          <h1 className="text-3xl font-bold mb-4 text-orange-500">Your Cart</h1>
          <button
            className="text-orange-500 border-orange-500 border-2 px-4 py-2 rounded-full mb-2"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>


        {cart.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty</p>
        ) : (
          <ul className="w-full space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center justify-between p-4 border-b">
                <img src={item.image[0]} alt={item.name} className="w-20 h-20 rounded" />
                <div className="ml-4 flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-600">Price: {Math.floor(item.price)}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className={'px-3 py-2 rounded bg-orange-500 text-white hover:bg-orange-600'}
                    onClick={() => removeStock(item.id)}
                  >
                    -
                  </button>
                  <div>{item.quantity}</div>
                  <button
                    className={`px-3 py-2 rounded ${item.quantity < item.stockQuantity ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
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
        )}

        <div className="flex flex-col items-end mt-4 w-full">
          <div className="text-gray-800 w-full">
            <div className='flex justify-between text-lg font-semibold'>
              <span>Total Items:</span>
              <span>{getTotalItems()}</span>
            </div>
            <div className='flex justify-between text-lg font-semibold'>
              <span>Total Price:</span>
              <span>{getTotalPrice().toFixed(0)}</span>
            </div>
          </div>
          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 mt-4"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
