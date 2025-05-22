import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TurbineComponentHealthScoresComponent from '../TurbineComponentHealthScoresComponent';
import * as DataHandler from '../../Utils/TurbineDashboardDataHandler';

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
      { TurbineModel: 'Model A', HealthScore: 85 }
    ]);
    DataHandler.getTurbineModelScoreSummary.mockResolvedValue([]);
    DataHandler.getTurbinePlatformHealthScores.mockResolvedValue([]);
    DataHandler.getTurbinePlatformScoreSummary.mockResolvedValue([]);

    render(<TurbineComponentHealthScoresComponent {...defaultProps} type="bar_TurbineModelHealthScores" />);

    await waitFor(() => {
      expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });
  });

  test('M - renders bar chart with multiple items', async () => {
    const mockItems = Array.from({ length: 5 }, (_, i) => ({
      TurbineModel: `Model ${i}`,
      HealthScore: 70 + i
    }));
    DataHandler.getTurbineModelHealthScores.mockResolvedValue(mockItems);
    DataHandler.getTurbineModelScoreSummary.mockResolvedValue([]);
    DataHandler.getTurbinePlatformHealthScores.mockResolvedValue([]);
    DataHandler.getTurbinePlatformScoreSummary.mockResolvedValue([]);

    render(<TurbineComponentHealthScoresComponent {...defaultProps} type="bar_TurbineModelHealthScores" />);

    await waitFor(() => {
      expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });
  });

  test('B - boundary: renders only top 10 bars for bar_TurbineModelHealthScores', async () => {
    const mockItems = Array.from({ length: 20 }, (_, i) => ({
      TurbineModel: `Model ${i}`,
      HealthScore: 50 + i
    }));
    DataHandler.getTurbineModelHealthScores.mockResolvedValue(mockItems);
    DataHandler.getTurbineModelScoreSummary.mockResolvedValue([]);
    DataHandler.getTurbinePlatformHealthScores.mockResolvedValue([]);
    DataHandler.getTurbinePlatformScoreSummary.mockResolvedValue([]);

    render(<TurbineComponentHealthScoresComponent {...defaultProps} type="bar_TurbineModelHealthScores" />);

    await waitFor(() => {
      const bars = screen.getAllByTestId('bar');
      expect(bars.length).toBeLessThanOrEqual(10);
    });
  });

  test('E - error: handles fetch failure gracefully', async () => {
    console.error = jest.fn();
    DataHandler.getTurbineModelHealthScores.mockRejectedValue(new Error('Network Error'));
    DataHandler.getTurbineModelScoreSummary.mockResolvedValue([]);
    DataHandler.getTurbinePlatformHealthScores.mockResolvedValue([]);
    DataHandler.getTurbinePlatformScoreSummary.mockResolvedValue([]);

    render(<TurbineComponentHealthScoresComponent {...defaultProps} type="bar_TurbineModelHealthScores" />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching turbine data:', expect.any(Error));
    });
  });

  test('S - style: shows tooltip with correct chart explanation', async () => {
    DataHandler.getTurbineModelHealthScores.mockResolvedValue([
      { TurbineModel: 'Model Tooltip', HealthScore: 70 }
    ]);
    DataHandler.getTurbineModelScoreSummary.mockResolvedValue([]);
    DataHandler.getTurbinePlatformHealthScores.mockResolvedValue([]);
    DataHandler.getTurbinePlatformScoreSummary.mockResolvedValue([]);

    render(<TurbineComponentHealthScoresComponent {...defaultProps} type="bar_TurbineModelHealthScores" />);

    const infoIcon = await screen.findByText('ℹ️');
    fireEvent.mouseOver(infoIcon);

    await waitFor(() => {
      expect(screen.getByText(/health scores of different turbine models/i)).toBeInTheDocument();
    });
  });
});