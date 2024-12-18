'use client';

import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useCartContext } from '@/context/CartContext';

export default function Product() {
  const { productId } = useParams(); // Extract productId from the dynamic route
  const { addProduct, removeStock, addStock, isProductInCart, getProductQuantity } = useCartContext();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Mock product data
    const mockProductData = {
      id: '1',
      name: 'Sample Product',
      description: 'This is a description of the sample product.',
      price: 100.0,
      stock_quantity: 20,
      category: 'Sample Category',
      rating: 4.5,
      images: [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLKFaTXe9DayrT5xI7Iv4mFhl2lrqSQfct9A&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLKFaTXe9DayrT5xI7Iv4mFhl2lrqSQfct9A&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLKFaTXe9DayrT5xI7Iv4mFhl2lrqSQfct9A&s'
      ],
      reviews: [
        { rating: 5, comment: 'Great product!', buyer: { name: 'Alice' } },
        { rating: 4, comment: 'Good value for money.', buyer: { name: 'Bob' } },
      ],
      seller_name: 'Ali & Co'
    };

    setProduct(mockProductData);
    setReviews(mockProductData.reviews);
  }, [productId]);

  const renderStars = (rating, color='yellow') => {
    const faStarClasses = `text-${color}-500 cursor-pointer`
    const faRegStarClasses = `text-orange-300 cursor-pointer`
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className={faStarClasses} onClick={() => setNewReview({ ...newReview, rating: i })} />
        ) : (
          <FaRegStar key={i} className={faRegStarClasses} onClick={() => setNewReview({ ...newReview, rating: i })} />
        )
      );
    }
    return stars;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    // Mock adding a new review
    const newReviewData = { ...newReview, buyer: { name: 'Current User' } };
    setReviews([...reviews, newReviewData]);

    // Clear the review form
    setNewReview({ rating: 5, comment: '' });
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="container my-5">
      <div className="card shadow-sm border rounded bg-white">
        <div className="row g-0">
          {/* Product Images Carousel */}
          <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
            <div id="productCarousel" className="carousel slide w-full" data-bs-ride="carousel">
              <div className="carousel-inner w-full">
                {product.images.map((url, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <Image src={url} alt={`Product Image ${index + 1}`} width={400} height={400} className="d-block w-full rounded-t" />
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon bg-orange-500" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon bg-orange-500" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-6 p-4">
            <h1 className="text-2xl font-bold text-orange-600">{product.name}</h1>
            <p className="text-gray-700">{product.description}</p>
            <p className="text-orange-500 font-semibold text-2xl">Rs.{' '}{Math.floor(product.price)}</p>
            <div className="flex justify-between">
              <span className="text-gray-500">Stock: {product.stock_quantity > 0 ? product.stock_quantity : 'Out of stock'}</span>
              <span className="text-gray-500">Category: {product.category}</span>
            </div>
            <div className="flex mt-3">
              {renderStars(product.rating, 'orange')}
            </div>
            <div className="mt-3 text-gray-500">
              Seller: {product.seller_name}
            </div>

            {/* Add to Cart and Quantity */}
            <div className="mt-4 flex items-center">
              {!isProductInCart(product.id) ? (
                <button onClick={() => addProduct(product)} className="bg-orange-500 p-2 rounded-md hover:bg-orange-600 text-white" disabled={product.stock_quantity === 0}>
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center">
                  <button onClick={() => removeStock(product.id)} className="h-[40px] w-[40px] rounded-md bg-orange-500 text-white hover:bg-orange-600">
                    -
                  </button>
                  <span className="text-gray-500 me-2 mx-2">{getProductQuantity(product.id)}</span>
                  <button onClick={() => addStock(product.id)} className="h-[40px] w-[40px] rounded-md bg-orange-500 text-white hover:bg-orange-600" disabled={getProductQuantity(product.id) >= product.stock_quantity}>
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-5">
        <h2 className="text-2xl text-center font-bold">Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="border-b pb-3 mb-3">
              <div className="flex items-center">
              <span className="text-gray-500 font-semibold mr-2">{review.buyer.name}</span>{renderStars(review.rating,'yellow')}
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="mt-4">
          <h3 className="text-xl font-semibold text-black-600">Add a Review</h3>
          <div className="flex items-center mb-3">
            {renderStars(newReview.rating)}
          </div>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Write your review..."
            className="form-control mb-3 border-gray-300 rounded"
            rows="3"
          />
          <button type="submit" className="p-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
