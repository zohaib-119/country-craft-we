import { GET } from "@/app/api/products/[productId]/route";
import dbConnect from "@/lib/dbConnect";

jest.mock("@/lib/dbConnect"); // Mock database connection

describe("GET /api/products/:productId", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it("should return product details with correct data", async () => {
    // Mock database responses
    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            is: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: {
                  id: 1,
                  name: "Product 1",
                  description: "Product 1 description",
                  price: 100,
                  stock_quantity: 5,
                  categories: { name: "Category 1" },
                  product_images: [{ url: "https://example.com/image1.jpg" }],
                  user_id: 10,
                },
                error: null,
              }),
            })),
          })),
        })),
      })),
    });

    dbConnect.mockResolvedValueOnce({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { name: "Seller 1" },
              error: null,
            }),
          })),
        })),
      })),
    });

    // Mock request parameters
    const req = { url: "http://localhost/api/products/1" };
    const params = { productId: 1 };

    // Call the GET function and parse the response
    const response = await GET(req, { params });
    const result = await response.json();

    // Assertions
    expect(response.status).toBe(200); // Successful response
    expect(result.product).toMatchObject({
      id: 1,
      name: "Product 1",
      description: "Product 1 description",
      price: 100,
      stock_quantity: 5,
      category: "Category 1",
      images: ["https://example.com/image1.jpg"],
      seller_name: "Seller 1",
    });
  });

  it("should return 400 if productId is missing", async () => {
    // Mock request with missing productId
    const req = { url: "http://localhost/api/products" };
    const params = {};

    // Call the GET function
    const response = await GET(req, { params });
    const result = await response.json();

    // Assertions
    expect(response.status).toBe(400); // Missing productId
    expect(result.error).toBe("Product ID not found");
  });

  it("should return 404 if the product is not found", async () => {
    // Mock database response for no product
    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            is: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            })),
          })),
        })),
      })),
    });

    // Mock request parameters
    const req = { url: "http://localhost/api/products/999" };
    const params = { productId: 999 };

    // Call the GET function
    const response = await GET(req, { params });
    const result = await response.json();

    // Assertions
    expect(response.status).toBe(404); // Product not found
    expect(result.error).toBe("Product not found");
  });

  it("should return 500 on database error when fetching product", async () => {
    // Mock database error when fetching product
    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            is: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: "Database error",
              }),
            })),
          })),
        })),
      })),
    });

    // Mock request parameters
    const req = { url: "http://localhost/api/products/1" };
    const params = { productId: 1 };

    // Call the GET function
    const response = await GET(req, { params });
    const result = await response.json();

    // Assertions
    expect(response.status).toBe(500); // Database error
    expect(result.error).toBe("Failed to fetch product");
  });

  it("should return 500 on database error when fetching seller", async () => {
    // Mock successful product fetch
    dbConnect.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            is: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: {
                  id: 1,
                  name: "Product 1",
                  description: "Product 1 description",
                  price: 100,
                  stock_quantity: 5,
                  categories: { name: "Category 1" },
                  product_images: [{ url: "https://example.com/image1.jpg" }],
                  user_id: 10,
                },
                error: null,
              }),
            })),
          })),
        })),
      })),
    });

    // Mock database error when fetching seller
    dbConnect.mockResolvedValueOnce({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: "Database error",
            }),
          })),
        })),
      })),
    });

    // Mock request parameters
    const req = { url: "http://localhost/api/products/1" };
    const params = { productId: 1 };

    // Call the GET function
    const response = await GET(req, { params });
    const result = await response.json();

    // Assertions
    expect(response.status).toBe(500); // Database error
    expect(result.error).toBe("Failed to fetch seller information");
  });
});
