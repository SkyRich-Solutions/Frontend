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
  Pin: ({ background }) => <span data-testid={`pin-${background}`} />,
}));

describe('TurbineMarkers component', () => {
  const mockTurbine = {
    FunctionalLoc: 'TURB-123',
    TurbineLatitude: '56.789',
    TurbineLongitude: '9.876',
  };

  const brokenTurbine = {
    FunctionalLoc: 'BROKEN',
    TurbineLatitude: 'NaN',
    TurbineLongitude: '',
  };

  const mockSetSelectedTurbine = jest.fn();

  it('renders markers from allData when showAll is true', () => {
    render(
      <TurbineMarkers
        filters={{ showAll: true, showMaint: false, showPlanning: false }}
        allData={[mockTurbine]}
        maintData={[]}
        planningData={[]}
        setSelectedTurbine={mockSetSelectedTurbine}
      />
    );

    expect(screen.getByTestId('advanced-marker')).toBeInTheDocument();
    expect(screen.getByTestId('pin-gray')).toBeInTheDocument();
  });

  it('renders only valid markers from maintData when showMaint is true', () => {
    render(
      <TurbineMarkers
        filters={{ showAll: false, showMaint: true, showPlanning: false }}
        allData={[]}
        maintData={[mockTurbine, brokenTurbine]}
        planningData={[]}
        setSelectedTurbine={mockSetSelectedTurbine}
      />
    );

    const markers = screen.getAllByTestId('advanced-marker');
    expect(markers.length).toBe(1); // Only valid one renders
    expect(screen.getByTestId('pin-red')).toBeInTheDocument();
  });

  it('renders markers from planningData with correct color', () => {
    render(
      <TurbineMarkers
        filters={{ showAll: false, showMaint: false, showPlanning: true }}
        allData={[]}
        maintData={[]}
        planningData={[mockTurbine]}
        setSelectedTurbine={mockSetSelectedTurbine}
      />
    );

    expect(screen.getByTestId('pin-blue')).toBeInTheDocument();
  });

  it('calls setSelectedTurbine on marker click', () => {
    render(
      <TurbineMarkers
        filters={{ showAll: true }}
        allData={[mockTurbine]}
        maintData={[]}
        planningData={[]}
        setSelectedTurbine={mockSetSelectedTurbine}
      />
    );

    fireEvent.click(screen.getByTestId('advanced-marker'));
    expect(mockSetSelectedTurbine).toHaveBeenCalledWith(mockTurbine);
  });

  it('renders nothing if all filters are false', () => {
    render(
      <TurbineMarkers
        filters={{ showAll: false, showMaint: false, showPlanning: false }}
        allData={[mockTurbine]}
        maintData={[mockTurbine]}
        planningData={[mockTurbine]}
        setSelectedTurbine={mockSetSelectedTurbine}
      />
    );

    expect(screen.queryByTestId('advanced-marker')).not.toBeInTheDocument();
  });
});
