import React from 'react';
import { render, screen } from '@testing-library/react';
import PieChart from '../PieChart';

// Create a mock that captures props
const mockPie = jest.fn();
jest.mock('react-chartjs-2', () => ({
  Pie: (props) => {
    mockPie(props);
    return <div data-testid="mock-pie-chart" />;
  }
}));

describe('PieChart component', () => {
  beforeEach(() => {
    mockPie.mockClear();
  });

  it('renders without crashing', () => {
    render(<PieChart text="Test Title" violation={false} />);
    expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
  });

  it('passes correct chart data and options to <Pie />', () => {
    render(<PieChart text="Custom Title" violation={false} />);

    const expectedData = {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          label: 'Color Distribution',
          data: [10, 20, 30],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }
      ]
    };

    const props = mockPie.mock.calls[0][0];

    expect(props.data).toEqual(expectedData);
    expect(props.options.plugins.title.text).toBe('Custom Title');
    expect(props.options.plugins.legend.position).toBe('top');
    expect(props.options.responsive).toBe(true);
  });

  it('displays the correct chart title from props', () => {
    render(<PieChart text="Violation Summary" violation={true} />);
    const props = mockPie.mock.calls[0][0];
    expect(props.options.plugins.title.text).toBe('Violation Summary');
  });
});
