import dbConnect from '@/lib/dbConnect'; 
import { getServerSession } from 'next-auth'; 
import { authOptions } from '../../auth/[...nextauth]/route'; 

export async function POST(req) {
  const client = await dbConnect();
  const session = await getServerSession(authOptions);

  // Validate user session
  if (!session || !session.user || !session.user.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const buyerId = session.user.id;

  try {
    const { orderId } = await req.json();

    // Validate input
    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Order ID is required' }), { status: 400 });
    }

    // Fetch the order and ensure it belongs to the current user
    const { data: order, error: fetchError } = await client
      .from('orders')
      .select('id, order_status')
      .eq('id', orderId)
      .eq('buyer_id', buyerId)
      .single();

    if (fetchError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
    }

    // Check if the order can be canceled
    if (order.order_status !== 'pending') {
      return new Response(
        JSON.stringify({ error: 'Only pending orders can be canceled' }),
        { status: 400 }
      );
    }

    // Update the order status to 'cancelled'
    const { error: updateError } = await client
      .from('orders')
      .update({ order_status: 'cancelled' })
      .eq('id', orderId);

    if (updateError) {
      throw new Error('Failed to cancel the order');
    }

    // Fetch the order items
    const { data: orderItems, error: fetchItemsError } = await client
      .from('order_items')
      .select('product_id, quantity')
      .eq('order_id', orderId);

    if (fetchItemsError) {
      throw new Error('Failed to fetch order items');
    }

    // Restock each product
    for (const item of orderItems) {
      const { data: product, error: productError } = await client
        .from('products')
        .select('stock_quantity')
        .eq('id', item.product_id)
        .single();

      if (productError || !product) {
        throw new Error('Failed to fetch product details');
      }

      const newStockQuantity = product.stock_quantity + item.quantity;

      const { error: restockError } = await client
        .from('products')
        .update({ stock_quantity: newStockQuantity })
        .eq('id', item.product_id);

      if (restockError) {
        throw new Error('Failed to restock items');
      }
    }

    return new Response(
      JSON.stringify({ message: 'Order cancelled successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error canceling order:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
