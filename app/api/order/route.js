import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

/*

req.body
{
  "address": {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "addressLine": "456 Oak Avenue",
    "city": "Los Angeles",
    "state": "CA",
    "postalCode": "90001",
    "phoneNumber": "+19876543210"
  },
  "orderItems": [
    {
      "productId": "abc123",
      "quantity": 3
    },
    {
      "productId": "def456",
      "quantity": 1
    }
  ]
}
*/

export async function POST(req) {
  const client = await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const buyerId = session.user.id;

  try {
    const { address, orderItems } = await req.json();

    // Validate input
    if (
      !address ||
      !address.firstName ||
      !address.lastName ||
      !address.addressLine ||
      !address.city ||
      !address.state ||
      !address.postalCode ||
      !address.phoneNumber
    ) {
      return new Response(JSON.stringify({ error: 'Complete address details are required' }), { status: 400 });
    }

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return new Response(JSON.stringify({ error: 'Order items are required' }), { status: 400 });
    }

    // Calculate total amount and validate order items
    const deliveryCharges = 250;  // standard hardcoded delivery charges
    let totalAmount = deliveryCharges;
    const validatedOrderItems = [];

    for (const item of orderItems) {
      const { data: product, error } = await client
        .from('products')
        .select('id, price, stock_quantity, is_active')
        .eq('id', item.productId)
        .single();

      if (error || !product || !product.is_active || product.stock_quantity < item.quantity) {
        return new Response(JSON.stringify({ error: `Invalid product: ${item.productId}` }), { status: 400 });
      }

      validatedOrderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    // Insert the address into the database
    const { data: addressData, error: addressError } = await client
      .from('addresses')
      .insert({
        buyer_id: buyerId,
        first_name: address.firstName,
        last_name: address.lastName,
        email: address.email || null, // Optional email field
        address_line: address.addressLine,
        city: address.city,
        state: address.state,
        postal_code: address.postalCode,
        phone_number: address.phoneNumber,
      })
      .select('id')
      .single();

    if (addressError) {
      return new Response(JSON.stringify({ error: 'Failed to save address' }), { status: 500 });
    }

    const addressId = addressData.id;

    // Create the order
    const { data: order, error: orderError } = await client
      .from('orders')
      .insert({
        buyer_id: buyerId,
        address_id: addressId,
        delivery_charges: deliveryCharges,
        total_amount: totalAmount,
        order_status: 'pending',
        payment_method: 'cash_on_delivery',
      })
      .select('id')
      .single();

    if (orderError) {
      return new Response(JSON.stringify({ error: 'Failed to create order' }), { status: 500 });
    }

    // Add order items
    const orderItemsData = validatedOrderItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: orderItemsError } = await client.from('order_items').insert(orderItemsData);

    if (orderItemsError) {
      return new Response(JSON.stringify({ error: 'Failed to add order items' }), { status: 500 });
    }

    // Clear the cart for the buyer
    const { error: clearCartError } = await client
      .from('cart_items')
      .delete()
      .eq('buyer_id', buyerId);

    if (clearCartError) {
      return new Response(JSON.stringify({ error: 'Failed to clear cart' }), { status: 500 });
    }

    // Return success response
    return new Response(JSON.stringify({ message: 'Order placed successfully', orderId: order.id }), { status: 201 });
  } catch (error) {
    console.error('Error placing order:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    const client = await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const buyer_id = session.user.id;

    // Fetch product details by productId
    const { data: orders, error: orderError } = await client
      .from('orders')
      .select(`
              id,
              total_amount,
              order_status,
              payment_method,
              created_at,
              delivered_at,
              order_items (id),
              addresses (
                first_name, 
                last_name,
                email,
                phone_number,
                postal_code,
                address_line,
                city,
                state
              )
          `)
      .eq('buyer_id', buyer_id)
      .is('deleted_at', null)

    if (orderError) {
      console.error('Orders fetch error:', orderError);
      return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), { status: 500 });
    }

    // Format product details
    const formattedOrders = orders.map(order => ({
      id: order.id,
      total_amount: order.total_amount,
      order_status: order.order_status,
      payment_method: order.payment_method,
      order_date: order.created_at,
      delivery_date: order.delivery_date,
      total_items: order.order_items.length,
      name: order.addresses.first_name + ' ' + order.addresses.last_name,
      phone: order.addresses.phone_number,
      email: order.addresses.email,
      address_line: order.addresses.address_line,
      city: order.addresses.city,
      state: order.addresses.state,
      postal_code: order.addresses.postal_code,
    }));

    return new Response(JSON.stringify({ orders: formattedOrders, message: 'Orders fetched succesfully' }), { status: 200 });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
