'use client'

import React, { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

const Order = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [canceling, setCanceling] = useState(false); // State to track the canceling process
    const [cancelError, setCancelError] = useState(null); // State to track cancel errors

    const { orderId } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (error)
            router.replace('/profile')
    }, [error]);

    // Fetch order data from the API
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await fetch(`/api/order/${orderId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order data');
                }
                const data = await response.json();
                setOrder(data.order);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [orderId]);

    const handleCancelOrder = async () => {
        setCanceling(true);
        setCancelError(null);

        try {
            const response = await fetch('/api/order/cancel', { // Replace with your cancel order API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId }),
            });

            if (!response.ok) {
                throw new Error('Failed to cancel the order');
            }

            const data = await response.json();

            if (data.error) {
                setCancelError(data.error);
            } else {
                alert('Order canceled successfully');
                router.push('/profile'); // Redirect to profile or relevant page
            }
        } catch (err) {
            setCancelError(err.message);
        } finally {
            setCanceling(false);
        }
    };

    if (loading || error) {
        return <Loading />;
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
                        <div className="text-gray-600"><strong>Delivery Date:</strong> {order.delivery_date ? new Date(order.delivery_date).toLocaleString() : 'Not Delivered yet'}</div>
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

                {/* Cancel Order Button */}
                {order.order_status === 'pending' && (
                    <div className="flex justify-end">
                        <button
                            onClick={handleCancelOrder}
                            className={`px-6 py-2 mt-4 text-white rounded-lg ${canceling ? 'bg-gray-500' : 'bg-red-600'}`}
                            disabled={canceling}
                        >
                            {canceling ? 'Canceling...' : 'Cancel Order'}
                        </button>
                    </div>
                )}
                {cancelError && (
                    <div className="mt-4 text-red-600">
                        <p>{cancelError}</p>
                    </div>
                )}
            </div>

            <footer className="bg-gray-100 text-gray-700 py-6 text-center mt-auto w-full">
                <p className="text-sm">&copy; 2024 CountryCraft. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Order;
