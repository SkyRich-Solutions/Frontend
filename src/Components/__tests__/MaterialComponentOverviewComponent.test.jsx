import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MaterialComponentOverviewComponent from '../MaterialComponentOverviewComponent';
import * as DataHandler from '../../Utils/MaterialDashboardDataHandler';

jest.mock('../../Utils/MaterialDashboardDataHandler');

const mockData = [
  { Material: 'M1', MaterialCategory: 'CatA', Plant: 'Plant1', PlantSpecificMaterialStatus: 'Available', ReplacementPart: 'B' },
  { Material: 'M2', MaterialCategory: 'CatB', Plant: 'Plant1', PlantSpecificMaterialStatus: 'Obsolete', ReplacementPart: 'B' },
  { Material: 'M3', MaterialCategory: 'CatA', Plant: 'Plant2', PlantSpecificMaterialStatus: 'Pending', ReplacementPart: 'A' },
];

const defaultProps = {
  selectedItem: null,
  handleClick: jest.fn(),
  searchQuery: ''
};

describe('MaterialComponentOverviewComponent - ZOMBIES', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    DataHandler.getPredictionMaterialData.mockResolvedValue(mockData);
  });

  test('Z - renders fallback with no data', async () => {
    DataHandler.getPredictionMaterialData.mockResolvedValue([]);
    render(<MaterialComponentOverviewComponent {...defaultProps} type="bar_PlantSpecificMaterialStatus" />);
    await waitFor(() => {
      const chart = screen.queryByTestId('BarChart');
      expect(chart).toBeInTheDocument();
      const bars = screen.queryAllByTestId('bar');
      expect(bars.length).toBeLessThanOrEqual(1);
    });
  });

  test('O - renders bar chart with one data item', async () => {
    DataHandler.getPredictionMaterialData.mockResolvedValue([mockData[0]]);
    render(<MaterialComponentOverviewComponent {...defaultProps} type="bar_PlantSpecificMaterialStatus" />);
    await waitFor(() => {
      expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });
  });

  test('M - renders bar chart with multiple items', async () => {
    render(<MaterialComponentOverviewComponent {...defaultProps} type="bar_MaterialByPlant" />);
    await waitFor(() => {
      expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });
  });

  test('B - boundary: handles top 15 materials rendering', async () => {
    const largeData = Array.from({ length: 20 }, (_, i) => ({
      Material: `M${i}`, MaterialCategory: 'Cat', Plant: `Plant${i % 3}`, PlantSpecificMaterialStatus: 'Status', ReplacementPart: 'B'
    }));
    DataHandler.getPredictionMaterialData.mockResolvedValue(largeData);
    render(<MaterialComponentOverviewComponent {...defaultProps} type="bar_MaterialCount" />);
    await waitFor(() => {
      expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });
  });

  test('E - error: fetch failure is caught and logged', async () => {
    console.error = jest.fn();
    DataHandler.getPredictionMaterialData.mockRejectedValue(new Error('Fetch failed'));
    render(<MaterialComponentOverviewComponent {...defaultProps} type="bar_PlantSpecificMaterialStatus" />);
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching material data:', expect.any(Error));
    });
  });
});
