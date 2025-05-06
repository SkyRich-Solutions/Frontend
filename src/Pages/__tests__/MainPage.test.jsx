import React from 'react';
import { render, screen } from '@testing-library/react';
import DataOverviewOfComplianceDashboard from '../DataOverviewOfComplianceDashboard';

// Mock Header and PieChart to isolate DataOverviewOfComplianceDashboard logic
jest.mock('../../Components/Layout/Header', () => ({ title }) => (
  <div data-testid="header">Header: {title}</div>
));

jest.mock('../../Components/ReUseable/PieChart', () => ({ text }) => (
  <div data-testid="pie-chart">{text}</div>
));

describe('DataOverviewOfComplianceDashboard', () => {
  it('renders the Header with correct title', () => {
    render(<DataOverviewOfComplianceDashboard />);
    expect(screen.getByTestId('header')).toHaveTextContent('Overview');
  });

  it('renders all PieChart components with correct labels', () => {
    render(<DataOverviewOfComplianceDashboard />);
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
