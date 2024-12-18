import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const product_id = searchParams.get("product_id");

  if (!product_id) {
    return new Response(
      JSON.stringify({ message: "Product ID is required" }),
      { status: 400 }
    );
  }

  const client = await dbConnect();

  try {
    const { data: reviews, error } = await client
      .from("reviews")
      .select(
        "id, rating, comment, created_at, buyers(name)"
      )
      .eq("product_id", product_id)
      .is("deleted_at", null);

    if (error) throw error;

    // Map data to match the desired output format
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      buyer_name: review.buyers.name,
      rating: review.rating,
      review: review.comment,
      created_at: review.created_at,
    }));

    return new Response(JSON.stringify({ reviews: formattedReviews }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  const buyer_id = session.user.id;
  const { product_id, rating, comment } = await req.json();

  if (!product_id || !rating) {
    return new Response(JSON.stringify({ message: "Product ID and rating are required" }), { status: 400 });
  }

  const client = await dbConnect();

  try {
    const { error } = await client.from("reviews").insert([
      { product_id, buyer_id, rating, comment: comment || "" },
    ]);

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Review created successfully" }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  const buyer_id = session.user.id;
  const { review_id, rating, comment } = await req.json();

  if (!review_id || !rating) {
    return new Response(JSON.stringify({ message: "Review ID and rating are required" }), { status: 400 });
  }

  const client = await dbConnect();

  try {
    const { error } = await client
      .from("reviews")
      .update({ rating, comment: comment || "", updated_at: new Date() })
      .eq("id", review_id)
      .eq("buyer_id", buyer_id)
      .is("deleted_at", null);

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Review updated successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  const buyer_id = session.user.id;
  const { review_id } = await req.json();

  if (!review_id) {
    return new Response(JSON.stringify({ message: "Review ID is required" }), { status: 400 });
  }

  const client = await dbConnect();

  try {
    const { error } = await client
      .from("reviews")
      .update({ deleted_at: new Date() })
      .eq("id", review_id)
      .eq("buyer_id", buyer_id)
      .is("deleted_at", null);

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Review soft-deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
