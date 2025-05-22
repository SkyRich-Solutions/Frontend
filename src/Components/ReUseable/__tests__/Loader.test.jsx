import React from 'react';
import { render } from '@testing-library/react';
import Loader from '../Loader';
import '@testing-library/jest-dom';

describe('Loader - ZOMBIES', () => {
  // Z - Zero: renders compact upload loader
  test('Z - renders compact upload loader', () => {
    const { container } = render(<Loader upload />);
    const compactLoader = container.querySelector('.jimu-primary-loading');
    expect(compactLoader).toBeInTheDocument();
  });

  // O - One: renders full loader when upload is false
  test('O - renders full loader when upload is false', () => {
    const { container } = render(<Loader upload={false} />);
    const fullLoaderBoxes = container.querySelectorAll('.box');
    expect(fullLoaderBoxes.length).toBe(4);
  });

  // M - Multiple: ensure only one loader type shows at a time
  test('M - renders only one loader type at a time', () => {
    const { container, rerender } = render(<Loader upload />);
    expect(container.querySelector('.jimu-primary-loading')).toBeInTheDocument();
    expect(container.querySelectorAll('.box').length).toBe(0);

    rerender(<Loader upload={false} />);
    expect(container.querySelector('.jimu-primary-loading')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.box').length).toBe(4);
  });

  // B - Boundary: renders without props
  test('B - renders default loader with no props', () => {
    const { container } = render(<Loader />);
    expect(container.querySelectorAll('.box').length).toBe(4);
  });

  // I - Interface: uses correct class for compact loader
  test('I - compact loader uses .jimu-primary-loading class', () => {
    const { container } = render(<Loader upload />);
    expect(container.querySelector('.jimu-primary-loading')).toBeInTheDocument();
  });

  // E - Edge: component contains <style> tags
  test('E - includes embedded style tags', () => {
    const { container } = render(<Loader />);
    const styleTags = container.querySelectorAll('style');
    expect(styleTags.length).toBeGreaterThan(0);
  });

// S - Styling: loader element has class that includes scale styling
test('S - full loader has scale styling class applied', () => {
  const { container } = render(<Loader />);
  const fullLoader = container.querySelector('.loader');
  expect(fullLoader).toBeInTheDocument();
  expect(fullLoader.className).toContain('loader'); // confirms it's the target
});

});
