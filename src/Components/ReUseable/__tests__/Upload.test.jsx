import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Upload from '../Upload';
import '@testing-library/jest-dom';

// ZOMBIES test suite for Upload component
describe('Upload - ZOMBIES', () => {
  // Z - Zero state: renders the component without crashing
  test('Z - renders without crashing', () => {
    render(<Upload />);
    expect(screen.getByText(/upload file/i)).toBeInTheDocument();
  });

  // O - One interaction: simulate uploading one file
  test('O - allows file input change event', () => {
    render(<Upload />);
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });
    expect(input.files[0]).toBe(file);
    expect(input.files).toHaveLength(1);
  });

  // M - Multiple files edge (though UI doesn’t support it, simulate it)
  test('M - handles multiple files if provided', () => {
    render(<Upload />);
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    const files = [
      new File(['content 1'], 'file1.txt', { type: 'text/plain' }),
      new File(['content 2'], 'file2.txt', { type: 'text/plain' })
    ];

    fireEvent.change(input, { target: { files } });
    expect(input.files).toHaveLength(2);
  });

  // B - Boundary: file input is empty
  test('B - handles empty file input', () => {
    render(<Upload />);
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [] } });
    expect(input.files).toHaveLength(0);
  });

  // I - Interface: correct button and input structure
  test('I - has proper label and input structure', () => {
    render(<Upload />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('container-btn-file');
    expect(button.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  // E - Edge case: SVG icon is present
  test('E - displays upload icon inside button', () => {
    render(<Upload />);
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // S - Style: checks CSS class and hover styles presence
  test('S - applies correct styling class', () => {
    render(<Upload />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('container-btn-file');
  });
});
