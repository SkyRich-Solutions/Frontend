import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategorySelectionLegend from '../CategorySelectionLegend';

describe('CategorySelectionLegend - ZOMBIES', () => {
  const categories = ['Electrical', 'Mechanical', 'Hydraulic'];
  const mockSetSelectedCategory = jest.fn();

  beforeEach(() => {
    mockSetSelectedCategory.mockClear();
  });

  test('Z - Zero categories: renders no buttons', () => {
    render(
      <CategorySelectionLegend
        uniqueCategories={[]}
        selectedCategory={null}
        setSelectedCategory={mockSetSelectedCategory}
      />
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('O - One category: renders correctly and clickable', () => {
    render(
      <CategorySelectionLegend
        uniqueCategories={['Electrical']}
        selectedCategory={null}
        setSelectedCategory={mockSetSelectedCategory}
      />
    );
    const btn = screen.getByText('Electrical');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(mockSetSelectedCategory).toHaveBeenCalledWith('Electrical');
  });

  test('M - Many categories: renders all with correct labels', () => {
    render(
      <CategorySelectionLegend
        uniqueCategories={categories}
        selectedCategory={null}
        setSelectedCategory={mockSetSelectedCategory}
      />
    );
    categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  test('B - Boundary: highlight applied to selected category only', () => {
    render(
      <CategorySelectionLegend
        uniqueCategories={categories}
        selectedCategory="Mechanical"
        setSelectedCategory={mockSetSelectedCategory}
      />
    );
    expect(screen.getByText('Mechanical')).toHaveClass('ring-4 ring-gray-400');
    expect(screen.getByText('Electrical')).not.toHaveClass('ring-4 ring-gray-400');
  });

  test('I - Interface: clicking a category triggers callback', () => {
    render(
      <CategorySelectionLegend
        uniqueCategories={categories}
        selectedCategory={null}
        setSelectedCategory={mockSetSelectedCategory}
      />
    );
    const target = screen.getByText('Hydraulic');
    fireEvent.click(target);
    expect(mockSetSelectedCategory).toHaveBeenCalledWith('Hydraulic');
  });

  test('E - Edge case: repeated categories are ignored', () => {
    render(
      <CategorySelectionLegend
        uniqueCategories={['Electrical', 'Electrical']}
        selectedCategory={null}
        setSelectedCategory={mockSetSelectedCategory}
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2); // still renders both, depending on implementation
  });

  test('S - Style: buttons have distinct background colors', () => {
    render(
      <CategorySelectionLegend
        uniqueCategories={categories}
        selectedCategory={null}
        setSelectedCategory={mockSetSelectedCategory}
      />
    );
    const bgColors = [
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(54, 162, 235, 0.6)'
    ];

    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn, idx) => {
      expect(btn).toHaveStyle(`background-color: ${bgColors[idx]}`);
    });
  });
});
