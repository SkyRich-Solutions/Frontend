import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TurbineMarkers from '../TurbineMarker';
import '@testing-library/jest-dom';

// Mock the Google Maps components
jest.mock('@vis.gl/react-google-maps', () => ({
  AdvancedMarker: ({ children, ...props }) => (
    <div
      data-testid="advanced-marker"
      title={props.title}
      onClick={props.onClick}
      data-lat={props.position.lat}
      data-lng={props.position.lng}
    >
      {children}
    </div>
  ),
}));

describe('TurbineMarkers component', () => {
  const mockTurbine = {
    FunctionalLoc: 'TURB-123',
    TurbineLatitude: 56.789,
    TurbineLongitude: 9.876,
  };

  const mockSetSelectedTurbine = jest.fn();

  it('renders markers from allData when showAll is true', () => {
    render(
      <TurbineMarkers
        filters={{ showAll: true }}
        allData={[mockTurbine]}
        setSelectedTurbine={mockSetSelectedTurbine}
      />
    );

    const marker = screen.getByTestId('advanced-marker');
    expect(marker).toBeInTheDocument();

    // Check that image is rendered
    expect(screen.getByRole('img', { name: /turbine/i })).toBeInTheDocument();
  });

  it('does not render anything when showAll is false', () => {
    render(
      <TurbineMarkers
        filters={{ showAll: false }}
        allData={[mockTurbine]}
        setSelectedTurbine={mockSetSelectedTurbine}
      />
    );

    expect(screen.queryByTestId('advanced-marker')).not.toBeInTheDocument();
  });

  it('calls setSelectedTurbine on marker click', () => {
    render(
      <TurbineMarkers
        filters={{ showAll: true }}
        allData={[mockTurbine]}
        setSelectedTurbine={mockSetSelectedTurbine}
      />
    );

    fireEvent.click(screen.getByTestId('advanced-marker'));
    expect(mockSetSelectedTurbine).toHaveBeenCalledWith(mockTurbine);
  });
});
