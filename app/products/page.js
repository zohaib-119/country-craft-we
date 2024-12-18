import React from 'react';
import ProductCard from '@/components/ProductCard';

const mockProducts = [
  {
    id: 1,
    name: 'Modern Chair',
    description: 'A comfortable modern chair for your living room.',
    price: 120.99,
    stock_quantity: 15,
    category: 'Furniture',
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLKFaTXe9DayrT5xI7Iv4mFhl2lrqSQfct9A&s'],
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Classic Lamp',
    description: 'Brighten up your space with this classic lamp.',
    price: 45.99,
    stock_quantity: 0,
    category: 'Lighting',
    images: [],
    rating: 3.8,
  },
  {
    id: 3,
    name: 'Elegant Sofa',
    description: 'An elegant sofa for a cozy evening.',
    price: 499.99,
    stock_quantity: 7,
    category: 'Furniture',
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLKFaTXe9DayrT5xI7Iv4mFhl2lrqSQfct9A&s'],
    rating: 4.9,
  },
];

const Products = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {mockProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Products;
