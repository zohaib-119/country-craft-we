order.cancel.test.js



import { POST } from '@/app/api/order/cancel/route';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';

jest.mock('@/lib/dbConnect');
jest.mock('@/app/api/auth/[...nextauth]/route');
jest.mock('next-auth');

describe('POST /api/order/cancel', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset all mocks to ensure no cross-test contamination
    });

    it('should return 401 if user is not authenticated', async () => {
        getServerSession.mockResolvedValue(null); // Simulate no session

        const req = {
            json: jest.fn().mockResolvedValue({ orderId: 1 }),
        };

        const response = await POST(req);

        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ error: 'Unauthorized' });
    });

    it('should return 400 if order ID is not provided', async () => {
        getServerSession.mockResolvedValue({ user: { id: 1 } });

        const req = {
            json: jest.fn().mockResolvedValue({}),
        };

        const response = await POST(req);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: 'Order ID is required' });
    });

    it('should return 404 if the order is not found or belongs to another user', async () => {
        getServerSession.mockResolvedValue({ user: { id: 1 } });

        const req = {
            json: jest.fn().mockResolvedValue({ orderId: 1 }),
        };

        dbConnect.mockResolvedValue({
            data: null, // No order found
            error: 'Order not found',
        });

        dbConnect.mockResolvedValue({
            from: jest.fn(() => ({
                select: jest.fn(() => ({
                    eq: jest.fn(() => ({
                        eq: jest.fn(() => ({
                            single: jest.fn(() => ({
                                data: null, // No order found
                                error: 'Order not found',
                            })),
                        })),
                    })),
                })),
            })),
        });


        const response = await POST(req);

        expect(response.status).toBe(404);
        expect(await response.json()).toEqual({ error: 'Order not found' });
    });

    it('should return 400 if the order is not in "pending" status', async () => {
        getServerSession.mockResolvedValue({ user: { id: 1 } });

        const req = {
            json: jest.fn().mockResolvedValue({ orderId: 1 }),
        };

        dbConnect.mockResolvedValue({
            from: jest.fn(() => ({
                select: jest.fn(() => ({
                    eq: jest.fn(() => ({
                        eq: jest.fn(() => ({
                            single: jest.fn(() => ({
                                data: { id: 1, order_status: 'shipped' },
                                error: null,
                            })),
                        })),
                    })),
                })),
            })),
        });

        const response = await POST(req);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: 'Only pending orders can be canceled' });
    });

    // it('should successfully cancel a pending order and restock items', async () => {
    //     getServerSession.mockResolvedValue({ user: { id: 1 } });

    //     const req = {
    //         json: jest.fn().mockResolvedValue({ orderId: 1 }),
    //     };

    //     dbConnect.mockResolvedValueOnce({
    //         from: jest.fn(() => ({
    //             select: jest.fn(() => ({
    //                 eq: jest.fn(() => ({
    //                     eq: jest.fn(() => ({
    //                         single: jest.fn(() => ({
    //                             data: { id: 1, order_status: 'pending' },
    //                             error: null,
    //                         })),
    //                     })),
    //                 })),
    //             })),
    //         })),
    //     });

    //     dbConnect.mockResolvedValueOnce({
    //         from: jest.fn(() => ({
    //             update: jest.fn(() => ({
    //                 eq: jest.fn(() => ({
    //                     error: null
    //                 }))
    //             }))
    //         }))
    //     })

    //     dbConnect.mockResolvedValueOnce({
    //         from: jest.fn(() => ({
    //             select: jest.fn(() => ({
    //                 eq: jest.fn(() => ({
    //                     data: [{ product_id: 1, quantity: 2 }],
    //                     error: null,
    //                 }))
    //             }))
    //         }))
    //     })

    //     dbConnect.mockResolvedValueOnce({
    //         from: jest.fn(() => ({
    //             select: jest.fn(() => ({
    //                 eq: jest.fn(() => ({
    //                     single: jest.fn(() => ({
    //                         data: { stock_quantity: 5 },
    //                         error: null,
    //                     }))
    //                 }))
    //             }))
    //         }))
    //     })

    //     dbConnect.mockResolvedValueOnce({
    //         from: jest.fn(() => ({
    //             update: jest.fn(() => ({
    //                 eq: jest.fn(() => ({
    //                     error: null
    //                 }))
    //             }))
    //         }))
    //     })

    //     const response = await POST(req);

    //     expect(response.status).toBe(200);
    //     expect(await response.json()).toEqual({ message: 'Order cancelled successfully' })
    // });
});
