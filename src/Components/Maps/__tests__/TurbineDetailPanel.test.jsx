import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TurbineDetailPanel from '../TurbineDetailPanel';
import '@testing-library/jest-dom';

jest.mock('lucide-react', () => ({
  Wind: (props) => <svg data-testid="lucide-icon" {...props} />,
  MapPin: (props) => <svg data-testid="lucide-icon" {...props} />,
  Building: (props) => <svg data-testid="lucide-icon" {...props} />,
  Cpu: (props) => <svg data-testid="lucide-icon" {...props} />,
  Zap: (props) => <svg data-testid="lucide-icon" {...props} />,
  Factory: (props) => <svg data-testid="lucide-icon" {...props} />,
  ArrowUpDown: (props) => <svg data-testid="lucide-icon" {...props} />,
  ArrowUp: (props) => <svg data-testid="lucide-icon" {...props} />,
  ArrowLeft: (props) => <svg data-testid="lucide-icon" {...props} />,
}));

describe('TurbineDetailPanel - ZOMBIES', () => {
  const mockTurbine = {
    FunctionalLoc: 'FL-001',
    Description: 'Turbine A',
    MaintPlant: 'MP-001',
    PlanningPlant: 'PP-001',
    Platform: 'Delta4000',
    TurbineModel: 'SG 4.5-145',
    NominalPower: '4.5 MW',
    OriginalEqManufact: 'Siemens Gamesa',
    HubHeight: '110m',
    TowerHeight: '120m',
    TurbineLatitude: 55.6761,
    TurbineLongitude: 12.5683,
  };

  const mockPlant = {
    Plant_Name: 'Test Plant',
  };

  const mockPlantTurbines = [
    { ...mockTurbine, Description: 'Turbine B', FunctionalLoc: 'FL-002' },
    { ...mockTurbine, Description: 'Turbine C', FunctionalLoc: 'FL-003' },
  ];

  const mockSelect = jest.fn();

  // Z - Zero state
  test('Z - renders empty state when nothing is selected', () => {
    render(
      <TurbineDetailPanel
        selectedTurbine={null}
        selectedPlant={null}
        plantTurbines={[]}
        onTurbineSelect={mockSelect}
      />
    );
    expect(screen.getByText(/Select a turbine or plant/i)).toBeInTheDocument();
  });

  // O - One item state
  test('O - displays turbine details when selectedTurbine is provided', () => {
    render(
      <TurbineDetailPanel
        selectedTurbine={mockTurbine}
        selectedPlant={mockPlant}
        plantTurbines={[]}
        onTurbineSelect={mockSelect}
      />
    );
    expect(screen.getByText('Turbine Details')).toBeInTheDocument();
    expect(screen.getByText('Functional Location')).toBeInTheDocument();
    expect(screen.getByText('FL-001')).toBeInTheDocument();
  });

  // M - Many items and interaction
  test('M - clicking back clears selected turbine', () => {
    render(
      <TurbineDetailPanel
        selectedTurbine={mockTurbine}
        selectedPlant={mockPlant}
        plantTurbines={[]}
        onTurbineSelect={mockSelect}
      />
    );
    const backBtn = screen.getByRole('button', { name: /back to list/i });
    fireEvent.click(backBtn);
    expect(mockSelect).toHaveBeenCalledWith(null);
  });

  // B - Boundary state for list rendering
  test('B - shows all turbines for selected plant', () => {
    render(
      <TurbineDetailPanel
        selectedTurbine={null}
        selectedPlant={mockPlant}
        plantTurbines={mockPlantTurbines}
        onTurbineSelect={mockSelect}
      />
    );
    expect(screen.getByText('Turbines in Test Plant')).toBeInTheDocument();
    expect(screen.getByText('Turbine B')).toBeInTheDocument();
    expect(screen.getByText('Turbine C')).toBeInTheDocument();
  });

  // I - Interface interaction
  test('I - clicking a turbine calls onTurbineSelect', () => {
    render(
      <TurbineDetailPanel
        selectedTurbine={null}
        selectedPlant={mockPlant}
        plantTurbines={mockPlantTurbines}
        onTurbineSelect={mockSelect}
      />
    );
    const turbineCard = screen.getByText('Turbine B');
    fireEvent.click(turbineCard);
    expect(mockSelect).toHaveBeenCalledWith(mockPlantTurbines[0]);
  });

  // E - Error/fallback rendering
  test('E - renders fallback when no turbines found for selected plant', () => {
    render(
      <TurbineDetailPanel
        selectedTurbine={null}
        selectedPlant={mockPlant}
        plantTurbines={[]}
        onTurbineSelect={mockSelect}
      />
    );
    expect(screen.getByText('No turbines found for this plant.')).toBeInTheDocument();
  });

  // S - Styling expectations
  test('S - renders styling elements correctly', () => {
    render(
      <TurbineDetailPanel
        selectedTurbine={mockTurbine}
        selectedPlant={mockPlant}
        plantTurbines={[]}
        onTurbineSelect={mockSelect}
      />
    );
    const icons = screen.getAllByTestId('lucide-icon');
    expect(icons.length).toBeGreaterThanOrEqual(10);
  });
});
