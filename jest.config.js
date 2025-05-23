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
    '!src/**/*.test.{js,jsx}',     
    '!src/**/__tests__/**',         
    '!**/node_modules/**',
    '!src/reportWebVitals.js',
    '!src/setupTests.js',
  ],

  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],

  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'lcov']
};
