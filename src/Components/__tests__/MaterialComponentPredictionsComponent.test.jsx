// src/Components/__tests__/MaterialComponentPredictionsComponent.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MaterialComponentPredictionsComponent from '../MaterialComponentPredictionsComponent';
import * as DataHandler from '../../Utils/MaterialDashboardDataHandler';

jest.mock('../../Utils/MaterialDashboardDataHandler');

const defaultProps = {
  selectedItem: null,
  searchQuery: '',
  onItemClick: jest.fn()
};

const mockReplacementData = [
  { Material_Description: 'M1', BayesianProbability: 0.7 },
  { Material_Description: 'M2', BayesianProbability: 0.3 }
];

describe('MaterialComponentPredictionsComponent - ZOMBIES (bar_ReplacementPrediction)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DataHandler.getReplacementPredictions.mockResolvedValue(mockReplacementData);
    DataHandler.getReplacementPredictionGlobal.mockResolvedValue([]);
    DataHandler.getMaterialStatusTransitions.mockResolvedValue([]);
    DataHandler.getMonteCarloDominance.mockResolvedValue([]);
    DataHandler.getMaterialPredictions.mockResolvedValue([]);
  });

  test('Z - renders fallback with no data', async () => {
    DataHandler.getReplacementPredictions.mockResolvedValue([]);
    render(<MaterialComponentPredictionsComponent {...defaultProps} type="bar_ReplacementPrediction" />);
    await waitFor(() => {
      expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });
  });

  test('O - renders bar chart with one data item', async () => {
    DataHandler.getReplacementPredictions.mockResolvedValue([mockReplacementData[0]]);
    render(<MaterialComponentPredictionsComponent {...defaultProps} type="bar_ReplacementPrediction" />);
    await waitFor(() => {
      expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });
  });

  test('M - renders bar chart with multiple items', async () => {
    render(<MaterialComponentPredictionsComponent {...defaultProps} type="bar_ReplacementPrediction" />);
    await waitFor(() => {
      expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });
  });

  test('B - boundary: renders max 10 bars only', async () => {
    const largeMock = Array.from({ length: 20 }, (_, i) => ({
      Material_Description: `Material ${i}`,
      BayesianProbability: Math.random()
    }));
    DataHandler.getReplacementPredictions.mockResolvedValue(largeMock);

    render(<MaterialComponentPredictionsComponent {...defaultProps} type="bar_ReplacementPrediction" />);
    await waitFor(() => {
      const bars = screen.getAllByTestId('bar');
      expect(bars.length).toBeLessThanOrEqual(10);
    });
  });

  test('E - error: handles fetch error gracefully', async () => {
    console.error = jest.fn();
    DataHandler.getReplacementPredictions.mockRejectedValue(new Error('Fetch failed'));

    render(<MaterialComponentPredictionsComponent {...defaultProps} type="bar_ReplacementPrediction" />);
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching material data:', expect.any(Error));
    });
  });

  test('S - style: shows info tooltip text', async () => {
    render(<MaterialComponentPredictionsComponent {...defaultProps} type="bar_ReplacementPrediction" />);
    const infoIcon = await screen.findByText('ℹ️');
    fireEvent.mouseOver(infoIcon);
    await waitFor(() => {
      expect(screen.getByText(/top 10 materials most likely to be replaced/i)).toBeInTheDocument();
    });
  });
});
