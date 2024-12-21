import { GET } from '@/app/api/products/route';
import dbConnect from '@/lib/dbConnect';

jest.mock('@/lib/dbConnect'); // Mock the database connection to isolate the API functionality

describe('GET /api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset all mocks to ensure no cross-test contamination
  });

  it('should return a list of products with correct data', async () => {
    // Mock the `dbConnect` function to simulate fetching a single product
    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            limit: jest.fn().mockResolvedValue({
              data: [
                {
                  id: 1,
                  name: 'Product 1',
                  description: 'Description of product 1',
                  price: 100,
                  stock_quantity: 10,
                  categories: { name: 'Category 1' },
                  product_images: [{ url: 'https://example.com/image1.jpg' }],
                  reviews: [{ rating: 4 }, { rating: 5 }],
                },
              ],
              error: null,
            }),
          })),
        })),
      })),
    });

    // Mock the request
    const req = {
      url: 'http://localhost/api/products?limit=1',
    };

    // Call the GET function and parse the response
    const response = await GET(req);
    const result = await response.json();

    // Assertions
    expect(response.status).toBe(200); // Ensure response is successful
    expect(result.products).toHaveLength(1); // Validate the product count
    expect(result.products[0]).toHaveProperty('name', 'Product 1'); // Check specific properties
    expect(result.products[0]).toHaveProperty('rating', 4.5); // Average of reviews
    expect(result.products[0]).toHaveProperty('category', 'Category 1'); // Category check
    expect(result.products[0]).toHaveProperty('images', [
      'https://example.com/image1.jpg',
    ]); // Image URL validation
  });

  it('should handle database errors gracefully', async () => {
    // Simulate a database error
    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            limit: jest.fn().mockResolvedValue({
              data: null,
              error: 'Database error',
            }),
          })),
        })),
      })),
    });

    // Mock the request
    const req = {
      url: 'http://localhost/api/products?limit=1',
    };

    // Call the GET function and parse the response
    const response = await GET(req);
    const result = await response.json();

    // Assertions
    expect(response.status).toBe(500); // Ensure error status is returned
    expect(result.error).toBe('Failed to fetch products'); // Error message validation
  });

  it('should return all products if no limit is specified', async () => {
    // Mock fetching multiple products
    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            limit: jest.fn().mockResolvedValue({
              data: [
                {
                  id: 1,
                  name: 'Product 1',
                  description: 'Description of product 1',
                  price: 100,
                  stock_quantity: 10,
                  categories: { name: 'Category 1' },
                  product_images: [{ url: 'https://example.com/image1.jpg' }],
                  reviews: [{ rating: 4 }, { rating: 5 }],
                },
                {
                  id: 2,
                  name: 'Product 2',
                  description: 'Description of product 2',
                  price: 200,
                  stock_quantity: 5,
                  categories: { name: 'Category 2' },
                  product_images: [{ url: 'https://example.com/image2.jpg' }],
                  reviews: [],
                },
              ],
              error: null,
            }),
          })),
        })),
      })),
    });

    // Mock the request
    const req = {
      url: 'http://localhost/api/products',
    };

    // Call the GET function and parse the response
    const response = await GET(req);
    const result = await response.json();

    // Assertions
    expect(response.status).toBe(200); // Ensure successful status
    expect(result.products).toHaveLength(2); // Validate product count
    expect(result.total).toBe(2); // Ensure total matches the returned count
  });

  it('should handle empty product lists gracefully', async () => {
    // Simulate an empty product list
    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            limit: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          })),
        })),
      })),
    });

    // Mock the request
    const req = {
      url: 'http://localhost/api/products',
    };

    // Call the GET function and parse the response
    const response = await GET(req);
    const result = await response.json();

    // Assertions
    expect(response.status).toBe(200); // Ensure successful status
    expect(result.products).toHaveLength(0); // Validate empty list
    expect(result.total).toBe(0); // Ensure total matches
  });
});
