import { POST } from '@/app/api/cart/route';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));
jest.mock('@/lib/dbConnect');

describe('POST /api/cart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if the user is not authenticated', async () => {
    getServerSession.mockResolvedValue(null);

    const req = {
      json: async () => ({ action: 'addProduct', product_id: 'product1' }),
    };

    const response = await POST(req);
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.message).toBe('Unauthorized: No valid session');
  });

  it('should add a product to the cart', async () => {
    getServerSession.mockResolvedValue({ user: { id: 'user123' } });

    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
        insert: jest.fn(() => ({
          error: null,
        })),
      })),
    });

    const req = {
      json: async () => ({ action: 'addProduct', product_id: 'product1' }),
    };

    const response = await POST(req);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.message).toBe('Product added to cart');
  });

  it('should increment stock for an existing product', async () => {
    getServerSession.mockResolvedValue({ user: { id: 'user123' } });

    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: { id: 'cartItem1', quantity: 1 }, error: null }),
          })),
        })),
        update: jest.fn(() => ({
          error: null,
        })),
      })),
    });

    const req = {
      json: async () => ({ action: 'addStock', product_id: 'product1' }),
    };

    const response = await POST(req);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.message).toBe('Stock incremented');
  });

  it('should decrement stock or remove the product if quantity is 1', async () => {
    getServerSession.mockResolvedValue({ user: { id: 'user123' } });

    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: { id: 'cartItem1', quantity: 1 }, error: null }),
          })),
        })),
        delete: jest.fn(() => ({
          error: null,
        })),
      })),
    });

    const req = {
      json: async () => ({ action: 'removeStock', product_id: 'product1' }),
    };

    const response = await POST(req);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.message).toBe('Stock decremented');
  });

  it('should remove a product completely', async () => {
    getServerSession.mockResolvedValue({ user: { id: 'user123' } });

    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        delete: jest.fn(() => ({
          error: null,
        })),
      })),
    });

    const req = {
      json: async () => ({ action: 'removeProduct', product_id: 'product1' }),
    };

    const response = await POST(req);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.message).toBe('Product removed');
  });

  it('should clear the cart', async () => {
    getServerSession.mockResolvedValue({ user: { id: 'user123' } });

    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        delete: jest.fn(() => ({
          error: null,
        })),
      })),
    });

    const req = {
      json: async () => ({ action: 'clearCart' }),
    };

    const response = await POST(req);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.message).toBe('Cart cleared');
  });

  it('should return 400 for an invalid action', async () => {
    getServerSession.mockResolvedValue({ user: { id: 'user123' } });

    const req = {
      json: async () => ({ action: 'invalidAction' }),
    };

    const response = await POST(req);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.message).toBe('Invalid action');
  });

  it('should return 400 for missing product_id when required', async () => {
    getServerSession.mockResolvedValue({ user: { id: 'user123' } });

    const req = {
      json: async () => ({ action: 'addProduct' }),
    };

    const response = await POST(req);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.message).toBe('Product ID is required');
  });

  it('should handle unexpected errors gracefully', async () => {
    getServerSession.mockResolvedValue({ user: { id: 'user123' } });

    dbConnect.mockRejectedValue(new Error('Unexpected error'));

    const req = {
      json: async () => ({ action: 'addProduct', product_id: 'product1' }),
    };

    const response = await POST(req);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.message).toBe('Error processing request');
  });
});
