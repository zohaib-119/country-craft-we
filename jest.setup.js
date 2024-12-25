// jest.setup.js

jest.mock('@/lib/dbConnect', () => ({
    __esModule: true,
    default: jest.fn(),
  }));

// Mock Sentry
jest.mock("@sentry/nextjs", () => ({
  captureException: jest.fn(),
}));

jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("next-auth", () => ({
  default: jest.fn(),
  getServerSession: jest.fn(),
}));
