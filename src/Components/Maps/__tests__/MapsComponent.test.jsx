import React from 'react';
import { render, screen } from '@testing-library/react';
import MapComponent from '../MapsComponent';
import '@testing-library/jest-dom';

jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }) => <div data-testid="api-provider">{children}</div>,
  Map: ({ children, ...props }) => (
    <div data-testid="google-map" {...props}>
      {children}
    </div>
  ),
  useMap: () => ({
    getZoom: () => 8,
    setZoom: jest.fn(),
    setHeading: jest.fn(),
    setTilt: jest.fn(),
  }),
}));

jest.mock('../TurbineMarker', () => ({ __esModule: true, default: () => <div data-testid="turbine-marker" /> }));
jest.mock('../WarehouseMarker', () => ({ __esModule: true, default: () => <div data-testid="warehouse-marker" /> }));
jest.mock('../ConnectingLine', () => ({ __esModule: true, default: () => <div data-testid="connection-line" /> }));

describe('MapComponent - ZOMBIES', () => {
  const defaultProps = {
    turbineData: [{ TurbineLatitude: 56.1, TurbineLongitude: 12.1 }],
    plantData: {
      all: [{ Plant_Name: 'Plant 1', Plant_Latitude: 56.2, Plant_Longitude: 12.2 }],
    },
    filters: {
      turbine: { showAll: true },
      warehouse: { showAll: true },
    },
    linePath: [],
    onTurbineClick: jest.fn(),
    onMapClick: jest.fn(),
    onPlantClick: jest.fn(),
    setMapRef: jest.fn(),
    resetMapView: jest.fn(),
  };

  // Z - Zero data: minimal props with no markers
  test('Z - renders map component with no turbine or warehouse data', () => {
    render(
      <MapComponent
        {...defaultProps}
        turbineData={[]}
        plantData={{ all: [] }}
        filters={{ turbine: {}, warehouse: {} }}
      />
    );
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });

  // O - One marker: Turbine and warehouse markers rendered
  test('O - renders turbine and warehouse markers when filters match', () => {
    render(<MapComponent {...defaultProps} />);
    expect(screen.getByTestId('turbine-marker')).toBeInTheDocument();
    expect(screen.getByTestId('warehouse-marker')).toBeInTheDocument();
  });

  // M - Multiple markers (represented via mocked components)
  test('M - renders map and control elements with all subcomponents', () => {
    render(<MapComponent {...defaultProps} />);
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
    expect(screen.getByTestId('turbine-marker')).toBeInTheDocument();
    expect(screen.getByTestId('warehouse-marker')).toBeInTheDocument();
  });

  // B - Boundary: renders ConnectionLine only when two points are present
  test('B - renders connection line only when linePath has two coordinates', () => {
    const propsWithLine = { ...defaultProps, linePath: [{ lat: 1, lng: 1 }, { lat: 2, lng: 2 }] };
    render(<MapComponent {...propsWithLine} />);
    expect(screen.getByTestId('connection-line')).toBeInTheDocument();
  });

  // I - Interaction: simulates onMapClick handler
  test('I - clicking on the map calls onMapClick', () => {
    const mockClick = jest.fn();
    render(<MapComponent {...defaultProps} onMapClick={mockClick} />);
    const map = screen.getByTestId('google-map');
    map.click();
    expect(mockClick).toBeCalled();
  });

  // E - Edge case: reset view button calls resetMapView
  test('E - clicking reset orientation calls resetMapView', () => {
    render(<MapComponent {...defaultProps} />);
    const resetButton = screen.getByLabelText('Reset orientation');
    resetButton.click();
    expect(defaultProps.resetMapView).toBeCalled();
  });

  // S - Styling and control visibility
  test('S - renders zoom level indicator and control buttons', () => {
    render(<MapComponent {...defaultProps} />);
    expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset orientation')).toBeInTheDocument();
    expect(screen.getByText(/Zoom: 8.0/)).toBeInTheDocument();
  });
});
