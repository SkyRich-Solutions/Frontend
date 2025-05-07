import React from 'react';
import { render, screen } from '@testing-library/react';
import MaterialComponentOverviewComponent from '../MaterialComponentOverviewComponent';
import TurbineData from '../../MockData/TurbineData.json';
import '@testing-library/jest-dom';

// Mock Recharts components to isolate logic and avoid rendering SVGs in tests
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
    LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
    Bar: () => <div data-testid="bar" />,
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
  };
});

describe('MaterialComponentOverviewComponent', () => {
  it('renders a bar chart when type is "bar"', () => {
    render(<MaterialComponentOverviewComponent type="bar" />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders a line chart when type is "line"', () => {
    render(<MaterialComponentOverviewComponent type="line" />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders nothing if type is not specified', () => {
    const { container } = render(<MaterialComponentOverviewComponent />);
    expect(container.firstChild).toBeNull();
  });

  it('formats TurbineData correctly', () => {
    const formatted = TurbineData.map((turbine) => ({
      model: turbine.TurbineModel,
      nominal_power: parseFloat(
        turbine.NominalPower.replace(' KW', '').replace(',', '.')
      ),
    }));
    formatted.forEach((item) => {
      expect(typeof item.nominal_power).toBe('number');
      expect(item.model).toBeTruthy();
    });
  });
});
