import { dbConnect } from '@/lib/dbConnect';

export async function GET(req) {
    try {
        const client = await dbConnect();

        // Extract limit from query parameters
        const url = new URL(req.url);
        const limit = parseInt(url.searchParams.get('limit'), 10);

        // Fetch products with optional limit
        const { data: products, error: productError } = await client
            .from('products')
            .select(`
                id,
                name,
                description,
                price,
                stock_quantity,
                category (name),
                product_images (url),
                reviews (rating)
            `)
            .eq('is_active', true)
            .limit(!isNaN(limit) && limit > 0 ? limit : undefined); // Apply limit only if valid

        if (productError) {
            console.error('Product fetch error:', productError);
            return new Response(JSON.stringify({ error: 'Failed to fetch products' }), { status: 500 });
        }

        // Format the products
        const formattedProducts = products.map(product => {
            const { id, name, description, price, stock_quantity, category, product_images, reviews } = product;

            // Calculate average rating
            const averageRating = reviews?.length
                ? (reviews.reduce((sum, { rating }) => sum + rating, 0) / reviews.length).toFixed(2)
                : 5;

            return {
                id,
                name,
                description,
                price,
                stock_quantity,
                category: category?.name || 'Uncategorized',
                images: product_images?.map(image => image.url) || [],
                rating: parseFloat(averageRating),
            };
        });

        return new Response(JSON.stringify({ 
            products: formattedProducts, 
            total: formattedProducts.length 
        }), { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
