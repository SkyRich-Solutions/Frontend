module.exports = {
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|lucide-react|@vis\\.gl/react-google-maps)/)',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',     // exclude test files
    '!**/node_modules/**',         // exclude node_modules
    '!src/reportWebVitals.js',     // exclude CRA boilerplate
    '!src/setupTests.js'           // exclude test setup
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'lcov']
};
