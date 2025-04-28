import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterBox from '../FilterBox';

describe('FilterBox component', () => {
  const filters = {
    showAll: true,
    showMaint: false,
    showPlanning: true,
  };

  it('renders checkbox with correct name and checked state (Show All)', () => {
    render(
      <FilterBox
        filters={filters}
        onChange={jest.fn()}
        title="Show All"
        filterKey="showAll"
        group="filters"
      />
    );
    const checkbox = document.querySelector('input[name="showAll"]');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it('renders checkbox with correct name and unchecked state (Show Maintenance)', () => {
    render(
      <FilterBox
        filters={filters}
        onChange={jest.fn()}
        title="Show Maintenance"
        filterKey="showMaint"
        group="filters"
      />
    );
    const checkbox = document.querySelector('input[name="showMaint"]');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('calls onChange when checkbox is clicked', () => {
    const mockOnChange = jest.fn();
    render(
      <FilterBox
        filters={filters}
        onChange={mockOnChange}
        title="Show Planning"
        filterKey="showPlanning"
        group="filters"
      />
    );
    const checkbox = document.querySelector('input[name="showPlanning"]');
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});
