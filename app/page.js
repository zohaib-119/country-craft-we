'use client'

import Image from 'next/image';
import { FaShoppingCart } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';
import {signIn, signOut, useSession, getProviders} from 'next-auth/react'

export default function Home() {
  const {data: session, status} = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow-md bg-white border-b">
        <h1 className="text-2xl font-bold text-orange-500">CountryCraft</h1>
        <nav className="flex items-center space-x-4">
          <a href="#" className="text-gray-700 font-medium hover:text-orange-500">Home</a>
          <a href="#products" className="text-gray-700 font-medium hover:text-orange-500">Products</a>
          <a href="#about" className="text-gray-700 font-medium hover:text-orange-500">About</a>
          <a href="#contact" className="text-gray-700 font-medium hover:text-orange-500">Contact</a>
          {isLoggedIn ? (
              <div className='flex gap-3 md:gap-3'>
                  <button onClick={signOut}>
                      Sign Out
                  </button>
                      <Image src={session?.user.image}
                          width={37}
                          height={37}
                          alt="profile"
                          className='rounded-full object-contain'
                          onClick={signOut}
                      />
              </div>
          ) : (
            <>
              {
                providers && Object.values(providers).map((provider) => (
                  <button
                    type="button" key={provider.name} onClick={() => signIn(provider.id)} className='black_btn'
                  >
                    Sign In with {provider.name}
                    {/* Sign In */}
                  </button>
                ))
              }
            </>
          )}
          <FaShoppingCart className="text-gray-700 text-2xl cursor-pointer hover:text-orange-500" />
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-gray-800 bg-cover bg-center bg-no-repeat text-center py-20 px-6" style={{ backgroundImage: 'url(https://img.pikbest.com/backgrounds/20190330/food-overlooking-simple-orange-e-commerce-poster-background_1810820.jpg!bw700)', opacity: 1 }}>
        <div  >
          <h2 className="text-4xl font-bold mb-4 text-white z-10">Discover Unique Products</h2>
          <p className="text-lg mb-6 z-10">A curated marketplace for high-quality products from talented sellers across the country.</p>
          <button className="text-orange-500 bg-white px-6 py-3 rounded-full font-semibold cursor-pointer hover:text-orange-600 transition z-10">
            Shop Now
          </button>
        </div>

      </section>

      {/* Featured Products */}
      <section id="products" className="py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-10">Featured Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative w-full h-64">
                <Image
                  src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLKFaTXe9DayrT5xI7Iv4mFhl2lrqSQfct9A&s`}
                  alt={`Product ${item}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h4 className="text-xl font-semibold mb-2">Product {item}</h4>
                <p className="text-gray-600 mb-4">High-quality and affordable items crafted by skilled artisans and entrepreneurs.</p>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-full font-medium hover:bg-orange-600 transition">
                  Add to Cart
                </button>
              </div>
            </div>
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
