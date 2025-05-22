import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header component - ZOMBIES', () => {
  test('Z - Zero: renders fallback when title is empty', () => {
    render(<Header title="" />);
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('');
  });

  test('O - One: renders header with a single word title', () => {
    render(<Header title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('M - Many: renders header with a multi-word title', () => {
    render(<Header title="Turbine Overview Panel" />);
    expect(screen.getByText('Turbine Overview Panel')).toBeInTheDocument();
  });

  test('B - Boundary: very long title does not crash', () => {
    const longTitle = 'Very'.repeat(100);
    render(<Header title={longTitle} />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  test('I - Interface: header supports user-defined title (simulated prop update)', () => {
    const { rerender } = render(<Header title="Old Title" />);
    expect(screen.getByText('Old Title')).toBeInTheDocument();
    rerender(<Header title="New Title" />);
    expect(screen.getByText('New Title')).toBeInTheDocument();
  });

  test('E - Exception: handles missing title prop without crashing', () => {
    // @ts-ignore
    render(<Header />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  test('S - Style: renders with correct classNames', () => {
    const { container } = render(<Header title="Styled Title" />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-gray-800');
    expect(container.querySelector('h1')).toHaveClass('text-2xl');
  });
});
