import { dbConnect } from '@/lib/dbConnect';

export async function GET(req) {
    try {
        const client = await dbConnect();

        // Extract productId from the dynamic URL
        const { query: { productId } } = req;

        // Fetch product details by productId
        const { data: product, error: productError } = await client
            .from('products')
            .select(`
                id,
                name,
                description,
                price,
                stock_quantity,
                category (name),
                product_images (url),
                reviews (rating, comment, buyer (name)),
                user_id
            `)
            .eq('id', productId)
            .eq('deleted_at', null)
            .single(); // Fetch only one product

        if (productError) {
            console.error('Product fetch error:', productError);
            return new Response(JSON.stringify({ error: 'Failed to fetch product' }), { status: 500 });
        }

        if (!product) {
            return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
        }

        // Fetch seller's name using the seller_id
        const { data: seller, error: sellerError } = await client
            .from('users')
            .select('name')
            .eq('id', product.seller_id)
            .single();

        if (sellerError) {
            console.error('Seller fetch error:', sellerError);
            return new Response(JSON.stringify({ error: 'Failed to fetch seller information' }), { status: 500 });
        }

        // Calculate average rating
        const averageRating = product.reviews?.length
            ? (product.reviews.reduce((sum, { rating }) => sum + rating, 0) / product.reviews.length).toFixed(2)
            : 5;

        // Format product details
        const formattedProduct = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock_quantity: product.stock_quantity,
            category: product.category?.name || 'Uncategorized',
            images: product.product_images.map(image => image.url),
            rating: parseFloat(averageRating),
            reviews: product.reviews.map(review => ({
                rating: review.rating,
                comment: review.comment,
                buyer: review.buyer.name,
            })),
            seller_name: seller?.name || 'Unknown' // Include seller's name in the response
        };

        return new Response(JSON.stringify({product: formattedProduct, message: 'Product fetched succesfully'}), { status: 200 });

    } catch (error) {
        console.error('Error fetching product:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
