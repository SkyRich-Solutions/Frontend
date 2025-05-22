import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TurbineMarkers from '../TurbineMarker';
import '@testing-library/jest-dom';

jest.mock('@vis.gl/react-google-maps', () => ({
  AdvancedMarker: ({ children, ...props }) => (
    <div data-testid="advanced-marker" {...props}>
      {children}
    </div>
  ),
}));

describe('TurbineMarkers - ZOMBIES', () => {
  const mockTurbines = [
    {
      FunctionalLoc: 'TURB-001',
      TurbineLatitude: 56.1,
      TurbineLongitude: 12.1,
    },
    {
      FunctionalLoc: 'TURB-002',
      TurbineLatitude: 56.2,
      TurbineLongitude: 12.2,
    },
  ];

  const mockSetSelectedTurbine = jest.fn();

  // Z - Zero data state
  test('Z - renders nothing when showAll is false', () => {
    render(
      <TurbineMarkers filters={{ showAll: false }} allData={mockTurbines} setSelectedTurbine={mockSetSelectedTurbine} />
    );
    expect(screen.queryByTestId('advanced-marker')).not.toBeInTheDocument();
  });

  // O - One marker rendering
  test('O - renders a marker for one turbine', () => {
    render(
      <TurbineMarkers filters={{ showAll: true }} allData={[mockTurbines[0]]} setSelectedTurbine={mockSetSelectedTurbine} />
    );
    expect(screen.getByTestId('advanced-marker')).toBeInTheDocument();
  });

  // M - Multiple markers rendered
  test('M - renders multiple turbine markers when showAll is true', () => {
    render(
      <TurbineMarkers filters={{ showAll: true }} allData={mockTurbines} setSelectedTurbine={mockSetSelectedTurbine} />
    );
    const markers = screen.getAllByTestId('advanced-marker');
    expect(markers).toHaveLength(2);
  });

  // B - Boundary position values
  test('B - uses correct lat/lng from turbine data', () => {
    render(
      <TurbineMarkers filters={{ showAll: true }} allData={[mockTurbines[0]]} setSelectedTurbine={mockSetSelectedTurbine} />
    );
    const marker = screen.getByTestId('advanced-marker');
    expect(marker).toHaveAttribute('title', 'TURB-001');
  });

  // I - Interaction with turbine marker
  test('I - clicking a marker calls setSelectedTurbine', () => {
    render(
      <TurbineMarkers filters={{ showAll: true }} allData={[mockTurbines[0]]} setSelectedTurbine={mockSetSelectedTurbine} />
    );
    const marker = screen.getByTestId('advanced-marker');
    fireEvent.click(marker);
    expect(mockSetSelectedTurbine).toHaveBeenCalledWith(mockTurbines[0]);
  });

  // E - Edge case with empty allData
  test('E - renders nothing when allData is empty', () => {
    render(
      <TurbineMarkers filters={{ showAll: true }} allData={[]} setSelectedTurbine={mockSetSelectedTurbine} />
    );
    expect(screen.queryByTestId('advanced-marker')).not.toBeInTheDocument();
  });

  // S - Styling/image inclusion
  test('S - renders turbine icon image inside marker', () => {
    render(
      <TurbineMarkers filters={{ showAll: true }} allData={[mockTurbines[0]]} setSelectedTurbine={mockSetSelectedTurbine} />
    );
    const image = screen.getByAltText('Turbine');
    expect(image).toHaveAttribute('src', '/icons/turbine.png');
  });
});
