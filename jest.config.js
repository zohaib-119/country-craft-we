const nextJest = require('next/jest')
const path = require('path')

// Create a custom Jest configuration using nextJest
const createJestConfig = nextJest({
  dir: './', // Directory for Jest to look at
})

// Define a custom Jest configuration
const customJestConfig = {
  testEnvironment: 'node', // Use Node.js environment for testing
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Setup files for each test
  moduleNameMapper: {
    // Map module paths so Jest can locate them
    '@/(.*)': '<rootDir>/$1',
    '@/lib/(.*)': '<rootDir>/lib/$1', // Update this as per your directory structure
  },
}

module.exports = createJestConfig(customJestConfig)
