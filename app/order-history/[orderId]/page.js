'use client'

import React, { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import { useParams } from 'next/navigation';

const Order = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { orderId } = useParams();

    // Fetch order data from the API
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await fetch(`/api/order/${orderId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order data');
                }
                const data = await response.json();
                setOrder(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [orderId]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
                <h1 className="text-2xl font-bold text-orange-600 mb-2">Loading Order Details...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
                <h1 className="text-2xl font-bold text-orange-600 mb-2">Error: {error}</h1>
            </div>
        );
    }

    return (
        <div>
            <Nav />
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-orange-600 mb-2">Order Details</h1>
                </div>
                <div className="mb-6">
                    <div className="text-gray-800 font-medium">Order Information</div>
                    <div className="mt-4">
                        <div className="text-gray-600"><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</div>
                        <div className="text-gray-600"><strong>Delivery Date:</strong> {new Date(order.delivery_date).toLocaleString()}</div>
                        <div className="text-gray-600"><strong>Order Status:</strong> {order.order_status}</div>
                        <div className="text-gray-600"><strong>Payment Method:</strong> {order.payment_method}</div>
                        <div className="text-gray-600"><strong>Delivery Charges:</strong> Rs.{' '}{order.delivery_charges.toFixed(0)}</div>
                        <div className="text-gray-600"><strong>Total Amount:</strong> Rs.{' '}{order.total_amount.toFixed(0)}</div>
                    </div>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-orange-600 mb-4">Order Items</h2>
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 mb-4 p-4 bg-gray-100 rounded-lg">
                            <div className="flex-1">
                                <p className="font-medium text-lg">{item.name}</p>
                                <p className="text-gray-600">Price: Rs.{' '}{item.price.toFixed(2)}</p>
                                <p className="text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <div className="flex space-x-2">
                                {item.images.map((imageUrl, index) => (
                                    <img
                                        key={index}
                                        src={imageUrl}
                                        alt={`${item.name} - Image ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="bg-gray-100 text-gray-700 py-6 text-center mt-auto w-full">
                <p className="text-sm">&copy; 2024 CountryCraft. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Order;
