'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useCartContext } from '@/context/CartContext';
import { useSession } from 'next-auth/react';

export default function ProductPage({ productId }) {
  const { addProduct, removeStock, addStock, isProductInCart, getProductQuantity } = useCartContext();
  const { data: session } = useSession();

  const [product, setProduct] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [editingReviewIndex, setEditingReviewIndex] = useState(null);

  async function fetchReviews() {
    try {
      const response = await fetch(`/api/review?product_id=${productId}`);
      const data = await response.json(); // Wait for the JSON to be parsed
      if (!response.ok) {
        throw new Error(response.error);
      }
      setReviews(data.reviews);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/product/${productId}`);
        const data = await response.json(); // Wait for the JSON to be parsed
        if (!response.ok) {
          throw new Error(response.error);
        }
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchProduct();
  }, [productId]);

  useEffect(()=>{
    fetchReviews();
  }, [productId])

  const renderStars = (rating, color = 'yellow') => {
    return Array.from({ length: 5 }, (_, i) => (
      i < rating ? (
        <FaStar key={i} className={`text-${color}-500 cursor-pointer`} onClick={() => setNewReview({ ...newReview, rating: i + 1 })} />
      ) : (
        <FaRegStar key={i} className={`text-${color}-300 cursor-pointer`} onClick={() => setNewReview({ ...newReview, rating: i + 1 })} />
      )
    ));
  };

  // Handle review submission (add/update)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editingReviewIndex !== null) {
        // Update the existing review
        const reviewToUpdate = reviews[editingReviewIndex];
        response = await fetch("/api/review", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            review_id: reviewToUpdate.id,
            rating: newReview.rating,
            comment: newReview.comment,
          }),
        });
      } else {
        // Add a new review
        response = await fetch("/api/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: product.id, // Ensure you are passing the product_id
            rating: newReview.rating,
            comment: newReview.comment,
          }),
        });
      }

      const data = await response.json();
      if (response.ok) {
        fetchReviews();
        setNewReview({ rating: 5, comment: "" });
        setEditingReviewIndex(null); // Reset editing mode
      } else {
        setError(data.message || "Failed to submit review.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  // Handle editing review
  const handleEditReview = (index) => {
    const reviewToEdit = reviews[index];
    if (reviewToEdit.buyer_id === session.user.id) {
      setEditingReviewIndex(index);
      setNewReview({ rating: reviewToEdit.rating, comment: reviewToEdit.comment });
    }
  };

  // Handle review deletion
  const handleDeleteReview = async (index) => {
    const reviewToDelete = reviews[index];
    if (reviewToDelete.buyer_id === session.user.id) {
      try {
        // Send request to delete review in the backend (soft-delete)
        const response = await fetch("/api/review", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            review_id: reviewToDelete.id,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Failed to delete review.");
        }
        fetchReviews();
      } catch (err) {
        setError(err.message || "Something went wrong.");
      }
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='flex justify-center items-center gap-10 w-2/3 rounded-lg shadow-md my-10'>
        <div className='w-1/2 object-contain'>
          {product.images.length > 0 ? (
            <Image
              src={product.images[imageIndex]}
              alt={product.name}
              width={500}
              height={500}
              className="object-cover"
            />
          ) : (
            <div className="w-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <div className="w-1/2 col-md-6 p-4">
          <h1 className="text-2xl font-bold text-orange-600">{product.name}</h1>
          <p className="text-gray-700">{product.description}</p>
          <p className="text-orange-500 font-semibold text-2xl">Rs. {Math.floor(product.price)}</p>
          <div className="flex justify-between">
            <span className="text-gray-500">Stock: {product.stock_quantity > 0 ? product.stock_quantity : 'Out of stock'}</span>
            <span className="text-gray-500">Category: {product.category}</span>
          </div>
          <div className="flex mt-3">
            {renderStars(product.rating, 'orange')}
          </div>
          <div className="mt-2 text-gray-500">
            Seller: {product.seller_name}
          </div>

          <div className='flex gap-4 mt-2'>
            {product.images.length > 0 && product.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={product.name}
                width={100}
                height={100}
                className="rounded object-cover cursor-pointer"
                onClick={() => setImageIndex(index)}
              />
            ))}
          </div>

          {/* Add to Cart and Quantity */}
          <div className="mt-2 flex justify-end items-center">
            {!isProductInCart(product.id) ? (
              <button onClick={() => addProduct({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                stockQuantity: product.stock_quantity,
                image: product.images,
                description: product.description,
              })} className="bg-orange-500 p-2 rounded-md hover:bg-orange-600 text-white" disabled={product.stock_quantity === 0}>
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center">
                <button onClick={() => removeStock(product.id)} className="h-[40px] w-[40px] rounded-md bg-orange-500 text-white hover:bg-orange-600" disabled={product.stock_quantity === 0}>
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

      <div className='w-2/3'>

        {/* Reviews Section */}
        <div className="mt-5">
          <h2 className="text-2xl text-center font-bold">Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="border-b pb-3 mb-3">
                <div className="flex items-center">
                  <span className="text-gray-500 font-semibold mr-2">{review.buyer}</span>
                  {renderStars(review.rating, 'yellow')}
                  {review.buyer_id === session.user.id && (
                    <>
                      <button className="ml-2 text-blue-500" onClick={() => handleEditReview(index)}>Edit</button>
                      <button className="ml-2 text-red-500" onClick={() => handleDeleteReview(index)}>Delete</button>
                    </>
                  )}
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}

          {/* Add/Edit Review Form */}
          <form onSubmit={handleReviewSubmit} className="flex flex-col mt-4 mb-4">
            <h3 className="text-xl font-semibold text-black-600">{editingReviewIndex !== null ? 'Edit Your Review' : 'Add a Review'}</h3>
            <div className="flex items-center mb-3 mt-3">
              {renderStars(newReview.rating)}
            </div>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Write your review..."
              className="p-2 form-control mb-3 border-gray-300 rounded"
              rows="3"
            />
            <button type="submit" className="w-32 bg-orange-500 p-2 rounded-md hover:bg-orange-600 text-white">
              {editingReviewIndex !== null ? 'Update' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
