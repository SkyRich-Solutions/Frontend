module.exports = {
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|lucide-react|@vis\\.gl/react-google-maps)/)',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  globals: {
    'babel-jest': {
      useESM: true
    }
  }
};