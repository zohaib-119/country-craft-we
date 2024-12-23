import { GET } from "@/app/api/cart/route";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("@/lib/dbConnect");

describe("GET /api/cart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return cart items for an authenticated user", async () => {
    // Mock session
    getServerSession.mockResolvedValue({
      user: { id: "user123" },
    });

    // Mock database response
    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            limit: jest.fn().mockResolvedValue({
              data: [
                {
                  id: "cartItem1",
                  quantity: 2,
                  products: {
                    id: "product1",
                    name: "Product 1",
                    price: 50,
                    description: "Product description",
                    stock_quantity: 5,
                    product_images: [{ url: "https://example.com/image1.jpg" }],
                  },
                },
              ],
              error: null,
            }),
          })),
        })),
      })),
    });

    const req = { url: "http://localhost/api/cart" };

    // Call the GET function
    const response = await GET(req);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      id: "product1",
      name: "Product 1",
      price: 50,
      quantity: 2,
      stockQuantity: 5,
      image: ["https://example.com/image1.jpg"],
      description: "Product description",
    });
  });

  it("should return 401 for an unauthenticated user", async () => {
    // Mock session as null
    getServerSession.mockResolvedValue(null);

    const req = { url: "http://localhost/api/cart" };

    // Call the GET function
    const response = await GET(req);
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.message).toBe("Unauthorized access");
  });

  it("should handle database errors gracefully", async () => {
    // Mock session
    getServerSession.mockResolvedValue({
      user: { id: "user123" },
    });

    // Simulate database error
    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            limit: jest.fn().mockResolvedValue({
              data: null,
              error: "Database error",
            }),
          })),
        })),
      })),
    });

    const req = { url: "http://localhost/api/cart" };

    // Call the GET function
    const response = await GET(req);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.message).toBe("Failed to fetch cart items");
  });

  it("should handle empty cart items gracefully", async () => {
    // Mock session
    getServerSession.mockResolvedValue({
      user: { id: "user123" },
    });

    // Simulate empty cart
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

    const req = { url: "http://localhost/api/cart" };

    // Call the GET function
    const response = await GET(req);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.items).toHaveLength(0);
  });

  it("should handle unexpected errors gracefully", async () => {
    // Mock session
    getServerSession.mockResolvedValue({
      user: { id: "user123" },
    });

    // Simulate unexpected error
    dbConnect.mockRejectedValue(new Error("Unexpected error"));

    const req = { url: "http://localhost/api/cart" };

    // Call the GET function
    const response = await GET(req);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.message).toBe("An unexpected error occurred");
  });
});
