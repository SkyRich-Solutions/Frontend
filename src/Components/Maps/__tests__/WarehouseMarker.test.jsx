import React from 'react';
import { render, screen } from '@testing-library/react';
import WarehouseMarker from '../WarehouseMarker';
import '@testing-library/jest-dom';

// Mock AdvancedMarker and Warehouse icon
jest.mock('@vis.gl/react-google-maps', () => ({
  AdvancedMarker: ({ children, position, title }) => (
    <div
      data-testid="warehouse-marker"
      data-lat={position.lat}
      data-lng={position.lng}
      title={title}
    >
      {children}
    </div>
  )
}));

jest.mock('lucide-react', () => ({
  Warehouse: () => <svg data-testid="warehouse-icon" />
}));

describe('WarehouseMarker Component', () => {
  const validPlant = {
    Plant_Name: 'Warehouse A',
    Plant_Latitude: '56.12',
    Plant_Longitude: '10.45'
  };

  const invalidPlant = {
    Plant_Name: 'Broken Warehouse',
    Plant_Latitude: 'NaN',
    Plant_Longitude: ''
  };

  const plantData = {
    all: [validPlant, invalidPlant],
    maint: [validPlant],
    planning: [validPlant]
  };

  it('renders markers only for valid coordinates with showAll', () => {
    render(<WarehouseMarker plantData={plantData} filters={{ showAll: true }} />);
    const markers = screen.getAllByTestId('warehouse-marker');
    expect(markers.length).toBe(1);
    expect(markers[0]).toHaveAttribute('data-lat', '56.12');
    expect(markers[0]).toHaveAttribute('data-lng', '10.45');
    expect(markers[0]).toHaveAttribute('title', 'Warehouse A');
  });

  it('renders markers for showMaint only', () => {
    render(<WarehouseMarker plantData={plantData} filters={{ showMaint: true }} />);
    const markers = screen.getAllByTestId('warehouse-marker');
    expect(markers.length).toBe(1);
  });

  it('renders markers for showPlanning only', () => {
    render(<WarehouseMarker plantData={plantData} filters={{ showPlanning: true }} />);
    const markers = screen.getAllByTestId('warehouse-marker');
    expect(markers.length).toBe(1);
  });

  it('renders no markers if all filters are false', () => {
    render(<WarehouseMarker plantData={plantData} filters={{ showAll: false, showMaint: false, showPlanning: false }} />);
    expect(screen.queryByTestId('warehouse-marker')).not.toBeInTheDocument();
  });

  it('renders nothing when plantData is empty', () => {
    render(<WarehouseMarker plantData={{}} filters={{ showAll: true }} />);
    expect(screen.queryByTestId('warehouse-marker')).not.toBeInTheDocument();
  });
});
