'use client'

import Image from 'next/image';
import Nav from '@/components/Nav';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';


export default function Home() {
  const [products, setProducts] = useState([]);

useEffect(() => {
  async function fetchProducts() {
    const response = await fetch('/api/products?limit=4');
    const data = await response.json(); // Wait for the JSON to be parsed

    setProducts(data.products); // Ensure you're accessing the products array correctly
  }

  fetchProducts();
}, []);


  return (
    <div className="bg-white text-gray-800">
      <Nav />

      {/* Hero Section */}
      <section className="text-gray-800 bg-cover bg-center bg-no-repeat text-center py-20 px-6" style={{ backgroundImage: 'url(https://img.pikbest.com/backgrounds/20190330/food-overlooking-simple-orange-e-commerce-poster-background_1810820.jpg!bw700)', opacity: 1 }}>
        <div  >
          <h2 className="text-4xl font-bold mb-4 text-white z-10">Discover Unique Products</h2>
          <p className="text-lg mb-6 z-10">A curated marketplace for high-quality products from talented sellers across the country.</p>
          <button className="text-orange-500 bg-white px-6 py-3 rounded-full font-semibold cursor-pointer hover:text-orange-600 transition z-10">
            <Link href='/products'>
            Shop Now
            </Link>
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-10">Featured Products</h3>
        <div className="flex flex-wrap justify-center gap-6">
          {products && products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-50 py-16 px-6 text-center">
        <h3 className="text-3xl font-bold mb-4 text-orange-500">About CountryCraft</h3>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          CountryCraft connects buyers to a wide range of unique products made by skilled entrepreneurs. We aim to bring exceptional quality and creativity directly to your doorstep.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 py-6 text-center">
        <p className="text-sm">&copy; 2024 CountryCraft. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
