import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MaterialComponentPredictionsComponent from '../MaterialComponentPredictionsComponent';
import * as DataHandler from '../../Utils/MaterialDashboardDataHandler';

jest.mock('../../Utils/MaterialDashboardDataHandler');

const defaultProps = {
  selectedItem: null,
  onItemClick: jest.fn(),
  searchQuery: ''
};

describe('MaterialComponentPredictionsComponent - ZOMBIES', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Z - renders fallback when no data is available for bar_ReplacementPrediction', async () => {
    DataHandler.getReplacementPredictions.mockResolvedValue([]);
    DataHandler.getReplacementPredictionGlobal.mockResolvedValue([]);
    DataHandler.getMaterialStatusTransitions.mockResolvedValue([]);
    DataHandler.getMonteCarloDominance.mockResolvedValue([]);
    DataHandler.getMaterialPredictions.mockResolvedValue([]);

    render(<MaterialComponentPredictionsComponent {...defaultProps} type="bar_ReplacementPrediction" />);

    await waitFor(() => {
      const bars = screen.queryAllByTestId('bar');
      const visibleBars = bars.filter(bar => {
        const height = bar.getAttribute('height');
        return height !== '0' && height !== null && height !== undefined && parseFloat(height) > 0;
      });
      expect(visibleBars.length).toBe(0);
    });
  });

  test('O - renders bar chart with one data item', async () => {
    DataHandler.getReplacementPredictions.mockResolvedValue([
      { Material_Description: 'Test Material', BayesianProbability: 0.75 }
    ]);
    DataHandler.getReplacementPredictionGlobal.mockResolvedValue([]);
    DataHandler.getMaterialStatusTransitions.mockResolvedValue([]);
    DataHandler.getMonteCarloDominance.mockResolvedValue([]);
    DataHandler.getMaterialPredictions.mockResolvedValue([]);

    render(<MaterialComponentPredictionsComponent {...defaultProps} type="bar_ReplacementPrediction" />);

    await waitFor(() => {
      expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });
  });

  test('M - renders bar chart with multiple items', async () => {
    const mockItems = Array.from({ length: 5 }, (_, i) => ({
      Material_Description: `Material ${i}`,
      BayesianProbability: Math.random()
    }));
    DataHandler.getReplacementPredictions.mockResolvedValue(mockItems);
    DataHandler.getReplacementPredictionGlobal.mockResolvedValue([]);
    DataHandler.getMaterialStatusTransitions.mockResolvedValue([]);
    DataHandler.getMonteCarloDominance.mockResolvedValue([]);
    DataHandler.getMaterialPredictions.mockResolvedValue([]);

    render(<MaterialComponentPredictionsComponent {...defaultProps} type="bar_ReplacementPrediction" />);

    await waitFor(() => {
      expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });
  });

  test('B - boundary: renders only top 10 bars for bar_ReplacementPrediction', async () => {
    const mockItems = Array.from({ length: 20 }, (_, i) => ({
      Material_Description: `Material ${i}`,
      BayesianProbability: Math.random()
    }));
    DataHandler.getReplacementPredictions.mockResolvedValue(mockItems);
    DataHandler.getReplacementPredictionGlobal.mockResolvedValue([]);
    DataHandler.getMaterialStatusTransitions.mockResolvedValue([]);
    DataHandler.getMonteCarloDominance.mockResolvedValue([]);
    DataHandler.getMaterialPredictions.mockResolvedValue([]);

    render(<MaterialComponentPredictionsComponent {...defaultProps} type="bar_ReplacementPrediction" />);

    await waitFor(() => {
      const bars = screen.getAllByTestId('bar');
      expect(bars.length).toBeLessThanOrEqual(10);
    });
  });

  test('E - error: handles fetch failure gracefully', async () => {
    console.error = jest.fn();
    DataHandler.getReplacementPredictions.mockRejectedValue(new Error('Network Error'));
    DataHandler.getReplacementPredictionGlobal.mockResolvedValue([]);
    DataHandler.getMaterialStatusTransitions.mockResolvedValue([]);
    DataHandler.getMonteCarloDominance.mockResolvedValue([]);
    DataHandler.getMaterialPredictions.mockResolvedValue([]);

    render(<MaterialComponentPredictionsComponent {...defaultProps} type="bar_ReplacementPrediction" />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching material data:', expect.any(Error));
    });
  });

  test('S - style: shows tooltip with correct chart explanation', async () => {
    DataHandler.getReplacementPredictions.mockResolvedValue([
      { Material_Description: 'Sample Material', BayesianProbability: 0.4 }
    ]);
    DataHandler.getReplacementPredictionGlobal.mockResolvedValue([]);
    DataHandler.getMaterialStatusTransitions.mockResolvedValue([]);
    DataHandler.getMonteCarloDominance.mockResolvedValue([]);
    DataHandler.getMaterialPredictions.mockResolvedValue([]);

    render(<MaterialComponentPredictionsComponent {...defaultProps} type="bar_ReplacementPrediction" />);

    const infoIcon = await screen.findByText('ℹ️');
    fireEvent.mouseOver(infoIcon);

    await waitFor(() => {
      expect(screen.getByText(/most likely to be replaced/i)).toBeInTheDocument();
    });
  });
});
