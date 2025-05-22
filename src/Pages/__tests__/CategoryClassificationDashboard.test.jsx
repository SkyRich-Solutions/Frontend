jest.mock('../../Utils/CategoryClassificationsDataHandler', () => ({
  __esModule: true,
  default: () => ({
    getProcessedCategoryData: jest.fn().mockResolvedValue([
      { Material: 'MAT1', Description: 'Pipe', MaterialCategory: 'A', Plant: 'PL1' },
      { Material: 'MAT2', Description: 'Valve', MaterialCategory: 'B', Plant: 'PL2' },
    ])
  })
}));

jest.mock('../../Components/CategoryClassificationComponent', () => () => <div>MockChart</div>);
jest.mock('../../Components/ReUseable/Loader', () => () => <div data-testid="loader">Loading...</div>);

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoryClassificationDashboard from '../../Pages/CategoryClassificationDashboard';
import '@testing-library/jest-dom';

describe('CategoryClassificationDashboard - ZOMBIES', () => {
  test('Z - renders loader initially', async () => {
    render(<CategoryClassificationDashboard />);
    const loaders = screen.getAllByTestId('loader');
    expect(loaders.length).toBeGreaterThanOrEqual(6); // all loading states
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  test('O - renders chart components after data load', async () => {
    render(<CategoryClassificationDashboard />);
    await waitFor(() => {
      expect(screen.getAllByText('MockChart').length).toBeGreaterThan(1);
    });
  });

  test('M - handles search input and displays suggestions', async () => {
    render(<CategoryClassificationDashboard />);
    await waitFor(() => screen.getAllByText('MockChart'));

    const input = screen.getByPlaceholderText('Search Material...');
    fireEvent.change(input, { target: { value: 'pipe' } });
    await waitFor(() => {
      const suggestion = screen.getByText('pipe');
      expect(suggestion).toBeInTheDocument();
      fireEvent.click(suggestion);
      expect(input.value).toBe('pipe');
    });
  });

  test('B - renders gracefully with empty data', async () => {
    jest.doMock('../../Utils/CategoryClassificationsDataHandler', () => ({
      __esModule: true,
      default: () => ({
        getProcessedCategoryData: jest.fn().mockResolvedValue([])
      })
    }));
    const CategoryClassificationDashboard = (await import('../../Pages/CategoryClassificationDashboard')).default;
    render(<CategoryClassificationDashboard />);
    await waitFor(() => {
      expect(screen.getAllByText('MockChart').length).toBeGreaterThan(1);
    });
  });

  test('I - renders header and input field', () => {
    render(<CategoryClassificationDashboard />);
    expect(screen.getByText('Material Category Overview')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Material...')).toBeInTheDocument();
  });

  test('E - clears search input and suggestions disappear', async () => {
    render(<CategoryClassificationDashboard />);
    await waitFor(() => screen.getAllByText('MockChart'));

    const input = screen.getByPlaceholderText('Search Material...');
    fireEvent.change(input, { target: { value: 'valve' } });
    await waitFor(() => screen.getByText('valve'));

    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearBtn);
    expect(input.value).toBe('');
    await waitFor(() => {
      expect(screen.queryByText('valve')).not.toBeInTheDocument();
    });
  });

  test('S - component layout has expected Tailwind classes', () => {
    const { container } = render(<CategoryClassificationDashboard />);
    const rootDiv = container.firstChild;
    expect(rootDiv).toHaveClass('flex');
  });

});
