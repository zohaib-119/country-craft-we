// deprecated api - not used


import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Your auth configuration file
import dbConnect from "@/lib/dbConnect";
import * as Sentry from "@sentry/nextjs";

export async function POST(req) {
  // Retrieve the session
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return new Response(
      JSON.stringify({ message: "Unauthorized: No valid session" }),
      { status: 401 }
    );
  }

  // Extract buyer_id from session
  const buyer_id = session.user.id;

  // Extract request data
  const { action, product_id } = await req.json();

  // Validation: Ensure action is provided
  if (!action) {
    return new Response(JSON.stringify({ message: "Invalid request data" }), {
      status: 400,
    });
  }

  const client = await dbConnect();

  try {
    
    Sentry.setContext("Cart Action", {
      buyer_id,
      product_id,
      action,
    });

    switch (action) {
      // 1. Add Product to Cart
      case "addProduct": {


        if (!product_id) {
          return new Response(
            JSON.stringify({ message: "Product ID is required" }),
            { status: 400 }
          );
        }

        const { data: existingItem, error: fetchError } = await client
          .from("cart_items")
          .select("id, quantity")
          .eq("buyer_id", buyer_id)
          .eq("product_id", product_id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

        if (existingItem) {
          // Increment quantity
          const { error: updateError } = await client
            .from("cart_items")
            .update({ quantity: existingItem.quantity + 1 })
            .eq("id", existingItem.id);

          if (updateError) throw updateError;
        } else {
          // Add new product with quantity 1
          const { error: insertError } = await client.from("cart_items").insert([
            { buyer_id, product_id, quantity: 1 },
          ]);

          if (insertError) throw insertError;
        }

        return new Response(
          JSON.stringify({ message: "Product added to cart" }),
          { status: 200 }
        );
      }

      // 2. Increment Stock (item count in cart)
      case "addStock": {
        if (!product_id) {
          return new Response(
            JSON.stringify({ message: "Product ID is required" }),
            { status: 400 }
          );
        }

        const { data: item, error: fetchError } = await client
          .from("cart_items")
          .select("id, quantity")
          .eq("buyer_id", buyer_id)
          .eq("product_id", product_id)
          .single();

        if (fetchError) throw fetchError;

        const { error: incrementError } = await client
          .from("cart_items")
          .update({ quantity: item.quantity + 1 })
          .eq("id", item.id);

        if (incrementError) throw incrementError;

        return new Response(
          JSON.stringify({ message: "Stock incremented" }),
          { status: 200 }
        );
      }

      // 3. Decrement Stock (item count in cart)
      case "removeStock": {
        if (!product_id) {
          return new Response(
            JSON.stringify({ message: "Product ID is required" }),
            { status: 400 }
          );
        }

        const { data: item, error: fetchError } = await client
          .from("cart_items")
          .select("id, quantity")
          .eq("buyer_id", buyer_id)
          .eq("product_id", product_id)
          .single();

        if (fetchError) throw fetchError;

        if (item.quantity > 1) {
          const { error: decrementError } = await client
            .from("cart_items")
            .update({ quantity: item.quantity - 1 })
            .eq("id", item.id);

          if (decrementError) throw decrementError;
        } else {
          // Remove product if quantity is 0
          const { error: deleteError } = await client
            .from("cart_items")
            .delete()
            .eq("id", item.id);

          if (deleteError) throw deleteError;
        }

        return new Response(
          JSON.stringify({ message: "Stock decremented" }),
          { status: 200 }
        );
      }

      // 4. Remove Product Completely
      case "removeProduct": {
        if (!product_id) {
          return new Response(
            JSON.stringify({ message: "Product ID is required" }),
            { status: 400 }
          );
        }

        const { error: deleteError } = await client
          .from("cart_items")
          .delete()
          .eq("buyer_id", buyer_id)
          .eq("product_id", product_id);

        if (deleteError) throw deleteError;

        return new Response(
          JSON.stringify({ message: "Product removed" }),
          { status: 200 }
        );
      }

      // 5. Clear Cart (No product_id required)
      case "clearCart": {
        const { error: clearError } = await client
          .from("cart_items")
          .delete()
          .eq("buyer_id", buyer_id);

        if (clearError) throw clearError;

        return new Response(
          JSON.stringify({ message: "Cart cleared" }),
          { status: 200 }
        );
      }

      default:
        return new Response(
          JSON.stringify({ message: "Invalid action" }),
          { status: 400 }
        );
    }
  } catch (error) {
    // Log the error to Sentry
    Sentry.captureException(error);
    return new Response(
      JSON.stringify({ message: "Error processing request", error: error.message }),
      { status: 500 }
    );
  }
}
