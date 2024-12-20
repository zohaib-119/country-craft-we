'use client';

import React from "react";
import { useSession, signOut } from "next-auth/react";
import OrderCard from "@/components/OrderCard";
import Nav from "@/components/Nav";

// Mock data for orders with direct customer details
const orders = [
    {
        id: "1",
        order_status: "Delivered",
        payment_method: "Credit Card",
        order_date: "2024-12-15T14:48:00.000Z",
        delivery_date: "2024-12-18T10:00:00.000Z",
        total_amount: 120.0,
        total_items: 2,
        name: "Alice Johnson",
        phone: "+1234567890",
        email: "alice.johnson@example.com",
        address_line: "123 Elm Street",
        city: "Los Angeles",
        province: "California",
        postal_code: "90001"
    },
    {
        id: "2",
        order_status: "Pending",
        payment_method: "PayPal",
        order_date: "2024-12-16T08:30:00.000Z",
        delivery_date: null,
        total_amount: 200.0,
        total_items: 1,
        name: "Bob Smith",
        phone: "+0987654321",
        email: "bob.smith@example.com",
        address_line: "456 Oak Avenue",
        city: "San Francisco",
        province: "California",
        postal_code: "94103"
    },
    {
        id: "3",
        order_status: "Shipped",
        payment_method: "Debit Card",
        order_date: "2024-12-14T18:20:00.000Z",
        delivery_date: null,
        total_amount: 150.0,
        total_items: 3,
        name: "Charlie Brown",
        phone: "+1122334455",
        email: "charlie.brown@example.com",
        address_line: "789 Pine Road",
        city: "New York",
        province: "New York",
        postal_code: "10001"
    }
];


const Profile = () => {
    const { data: session, status } = useSession();

    // Check if the user is loading or not authenticated
    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session) {
        return <p>You are not signed in. Please sign in to view your profile.</p>;
    }

    // Extract user data from session
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
                            onClick={() => signOut()}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Orders Section */}
                <h2 className="text-2xl text-center font-bold text-orange-500 mb-4">Order History</h2>
                <div>
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            </div>

            <footer className="bg-gray-100 text-gray-700 py-6 text-center mt-auto w-full">
                <p className="text-sm">&copy; 2024 CountryCraft. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Profile;
