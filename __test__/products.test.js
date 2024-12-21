import { GET } from '@/app/api/products/route';
import dbConnect from '@/lib/dbConnect';

jest.mock('@/lib/dbConnect'); // Mock the database connection 

describe('GET /api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it('should return a list of products with correct data', async () => {
    // Mock the `dbConnect` function
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

    const req = {
      url: 'http://localhost/api/products?limit=1',
    };

    const response = await GET(req);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.products).toHaveLength(1);
    expect(result.products[0]).toHaveProperty('name', 'Product 1');
    expect(result.products[0]).toHaveProperty('rating', 4.5); // Average of 4 and 5
    expect(result.products[0]).toHaveProperty('category', 'Category 1');
    expect(result.products[0]).toHaveProperty('images', [
      'https://example.com/image1.jpg',
    ]);
  });

  it('should handle database errors gracefully', async () => {
    // Mock the `dbConnect` function to simulate an error
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

    const req = {
      url: 'http://localhost/api/products?limit=1',
    };

    const response = await GET(req);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.error).toBe('Failed to fetch products');
  });

  it('should return all products if no limit is specified', async () => {
    // Mock the `dbConnect` function for no limit
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

    const req = {
      url: 'http://localhost/api/products',
    };

    const response = await GET(req);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.products).toHaveLength(2);
    expect(result.total).toBe(2);
  });
});
