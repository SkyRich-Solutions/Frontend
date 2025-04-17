import React from 'react';
import { render, screen } from '@testing-library/react';
import TurbineDetailPanel from '../TurbineDetailPanel';
import '@testing-library/jest-dom';

describe('TurbineDetailPanel', () => {
  const mockTurbine = {
    FunctionalLoc: 'TURB-001',
    TurbineLatitude: '56.12345',
    TurbineLongitude: '12.54321',
  };

  it('renders correctly when no turbine is selected', () => {
    render(<TurbineDetailPanel selectedTurbine={null} />);
    
    expect(screen.getByText('Turbine Details')).toBeInTheDocument();
    expect(screen.getByText('Select a pin to see details here.')).toBeInTheDocument();
  });

  it('renders all turbine details when a turbine is selected', () => {
    render(<TurbineDetailPanel selectedTurbine={mockTurbine} />);
    
    expect(screen.getByText('Turbine Details')).toBeInTheDocument();
    expect(screen.getByText(/Location:/)).toBeInTheDocument();
    expect(screen.getByText('TURB-001')).toBeInTheDocument();

    expect(screen.getByText(/Latitude:/)).toBeInTheDocument();
    expect(screen.getByText('56.12345')).toBeInTheDocument();

    expect(screen.getByText(/Longitude:/)).toBeInTheDocument();
    expect(screen.getByText('12.54321')).toBeInTheDocument();
  });

  it('matches snapshot when a turbine is selected', () => {
    const { asFragment } = render(<TurbineDetailPanel selectedTurbine={mockTurbine} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
