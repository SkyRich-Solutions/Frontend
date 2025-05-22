// src/Components/__tests__/TurbineComponentHealthScoresComponent.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TurbineComponentHealthScoresComponent from '../TurbineComponentHealthScores';
import * as DataHandler from '../../Utils/TurbineDashboardDataHandler';

// Recharts mock from __mocks__/recharts.js will be used
jest.mock('recharts');
jest.mock('../../Utils/TurbineDashboardDataHandler');

const defaultProps = {
  selectedItem: null,
  onItemClick: jest.fn(),
  searchQuery: ''
};

describe('TurbineComponentHealthScoresComponent - ZOMBIES', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('O - renders bar chart with one data item', async () => {
    DataHandler.getTurbineModelHealthScores.mockResolvedValue([
      { Turbine_Model: 'Model A', Score: 85 }
    ]);

    render(
      <TurbineComponentHealthScoresComponent
        {...defaultProps}
        type="bar_TurbineModelHealthScores"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });
  });

  test('M - renders bar chart with multiple items', async () => {
    const mockItems = Array.from({ length: 5 }, (_, i) => ({
      Turbine_Model: `Model ${i}`,
      Score: Math.floor(Math.random() * 100)
    }));
    DataHandler.getTurbineModelHealthScores.mockResolvedValue(mockItems);

    render(
      <TurbineComponentHealthScoresComponent
        {...defaultProps}
        type="bar_TurbineModelHealthScores"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });
  });

  test('B - boundary: renders only top 10 bars for bar_TurbineModelHealthScores', async () => {
    const mockItems = Array.from({ length: 20 }, (_, i) => ({
      Turbine_Model: `Model ${i}`,
      Score: Math.floor(Math.random() * 100)
    }));
    DataHandler.getTurbineModelHealthScores.mockResolvedValue(mockItems);

    render(
      <TurbineComponentHealthScoresComponent
        {...defaultProps}
        type="bar_TurbineModelHealthScores"
      />
    );

    await waitFor(() => {
      const bars = screen.getAllByTestId('bar');
      expect(bars.length).toBeLessThanOrEqual(10);
    });
  });

  test('E - error: handles fetch failure gracefully', async () => {
    console.error = jest.fn();
    DataHandler.getTurbineModelHealthScores.mockRejectedValue(new Error('Network Error'));

    render(
      <TurbineComponentHealthScoresComponent
        {...defaultProps}
        type="bar_TurbineModelHealthScores"
      />
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching turbine data:', expect.any(Error));
    });
  });

  test('S - style: shows tooltip with correct chart explanation', async () => {
    DataHandler.getTurbineModelHealthScores.mockResolvedValue([
      { Turbine_Model: 'Model A', Score: 85 }
    ]);

    render(
      <TurbineComponentHealthScoresComponent
        {...defaultProps}
        type="bar_TurbineModelHealthScores"
      />
    );

    const infoIcon = await screen.findByText('ℹ️');
    fireEvent.mouseOver(infoIcon);

    await waitFor(() => {
      expect(
        screen.getByText(/health scores of different turbine models/i)
      ).toBeInTheDocument();
    });
  });
});
