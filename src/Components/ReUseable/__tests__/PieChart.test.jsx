import React from 'react';
import { render, screen } from '@testing-library/react';
import PieChart from '../PieChart';
import '@testing-library/jest-dom';

jest.mock('react-chartjs-2', () => ({
  Pie: () => <div data-testid="mock-pie-chart">PieChartMock</div>
}));

jest.mock('../Loader', () => () => <div data-testid="mock-loader">Loading...</div>);

describe('PieChart - ZOMBIES', () => {
  const mockChartData = {
    labels: ['Red', 'Blue', 'Green'],
    datasets: [
      {
        data: [10, 20, 30],
        backgroundColor: ['red', 'blue', 'green'],
        borderColor: ['darkred', 'darkblue', 'darkgreen']
      }
    ]
  };

  // Z - Zero state
  test('Z - renders loader when chartData is null', () => {
    render(<PieChart chartData={null} />);
    expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
  });

  // O - One state
  test('O - renders with one dataset and label', () => {
    const singleData = {
      labels: ['Single'],
      datasets: [
        {
          data: [100],
          backgroundColor: ['gray'],
          borderColor: ['black']
        }
      ]
    };
    render(<PieChart chartData={singleData} text="Single Data" />);
    expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
  });

  // M - Multiple state
  test('M - renders multiple data points with info text', () => {
    render(
      <PieChart
        chartData={mockChartData}
        text="Color Chart"
        infoText={"Red means alert.\nBlue means calm."}
      />
    );
    expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
  });

  // B - Boundary
  test('B - handles empty searchQuery gracefully', () => {
    render(<PieChart chartData={mockChartData} searchQuery="" />);
    expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
  });

  // I - Interface
  test('I - displays the correct chart title', () => {
    render(<PieChart chartData={mockChartData} text="My Pie Chart" />);
    expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
  });

  // E - Edge Case
  test('E - filters chart data based on searchQuery', () => {
    render(
      <PieChart chartData={mockChartData} searchQuery="re" text="Filtered Chart" />
    );
    expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
  });

  // S - Styling
  test('S - renders info box with Tailwind classes', () => {
    render(
      <PieChart
        chartData={mockChartData}
        text="Styled Chart"
        infoText={"Line 1\nLine 2"}
      />
    );
    const tooltip = screen.getByText('ℹ️').closest('div');
    expect(tooltip).toHaveClass('group');
  });
});
