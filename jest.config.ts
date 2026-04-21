import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@sanity/image-url(.*)$': '<rootDir>/__mocks__/@sanity/image-url.js',
    '^.*/sanity/lib/urlFor$': '<rootDir>/__mocks__/sanity/lib/urlFor.js',
  },
}

export default createJestConfig(config)
