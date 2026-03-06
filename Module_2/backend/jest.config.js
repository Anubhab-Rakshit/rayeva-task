/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 15000,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    "node_modules/(?!wordnet-db|form-data|natural|afinn-165|uuid)"
  ]
};