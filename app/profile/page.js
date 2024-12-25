'use client';

import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import OrderCard from "@/components/OrderCard";
import Nav from "@/components/Nav";
import Loading from "@/components/Loading";

const Profile = () => {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn("google"); // Automatically sign in using Google if not authenticated
        }
    }, [status]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/order');
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders); // Assuming the response returns an array of orders
                } else {
                    console.error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, []); 

    if (status === "loading" || loadingOrders) {
        return <Loading/>;
    }

    if (!session) {
        return null; // Prevent rendering if the sign-in process is ongoing
    }

    const user = session.user;

    return (
        <div className="min-h-screen bg-white">
            <Nav />
            <div className="max-w-4xl mx-auto p-8">
                {/* Profile Section */}
                <div className="bg-orange-50 p-6 rounded-lg shadow-md flex items-center mb-8">
                    <img
                        src={user.image}
                        alt="Profile"
                        className="w-24 h-24 rounded-full mr-6"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                        <p className="text-gray-600">{user.email}</p>
                        <button
                            className="mt-4 px-6 py-2 bg-orange-500 text-white font-semibold rounded-full shadow-md hover:bg-orange-600"
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Orders Section */}
                <h2 className="text-2xl text-center font-bold text-orange-500 mb-4">Order History</h2>
                <div>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))
                    ) : (
                        <p>No orders found.</p>
                    )}
                </div>
            </div>

            <footer className="bg-gray-100 text-gray-700 py-6 text-center mt-auto w-full">
                <p className="text-sm">&copy; 2024 CountryCraft. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Profile;
