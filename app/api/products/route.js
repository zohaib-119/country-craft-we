// code review 1.0 passed

import dbConnect from '@/lib/dbConnect';
import * as Sentry from "@sentry/nextjs";


export async function GET(req) {
    try {
        const client = await dbConnect();

        // Extract limit from query parameters
        const url = new URL(req.url);
        const limit = parseInt(url.searchParams.get('limit'), 10);

        // Fetch products with optional limit
        // There is one issue that it take rating of every review even if review has been deleted, in future to correct this, a VIEW can be used.
        const { data: products, error: productError } = await client
            .from('products')
            .select(`
                id,
                name,
                description,
                price,
                stock_quantity,
                categories (name),
                product_images (url),
                reviews (rating)
            `)
            .eq('is_active', true)
            .is('deleted_at', null)
            .limit(!isNaN(limit) && limit > 0 ? limit : undefined); // Apply limit only if valid

        if (productError) {
            console.error('Product fetch error:', productError);
            return new Response(JSON.stringify({ error: 'Failed to fetch products' }), { status: 500 });
        }

        // Format the products
        const formattedProducts = products.map(product => {
            const { id, name, description, price, stock_quantity, categories, product_images, reviews } = product;

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
                category: categories?.name || 'Uncategorized',
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
        Sentry.captureException(error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
