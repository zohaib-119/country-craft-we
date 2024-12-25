// deprecated api - not used

import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/route"; // Ensure your authOptions is correctly defined
import * as Sentry from "@sentry/nextjs";


export async function GET(req) {
  try {
    // Retrieve user session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ message: "Unauthorized access" }),
        { status: 401 }
      );
    }

    // Extract buyer_id from session
    const buyerId = session.user.id; // Ensure your user object includes an 'id' field

    // Connect to the database
    const client = await dbConnect();

    // Fetch cart items with product details for the specific buyer_id
    const { data: cartItems, error } = await client
      .from("cart_items")
      .select(`
        id,
        quantity,
        products (
          id,
          name,
          price,
          description,
          stock_quantity,
          product_images (
            url
          )
        )
      `)
      .eq("buyer_id", buyerId); // Query for the logged-in buyer_id

    // Handle database query errors
    if (error) {
      return new Response(
        JSON.stringify({ message: "Failed to fetch cart items", error }),
        { status: 500 }
      );
    }

    // Format the data into the required structure
    const formattedItems = cartItems.map((item) => ({
      id: item.products.id,
      name: item.products.name,
      price: item.products.price,
      quantity: item.quantity,
      stockQuantity: item.products.stock_quantity,
      image: item.products.product_images.map((img) => img.url) || [],
      description: item.products.description,
    }));

    // Return the formatted response
    return new Response(
      JSON.stringify({
        message: "Cart items fetched successfully",
        items: formattedItems,
      }),
      { status: 200 }
    );
  } catch (error) {
    // Log the error to Sentry
    Sentry.captureException(error);
    // Handle unexpected errors
    return new Response(
      JSON.stringify({
        message: "An unexpected error occurred",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
