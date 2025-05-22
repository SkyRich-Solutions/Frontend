import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';
import '@testing-library/jest-dom';

describe('Pagination - ZOMBIES', () => {
  const defaultProps = {
    currentPage: 2,
    totalItems: 50,
    itemsPerPage: 10,
    onPageChange: jest.fn(),
  };

  // Z - Zero state
  test('Z - returns null if totalPages is 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalItems={0} itemsPerPage={10} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  // O - One state
  test('O - renders correctly on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
  });

  // M - Many state
  test('M - clicking next/prev calls onPageChange with correct values', () => {
    render(<Pagination {...defaultProps} />);
    fireEvent.click(screen.getByText('Next'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByText('Prev'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
  });

  // B - Boundary state: disable Prev on first page
  test('B - disables Prev on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    const prevButton = screen.getByText('Prev');
    expect(prevButton).toBeDisabled();
  });

  // B - Boundary state: disable Next on last page
  test('B - disables Next on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  // I - Interface
  test('I - renders navigation buttons and label', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  // E - Edge case
  test('E - clicking disabled Prev on first page does nothing', () => {
    const onPageChange = jest.fn();
    render(<Pagination {...defaultProps} currentPage={1} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('Prev'));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  // S - Styling
  test('S - applies correct Tailwind styles to buttons', () => {
    render(<Pagination {...defaultProps} />);
    const nextBtn = screen.getByText('Next');
    expect(nextBtn).toHaveClass('text-white px-4 py-2 rounded bg-gray-700');
  });
});
