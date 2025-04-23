import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../../Pages/Dashboard';

// Mock Header to avoid rendering actual header logic
jest.mock('../../Components/Layout/Header', () => ({ title }) => (
  <div data-testid="header">Header: {title}</div>
));

// Mock ChartComponent to avoid rendering Recharts internals
jest.mock('../../Components/ChartComponent', () => ({ type }) => (
  <div data-testid={`chart-${type}`}>Chart Type: {type}</div>
));

describe('Dashboard', () => {
  it('renders the header with correct title', () => {
    render(<Dashboard />);
    expect(screen.getByTestId('header')).toHaveTextContent('Dashboard');
  });

  it('renders all expected chart components', () => {
    render(<Dashboard />);

    const barCharts = screen.getAllByTestId('chart-bar');
    const lineCharts = screen.getAllByTestId('chart-line');

    // From the Dashboard layout:
    // - Top row: bar, line, bar (2 bar, 1 line)
    // - Middle column: line, bar (1 bar, 1 line)
    // - Large square chart: line (1 line)
    expect(barCharts).toHaveLength(3);
    expect(lineCharts).toHaveLength(3);
  });

  it('renders 6 total chart containers (top row + middle + large chart)', () => {
    render(<Dashboard />);

    const chartElements = screen.getAllByText(/Chart Type:/i);
    expect(chartElements).toHaveLength(6);
  });
});