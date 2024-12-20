'use client';

import React from 'react';
import { useCartContext } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';

const CartPage = () => {
  const {
    cart,
    getTotalItems,
    getTotalPrice,
    clearCart,
    removeProduct,
    removeStock,
    addStock,
  } = useCartContext();

  const router = useRouter();

  return (
    <div className='min-h-screen'>
      <Nav />
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 p-4 flex flex-col items-center">
          <div className="flex flex-col items-center justify-center bottom-56 mb-4">
            <h2 className="text-3xl font-extrabold text-orange-500">CountryCraft</h2>
            <p className="mt-3 text-xl text-orange-500">
              "Delivering Excellence Right to Your Doorstep."
            </p>
            <ul className="mt-5 space-y-2 text-orange-500 text-base list-disc pl-5">
              <li>Fast & Reliable Service</li>
              <li>Secure Payment Options</li>
              <li>Wide Range of Products</li>
            </ul>
            <div className="mt-8 text-orange-500 text-lg italic">
              Thank you for shopping with us!
            </div>
          </div>
        </div>
        <div className="md:w-1/2 min-h-[590px] bg-white border-l border-gray-300 p-4 flex flex-col justify-between items-center">
          <div className='w-full'>
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
                    <img src={item.image[0]} alt={item.name} className="w-20 h-20 rounded object-cover" />
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
                        disabled={item.quantity >= item.stock_quantity}
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
          </div>

          <div className="flex flex-col items-end w-full">
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
              onClick={() => router.replace('/checkout')}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-gray-100 text-gray-700 py-6 text-center mt-auto w-full">
        <p className="text-sm">&copy; 2024 CountryCraft. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default CartPage;
