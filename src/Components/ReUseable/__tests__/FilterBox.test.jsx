import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterBox from '../FilterBox';

describe('FilterBox component', () => {
  const defaultFilters = {
    showAll: true,
    showMaint: false,
    showPlanning: true,
  };

  const renderComponent = (filters = defaultFilters, onChange = jest.fn()) => {
    render(<FilterBox filters={filters} onChange={onChange} />);
    return { onChange };
  };

  it('renders all three filter checkboxes with correct labels', () => {
    renderComponent();

    expect(screen.getByLabelText(/Show All/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Show Maintenance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Show Planning/i)).toBeInTheDocument();
  });

  it('checkboxes reflect the correct checked states from props', () => {
    renderComponent();

    expect(screen.getByLabelText(/Show All/i)).toBeChecked();
    expect(screen.getByLabelText(/Show Maintenance/i)).not.toBeChecked();
    expect(screen.getByLabelText(/Show Planning/i)).toBeChecked();
  });

  it('calls onChange handler when checkboxes are clicked', () => {
    const { onChange } = renderComponent();

    fireEvent.click(screen.getByLabelText(/Show Maintenance/i));
    expect(onChange).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText(/Show All/i));
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('passes correct name prop to each checkbox', () => {
    renderComponent();

    expect(screen.getByLabelText(/Show All/i)).toHaveAttribute('name', 'showAll');
    expect(screen.getByLabelText(/Show Maintenance/i)).toHaveAttribute('name', 'showMaint');
    expect(screen.getByLabelText(/Show Planning/i)).toHaveAttribute('name', 'showPlanning');
  });
});
