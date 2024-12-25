import { useRouter } from "next/navigation";

const OrderCard = ({ order }) => {
    const {
        id,
        order_status,
        payment_method,
        order_date,
        delivery_date,
        total_amount,
        total_items,
        name,
        phone,
        email,
        address_line,
        city,
        state,
        postal_code,
    } = order;

    const router = useRouter();

    return (
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col lg:flex-row justify-between items-start mb-4">
            {/* Left Side: Basic Order Details */}
            <div className="flex flex-col items-start lg:w-1/2">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Order</h3>
                <p className="text-lg text-gray-600 mb-1">Status: <span className={`font-medium ${order_status === "Delivered" ? "text-green-600" : order_status === "Pending" ? "text-yellow-500" : "text-red-500"}`}>{order_status}</span></p>
                <p className="text-lg text-gray-600 mb-1">Payment: {payment_method}</p>
                <p className="text-lg text-gray-600 mb-1">Order Date: {new Date(order_date).toLocaleDateString()}</p>
                {delivery_date ? (
                    <p className="text-lg text-gray-600 mb-1">Delivery Date: {new Date(delivery_date).toLocaleDateString()}</p>
                ) : (
                    <p className="text-lg text-orange-500 mb-1">Delivery Pending</p>
                )}
                <p className="text-lg text-gray-600 mb-1">Total Items: {total_items}</p>
                <p className="text-lg font-bold text-gray-800">Total Amount: {'Rs. '}{total_amount.toFixed(0)}</p>

                {/* View Details Button */}
                <button
                    className="mt-4 px-6 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-300 ease-in-out"
                    onClick={() => router.push(`/order-history/${order.id}`)}
                >
                    View Details
                </button>
            </div>

            {/* Right Side: Additional Order Details */}
            <div className="flex flex-col items-start lg:w-1/2 lg:ml-6 mt-4 lg:mt-0">
                <h3 className="text-2xl font-semibold text-orange-500 mb-2">Customer Details</h3>
                <p className="text-lg text-gray-600 mb-1">Name: {name}</p>
                <p className="text-lg text-gray-600 mb-1">Phone: {phone}</p>
                <p className="text-lg text-gray-600 mb-1">Email: {email}</p>
                <p className="text-lg text-gray-600 mb-1">Address: {address_line}</p>
                <p className="text-lg text-gray-600 mb-1">City: {city}</p>
                <p className="text-lg text-gray-600 mb-1">State: {state}</p>
                <p className="text-lg text-gray-600 mb-1">Postal Code: {postal_code}</p>
            </div>


        </div>
    );
};

export default OrderCard;
