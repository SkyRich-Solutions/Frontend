import React from 'react';
import { render, screen } from '@testing-library/react';
import MainPage from '../MainPage';

// Mock Header and PieChart to isolate MainPage logic
jest.mock('../../Components/Layout/Header', () => ({ title }) => (
  <div data-testid="header">Header: {title}</div>
));

jest.mock('../../Components/ReUseable/PieChart', () => ({ text }) => (
  <div data-testid="pie-chart">{text}</div>
));

describe('MainPage', () => {
  it('renders the Header with correct title', () => {
    render(<MainPage />);
    expect(screen.getByTestId('header')).toHaveTextContent('Overview');
  });

  it('renders all PieChart components with correct labels', () => {
    render(<MainPage />);
    const pieCharts = screen.getAllByTestId('pie-chart');
    expect(pieCharts).toHaveLength(6);

    const expectedLabels = [
      'Replacement Parts',
      'Material Classifications',
      "Material Plant ID's",
      'Maintaince Plant',
      'Planning Plant',
      'Location'
    ];

    expectedLabels.forEach(label =>
      expect(screen.getByText(label)).toBeInTheDocument()
    );
  });
});
