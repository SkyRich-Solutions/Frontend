global.TextEncoder = require('util').TextEncoder;
import '@testing-library/jest-dom';

// src/setupTests.js

class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }

  observe(target) {
    this.callback([{ isIntersecting: true, target }], this);
  }

  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserver;
