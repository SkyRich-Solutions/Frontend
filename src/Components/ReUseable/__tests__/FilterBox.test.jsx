import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterBox from '../FilterBox';
import '@testing-library/jest-dom';

// 🧪 Mock the Checkbox component for isolation
jest.mock('../ChechBox', () => {
  return ({ name, checked, onChange }) => (
    <input
      type="checkbox"
      data-testid="mock-checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
    />
  );
});

describe('FilterBox - ZOMBIES', () => {
  const defaultProps = {
    filters: { showPlanning: true },
    onChange: jest.fn(),
    title: 'Show Planning',
    filterKey: 'showPlanning',
    group: 'warehouse'
  };

  // Z - Zero state
  test('Z - renders without crashing', () => {
    render(<FilterBox {...defaultProps} />);
    expect(screen.getByLabelText(/Show Planning/i)).toBeInTheDocument();
  });

  // O - One state
  test('O - checkbox is checked when filter value is true', () => {
    render(<FilterBox {...defaultProps} />);
    const checkbox = screen.getByTestId('mock-checkbox');
    expect(checkbox).toBeChecked();
  });

  // M - Multiple state
  test('M - fires onChange with correct args on click', () => {
    const handleChange = jest.fn();
    render(<FilterBox {...defaultProps} onChange={handleChange} />);
    const checkbox = screen.getByTestId('mock-checkbox');
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(expect.any(Object), 'warehouse');
  });

  // B - Boundary state
  test('B - renders unchecked checkbox for missing filterKey', () => {
    const props = {
      ...defaultProps,
      filters: {}, // no filterKey present
    };
    render(<FilterBox {...props} />);
    const checkbox = screen.getByTestId('mock-checkbox');
    expect(checkbox).not.toBeChecked();
  });

  // I - Interface
  test('I - sets the correct checkbox name', () => {
    render(<FilterBox {...defaultProps} />);
    const checkbox = screen.getByTestId('mock-checkbox');
    expect(checkbox).toHaveAttribute('name', 'showPlanning');
  });

  // E - Edge case
  test('E - renders even if title is empty string', () => {
    const props = {
      ...defaultProps,
      title: ''
    };
    render(<FilterBox {...props} />);
    const checkbox = screen.getByTestId('mock-checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  // S - Styling
  test('S - applies correct Tailwind classes', () => {
    render(<FilterBox {...defaultProps} />);
    const label = screen.getByText(/Show Planning/i).closest('label');
    expect(label).toHaveClass('flex gap-2 items-center');
  });
});
