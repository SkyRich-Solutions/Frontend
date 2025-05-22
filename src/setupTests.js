global.TextEncoder = require('util').TextEncoder;
require('@testing-library/jest-dom');
require('jest-canvas-mock');


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

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
global.IntersectionObserver = IntersectionObserver;
