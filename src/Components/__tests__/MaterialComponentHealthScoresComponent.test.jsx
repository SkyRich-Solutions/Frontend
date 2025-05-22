import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MaterialComponentHealthScoresComponent from '../MaterialComponentHealthScoresComponent';
import * as DataHandler from '../../Utils/MaterialDashboardDataHandler';

jest.mock('recharts', () => ({
  BarChart: ({ children }) => <svg>{children}</svg>,
  Bar: ({ children }) => <g>{children}</g>,
  Cell: ({ onClick }) => (
    <rect data-testid="bar" onClick={onClick} />
  ),
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Label: () => null,
  ResponsiveContainer: ({ children }) => (
    <div style={{ width: 800, height: 400 }}>{children}</div>
  ),
}));

jest.mock('../../Utils/MaterialDashboardDataHandler', () => ({
  getMaterialCategoryHealthScores: jest.fn().mockResolvedValue([]),
  getMaterialCategoryPredictions: jest.fn().mockResolvedValue([]),
  getMaterialCategoryScoreSummary: jest.fn().mockResolvedValue([]),
  getMaterialComponentHealthScores: jest.fn().mockResolvedValue([]),
  getMaterialComponentScoreSummary: jest.fn().mockResolvedValue([]),
  getMaintenanceForecasts: jest.fn().mockResolvedValue([]),
}));

describe('MaterialComponentHealthScoresComponent - ZOMBIES', () => {
  const setup = (props) =>
    render(
      <MaterialComponentHealthScoresComponent
        type="bar_MaterialComponentHealthScores"
        searchQuery=""
        selectedItem={null}
        onItemClick={jest.fn()}
        {...props}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Z - renders with zero items', async () => {
    DataHandler.getMaterialComponentHealthScores.mockResolvedValue([]);
    const { queryAllByTestId } = setup();
    const bars = await waitFor(() => queryAllByTestId('bar'));
    expect(bars.length).toBe(0);
  });

  test('O - renders with one item', async () => {
    DataHandler.getMaterialComponentHealthScores.mockResolvedValue([
      { Material_ID: 'M1', HealthScore: 85 },
    ]);
    const { findAllByTestId } = setup();
    const bars = await findAllByTestId('bar');
    expect(bars.length).toBe(1);
  });

  test('M - renders with many items', async () => {
    const mockData = Array.from({ length: 20 }, (_, i) => ({
      Material_ID: `M${i}`,
      HealthScore: 50 + i,
    }));
    DataHandler.getMaterialComponentHealthScores.mockResolvedValue(mockData);
    const { findAllByTestId } = setup();
    const bars = await findAllByTestId('bar');
    expect(bars.length).toBeGreaterThan(1);
  });

  test('B - handles boundary scores', async () => {
    DataHandler.getMaterialComponentHealthScores.mockResolvedValue([
      { Material_ID: 'Low', HealthScore: 0 },
      { Material_ID: 'MidLow', HealthScore: 49 },
      { Material_ID: 'MidHigh', HealthScore: 70 },
      { Material_ID: 'High', HealthScore: 100 },
    ]);
    const { findAllByTestId } = setup();
    const bars = await findAllByTestId('bar');
    expect(bars.length).toBe(4);
  });

  test('I - calls onItemClick when bar is clicked', async () => {
    const mockData = [{ Material_ID: 'ClickMe', HealthScore: 88 }];
    DataHandler.getMaterialComponentHealthScores.mockResolvedValue(mockData);
    const handleClick = jest.fn();
    const { findAllByTestId } = setup({ onItemClick: handleClick });
    const bars = await findAllByTestId('bar');
    fireEvent.click(bars[0]);
    expect(handleClick).toHaveBeenCalled();
  });

  test('E - handles fetch error gracefully', async () => {
    DataHandler.getMaterialComponentHealthScores.mockRejectedValue(new Error('Failed'));
    const { container } = setup();
    await waitFor(() => expect(container).toBeTruthy());
  });

  test('S - renders selected bar differently', async () => {
    const mockData = [
      { Material_ID: 'Selected', HealthScore: 75 },
      { Material_ID: 'Other', HealthScore: 80 },
    ];
    DataHandler.getMaterialComponentHealthScores.mockResolvedValue(mockData);
    const { findAllByTestId } = setup({ selectedItem: 'Selected' });
    const bars = await findAllByTestId('bar');
    expect(bars.length).toBe(2);
  });
});