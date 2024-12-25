import { GET } from '@/app/api/review/route';
import dbConnect from '@/lib/dbConnect';
import * as Sentry from '@sentry/nextjs';

jest.mock('@/lib/dbConnect');
jest.mock('@/app/api/auth/[...nextauth]/route');
jest.mock('next-auth');
jest.mock('@sentry/nextjs');

describe('GET /api/review', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if product_id is missing', async () => {
    const req = {
      url: 'http://localhost/api/review',
    };

    const res = await GET(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toBe('Product ID is required');
  });

  it('should return 500 if there is a database error', async () => {
    const req = {
      url: 'http://localhost/api/review?product_id=123',
    };

    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            is: jest.fn(() => ({ error: { message: 'Database error' } })),
          })),
        })),
      })),
    });

    const res = await GET(req);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Database error');
    expect(Sentry.captureException).toHaveBeenCalled();
  });

  it('should return 200 with formatted reviews if data is retrieved successfully', async () => {
    const req = {
      url: 'http://localhost/api/review?product_id=123',
    };

    const mockReviews = [
      {
        id: 1,
        rating: 5,
        comment: 'Great product!',
        buyers: { name: 'John Doe', id: 101 },
      },
      {
        id: 2,
        rating: 4,
        comment: 'Good quality.',
        buyers: { name: 'Jane Smith', id: 102 },
      },
    ];

    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            is: jest.fn(() => ({ data: mockReviews, error: null })),
          })),
        })),
      })),
    });

    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reviews).toEqual([
      {
        id: 1,
        buyer: 'John Doe',
        buyer_id: 101,
        rating: 5,
        comment: 'Great product!',
      },
      {
        id: 2,
        buyer: 'Jane Smith',
        buyer_id: 102,
        rating: 4,
        comment: 'Good quality.',
      },
    ]);
  });
});
