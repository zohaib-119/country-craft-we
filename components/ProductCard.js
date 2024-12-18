'use client';

import React from 'react';
import Image from 'next/image';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useCartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const {
    addProduct,
    addStock,
    removeStock,
    isProductInCart,
    getProductQuantity,
  } = useCartContext();

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-gray-300" />
        )
      );
    }
    return stars;
  };

  const inCart = isProductInCart(product.id);

  // Truncate the price without decimals
  const truncatedPrice = Math.floor(product.price);

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-xl">
      <div className="relative w-full h-48">
        {product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded-t"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="px-6 py-4">
        <h3 className="font-bold text-xl text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <p className="text-orange-500 font-semibold text-2xl">Rs.{' '}{truncatedPrice}</p>
      </div>
      <div className="px-6 pb-4 flex justify-between items-center font-semibold">
        <span className="text-sm text-gray-500">
          Stock: {product.stock_quantity > 0 ? product.stock_quantity : 'Out of stock'}
        </span>
        <span className="text-sm text-gray-500">
          Category: {product.category}
        </span>
      </div>
      <div className="px-6 pb-4 flex items-center justify-between">
        <div className="flex items-center space-x-1">{renderStars(product.rating)}</div>
        {!inCart ? (
          <button
            onClick={() => addProduct(product)}
            className="bg-orange-500 text-white py-2 px-5 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            disabled={product.stock_quantity === 0}
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => removeStock(product.id)}
              className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              -
            </button>
            <span className="text-gray-900">{`${getProductQuantity(product.id)}`}</span>
            <button
              onClick={() => addStock(product.id)}
              className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
              disabled={getProductQuantity(product.id) >= product.stock_quantity}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
