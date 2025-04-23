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

describe('DiscrepancyCounter', () => {
  it('displays loading state initially', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ mistakes: 5 }),
    });

    render(<DiscrepancyCounter />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the loading state to go away
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );
  });

  it('renders the mistake count from API after loading', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ mistakes: 42 }),
    });

    render(<DiscrepancyCounter />);

    const countupElement = await screen.findByTestId('countup');
    expect(countupElement).toHaveTextContent('42');
  });

  it('handles fetch failure gracefully and stops loading', async () => {
    fetch.mockRejectedValueOnce(new Error('Fetch failed'));

    render(<DiscrepancyCounter />);

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    // Should still render CountUp with 0
    const countupElement = await screen.findByTestId('countup');
    expect(countupElement).toHaveTextContent('0');
  });
});
