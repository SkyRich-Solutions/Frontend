import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WarehouseMarker from '../WarehouseMarker';
import '@testing-library/jest-dom';

jest.mock('@vis.gl/react-google-maps', () => ({
  AdvancedMarker: ({ children, ...props }) => (
    <div data-testid="advanced-marker" {...props}>
      {children}
    </div>
  ),
}));

describe('WarehouseMarker - ZOMBIES', () => {
  const mockPlantData = {
    all: [
      { Plant_Name: 'AllPlant', Plant_Latitude: '56.3', Plant_Longitude: '12.3' }
    ],
    maint: [
      { Plant_Name: 'MaintPlant', Plant_Latitude: '56.4', Plant_Longitude: '12.4' }
    ],
    planning: [
      { Plant_Name: 'PlanningPlant', Plant_Latitude: '56.5', Plant_Longitude: '12.5' }
    ]
  };

  const mockOnPlantClick = jest.fn();

  // Z - Zero data state
  test('Z - renders nothing when no filters are true', () => {
    render(<WarehouseMarker filters={{}} plantData={{}} onPlantClick={mockOnPlantClick} />);
    expect(screen.queryByTestId('advanced-marker')).not.toBeInTheDocument();
  });

  // O - One marker rendering
  test('O - renders one marker when one filter is true', () => {
    render(<WarehouseMarker filters={{ showAll: true }} plantData={mockPlantData} onPlantClick={mockOnPlantClick} />);
    expect(screen.getByTestId('advanced-marker')).toBeInTheDocument();
  });

  // M - Multiple markers rendered
  test('M - renders multiple markers when multiple filters are true', () => {
    render(
      <WarehouseMarker
        filters={{ showAll: true, showMaint: true, showPlanning: true }}
        plantData={mockPlantData}
        onPlantClick={mockOnPlantClick}
      />
    );
    const markers = screen.getAllByTestId('advanced-marker');
    expect(markers).toHaveLength(3);
  });

  // B - Boundary lat/lng validation
  test('B - ignores invalid lat/lng values', () => {
    const invalidData = {
      all: [{ Plant_Name: 'InvalidPlant', Plant_Latitude: 'NaN', Plant_Longitude: 'NaN' }]
    };
    render(
      <WarehouseMarker
        filters={{ showAll: true }}
        plantData={invalidData}
        onPlantClick={mockOnPlantClick}
      />
    );
    expect(screen.queryByTestId('advanced-marker')).not.toBeInTheDocument();
  });

  // I - Interaction with marker
  test('I - clicking a marker calls onPlantClick', () => {
    render(
      <WarehouseMarker
        filters={{ showAll: true }}
        plantData={mockPlantData}
        onPlantClick={mockOnPlantClick}
      />
    );
    const marker = screen.getByTestId('advanced-marker');
    fireEvent.click(marker);
    expect(mockOnPlantClick).toHaveBeenCalledWith(mockPlantData.all[0]);
  });

  // E - Edge case with empty plantData lists
  test('E - renders nothing when plantData categories are empty', () => {
    render(
      <WarehouseMarker
        filters={{ showAll: true, showMaint: true, showPlanning: true }}
        plantData={{ all: [], maint: [], planning: [] }}
        onPlantClick={mockOnPlantClick}
      />
    );
    expect(screen.queryByTestId('advanced-marker')).not.toBeInTheDocument();
  });

  // S - Styling check
  test('S - includes correct Warehouse icon', () => {
    render(
      <WarehouseMarker
        filters={{ showAll: true }}
        plantData={mockPlantData}
        onPlantClick={mockOnPlantClick}
      />
    );
    const icon = screen.getByTestId('advanced-marker').querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});