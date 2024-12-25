import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req, { params }) {
    try {
        const client = await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const buyer_id = session.user.id;

        // Extract productId from the dynamic URL
        const { orderId } = await params;

        // Check if productId exists
        if (!orderId) {
            return new Response(JSON.stringify({ error: 'Order ID not found' }), { status: 400 });
        }

        // Fetch product details by productId
        const { data: order, error: orderError } = await client
            .from('orders')
            .select(`
                id,
                delivery_charges,
                total_amount,
                order_status,
                payment_method,
                created_at,
                delivered_at,
                order_items (
                    id,
                    price,
                    quantity,
                    products (
                        name,
                        product_images (url)
                    )
                )
            `)
            .eq('id', orderId)
            .eq('buyer_id', buyer_id)
            .is('deleted_at', null)
            .single(); // Fetch only one product

        if (orderError) {
            console.error('Product fetch error:', orderError);
            return new Response(JSON.stringify({ error: 'Failed to fetch product' }), { status: 500 });
        }

        if (!order) {
            return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
        }

        

        // Format product details
        const formattedOrder = {
            id: order.id,
            delivery_charges: order.delivery_charges,
            total_amount: order.total_amount,
            order_status: order.order_status,
            payment_method: order.payment_method,
            order_date: order.created_at,
            delivery_date: order.delivery_date,
            items: order.order_items.map(item => ({
                id: item.id,
                price: item.price,
                quantity: item.quantity,
                name: item.products.name,
                images: item.products.product_images.map(image => image.url),
            }))

        };

        return new Response(JSON.stringify({ order: formattedOrder, message: 'Order fetched succesfully' }), { status: 200 });

    } catch (error) {
        console.error('Error fetching order:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
