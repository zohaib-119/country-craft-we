'use client'

import React from 'react'

import ProductPage from '@/components/ProductPage'
import Nav from '@/components/Nav'
import { useParams } from 'next/navigation'


const Product = () => {
  const { productId } = useParams(); // Extract productId from the dynamic route
  return (
    <div>
      <Nav />
      <ProductPage productId={productId} />
      <footer className="bg-gray-100 text-gray-700 py-6 text-center mt-auto w-full">
        <p className="text-sm">&copy; 2024 CountryCraft. All Rights Reserved.</p>
      </footer>
    </div>
  )
}

export default Product