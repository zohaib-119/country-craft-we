// jest.setup.js

jest.mock('@/lib/dbConnect', () => ({
    __esModule: true,
    default: jest.fn(),
  }));
  