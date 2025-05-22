import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Checkbox from '../ChechBox';
import '@testing-library/jest-dom';

// ZOMBIES: Checkbox component test suite

describe('Checkbox - ZOMBIES', () => {
  // Z - Zero state: Renders unchecked by default
  test('Z - renders an unchecked checkbox', () => {
    const { container } = render(<Checkbox checked={false} onChange={() => {}} name="test" />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).not.toBeChecked();
  });

  // O - One state: Renders checked when true
  test('O - renders a checked checkbox when prop is true', () => {
    const { container } = render(<Checkbox checked={true} onChange={() => {}} name="test" />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toBeChecked();
  });

  // M - Multiple interaction: Calls onChange when toggled
  test('M - clicking checkbox triggers onChange handler', () => {
    const handleChange = jest.fn();
    const { container } = render(<Checkbox checked={false} onChange={handleChange} name="test" />);
    const input = container.querySelector('input[type="checkbox"]');
    fireEvent.click(input);
    expect(handleChange).toHaveBeenCalled();
  });

  // B - Boundary: passes the correct name attribute
  test('B - checkbox includes the provided name attribute', () => {
    const { container } = render(<Checkbox checked={false} onChange={() => {}} name="boundary-name" />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toHaveAttribute('name', 'boundary-name');
  });

  // I - Interface: renders all necessary elements
  test('I - renders input and styled checkmark', () => {
    const { container } = render(<Checkbox checked={false} onChange={() => {}} name="test" />);
    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
    expect(container.querySelector('.checkmark')).toBeInTheDocument();
  });

  // E - Edge Case: handles undefined onChange gracefully
  test('E - clicking without onChange does not throw error', () => {
    const { container } = render(<Checkbox checked={false} name="test" />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(() => fireEvent.click(input)).not.toThrow();
  });

  // S - Styling: check styled container and checkmark
  test('S - renders styled wrapper and container class', () => {
    const { container } = render(<Checkbox checked={false} onChange={() => {}} name="test" />);
    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(container.querySelector('.checkmark')).toBeInTheDocument();
  });
});
