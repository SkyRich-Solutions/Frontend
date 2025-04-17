module.exports = {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)/"  // To ensure axios is transformed properly by Babel
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  globals: {
    'babel-jest': {
      useESM: true
    }
  },
};
