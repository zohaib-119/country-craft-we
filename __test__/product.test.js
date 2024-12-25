import { GET } from '@/app/api/product/[productId]/route';
import dbConnect from '@/lib/dbConnect';

describe('GET /api/product/[productId]', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset all mocks before each test
  });

  jest.mock('@/lib/dbConnect');
  jest.mock('@sentry/nextjs');

  it('should return 400 if productId is not provided', async () => {
    const req = { url: 'http://localhost/api/product/' };
    const params = {};

    const res = await GET(req, { params });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Product ID not found');
  });

  it('should return 404 if product is not found', async () => {
    const req = { url: 'http://localhost/api/product/123' };
    const params = { productId: '123' };

    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            is: jest.fn(() => ({ single: jest.fn(() => ({ data: null, error: null })) })),
          })),
        })),
      })),
    });

    const res = await GET(req, { params });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Product not found');
  });

  it('should return 500 if there is a database error when fetching product', async () => {
    const req = { url: 'http://localhost/api/product/123' };
    const params = { productId: '123' };

    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            is: jest.fn(() => ({ single: jest.fn(() => ({ error: { message: 'Database error' } })) })),
          })),
        })),
      })),
    });

    const res = await GET(req, { params });

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Failed to fetch product');
  });

  it('should return 500 if there is a database error when fetching seller', async () => {
    const req = { url: 'http://localhost/api/product/123' };
    const params = { productId: '123' };

    dbConnect.mockResolvedValue({
      from: jest.fn((table) => {
        if (table === 'products') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                is: jest.fn(() => ({ single: jest.fn(() => ({
                  data: {
                    id: 123,
                    name: 'Sample Product',
                    description: 'Test description',
                    price: 100,
                    stock_quantity: 10,
                    categories: { name: 'Electronics' },
                    product_images: [{ url: 'image1.jpg' }],
                    reviews: [{ rating: 5 }, { rating: 4 }],
                    user_id: 999,
                  },
                  error: null,
                })) }))
              })),
            })),
          };
        } else if (table === 'users') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({ single: jest.fn(() => ({ error: { message: 'Database error' } })) })),
            })),
          };
        }
      }),
    });

    const res = await GET(req, { params });

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Failed to fetch seller information');
  });

  it('should return 200 with formatted product details if data is retrieved successfully', async () => {
    const req = { url: 'http://localhost/api/product/123' };
    const params = { productId: '123' };

    dbConnect.mockResolvedValue({
      from: jest.fn((table) => {
        if (table === 'products') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                is: jest.fn(() => ({ single: jest.fn(() => ({
                  data: {
                    id: 123,
                    name: 'Sample Product',
                    description: 'Test description',
                    price: 100,
                    stock_quantity: 10,
                    categories: { name: 'Electronics' },
                    product_images: [{ url: 'image1.jpg' }],
                    reviews: [{ rating: 5 }, { rating: 4 }],
                    user_id: 999,
                  },
                  error: null,
                })) })),
              })),
            })),
          };
        } else if (table === 'users') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({ single: jest.fn(() => ({
                data: { name: 'John Doe' },
                error: null,
              })) })),
            })),
          };
        }
      }),
    });

    const res = await GET(req, { params });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.product).toEqual({
      id: 123,
      name: 'Sample Product',
      description: 'Test description',
      price: 100,
      stock_quantity: 10,
      category: 'Electronics',
      images: ['image1.jpg'],
      rating: 4.5,
      seller_name: 'John Doe',
    });
    expect(body.message).toBe('Product fetched succesfully');
  });
});
