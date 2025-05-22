import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DiscrepancyCounter from '../DiscrepancyCounter';

// Mock the CountUp component to simplify the test
jest.mock('../ReUseable/Counter', () => ({ to, className }) => (
  <div data-testid="countup" className={className}>
    {to}
  </div>
));

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('DiscrepancyCounter - ZOMBIES', () => {
  test('Z - Zero state: displays loading with no data', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ mistakes: 0 }),
    });

    render(<DiscrepancyCounter />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    expect(screen.getByTestId('countup')).toHaveTextContent('0');
  });

  test('O - One item: renders mistake count of 1', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ mistakes: 1 }),
    });

    render(<DiscrepancyCounter />);
    const countupElement = await screen.findByTestId('countup');
    expect(countupElement).toHaveTextContent('1');
  });

  test('M - Many items: renders large mistake count', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ mistakes: 42 }),
    });

    render(<DiscrepancyCounter />);
    const countupElement = await screen.findByTestId('countup');
    expect(countupElement).toHaveTextContent('42');
  });

  test('B - Boundary: handles negative mistake count gracefully', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ mistakes: -5 }),
    });

    render(<DiscrepancyCounter />);
    const countupElement = await screen.findByTestId('countup');
    expect(countupElement).toHaveTextContent('-5');
  });

  test('I - Interface: element renders with proper className', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ mistakes: 7 }),
    });

    render(<DiscrepancyCounter />);
    const countupElement = await screen.findByTestId('countup');
    expect(countupElement).toHaveClass('text-red-500'); // or whatever class you use
  });

  test('E - Error: handles fetch failure gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Fetch failed'));

    render(<DiscrepancyCounter />);

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    const countupElement = await screen.findByTestId('countup');
    expect(countupElement).toHaveTextContent('0');
  });

  test('S - State: updates correctly on state change', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ mistakes: 10 }),
    });

    render(<DiscrepancyCounter />);
    const countupElement = await screen.findByTestId('countup');
    expect(countupElement).toHaveTextContent('10');
  });
});
