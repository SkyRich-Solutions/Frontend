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

  it('displays welcome text and description', () => {
    render(<MainPage />);
    expect(screen.getByText('Welcome to the Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText('Here you can find all the information you need.')
    ).toBeInTheDocument();
  });

  it('renders two PieChart components with correct labels', () => {
    render(<MainPage />);
    const pieCharts = screen.getAllByTestId('pie-chart');
    expect(pieCharts).toHaveLength(2);
    expect(pieCharts[0]).toHaveTextContent('Last Material Violation');
    expect(pieCharts[1]).toHaveTextContent('Last Turbine Violation');
  });
});
