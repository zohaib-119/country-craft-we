'use client';

import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import Nav from '@/components/Nav';

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
    description: 'An elegant sofa for a cozy evening. An elegant sofa for a cozy evening. An elegant sofa for a cozy evening. An elegant sofa for a cozy evening. An elegant sofa for a cozy evening. An elegant sofa for a cozy evening.',
    price: 499.99,
    stock_quantity: 7,
    category: 'Furniture',
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLKFaTXe9DayrT5xI7Iv4mFhl2lrqSQfct9A&s'],
    rating: 4.9,
  },
];

const Products = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Extract unique categories
  const categories = ['All', ...new Set(mockProducts.map(product => product.category))];

  // Filter products based on search and category
  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = category === 'All' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Nav/>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center w-screen p-6 border-b bg-white">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full sm:w-1/2 p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="w-full sm:w-48 p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <div className="flex flex-wrap gap-6 p-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};

export default Products;
