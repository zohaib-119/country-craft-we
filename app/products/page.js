'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import Nav from '@/components/Nav';
import * as Sentry from '@sentry/react';

const Products = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  //const fetchProductsTransaction = Sentry.startTransaction({ name: "fetchProducts" });


  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products');
      const data = await response.json(); // Wait for the JSON to be parsed

      setProducts(data.products); // Ensure you're accessing the products array correctly
      //fetchProductsTransaction.finish();
    }

    fetchProducts();
  }, []);

  useEffect(()=>{
    // Extract unique categories
    const cs = ['All', ...new Set(products.map(product => product.category))];

    setCategories(cs);
  }, [products])

  useEffect(()=>{
    // Filter products based on search and category
    const fps = products.filter(product => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    }); 

    setFilteredProducts(fps);
    
  }, [products, category, search])

  return (
    <div className='min-h-screen flex flex-col items-center'>
      <Nav />

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row w-full gap-3 justify-between items-center p-6 border-b bg-white">
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
          className="w-full sm:w-60 p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <div className="flex flex-wrap gap-6 py-6 pl-6 w-full">
        {filteredProducts && filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <footer className="bg-gray-100 text-gray-700 py-6 text-center mt-auto w-full">
        <p className="text-sm">&copy; 2024 CountryCraft. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Products;
