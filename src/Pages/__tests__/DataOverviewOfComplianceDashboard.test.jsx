import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DataOverviewOfComplianceDashboard from '../../Pages/DataOverviewOfComplianceDashboard';
import DataHandler from '../../Utils/DataHandler';
import '@testing-library/jest-dom';

jest.mock('../../Utils/DataHandler');
jest.mock('../../Components/ReUseable/PieChart', () => ({ text }) => (
  <div data-testid="mock-chart">{text}</div>
));
jest.mock('../../Components/Layout/Header', () => ({ title }) => (
  <h1>{title}</h1>
));

const mockValue = (label) => [{ total_violations: label.length }];

beforeEach(() => {
  DataHandler.mockImplementation(() => ({
    getMaterialReplacementPartsViolations: jest.fn().mockResolvedValue(mockValue('m1')),
    getMaterialCompliantReplacementParts: jest.fn().mockResolvedValue(mockValue('m2')),
    getMaterialUnclassified: jest.fn().mockResolvedValue(mockValue('m3')),
    getMaterialClassified: jest.fn().mockResolvedValue(mockValue('m4')),
    getMaterialUnknownPlant: jest.fn().mockResolvedValue(mockValue('m5')),
    getMaterialKnownPlant: jest.fn().mockResolvedValue(mockValue('m6')),
    getTurbineUnknownMaintPlantViolation: jest.fn().mockResolvedValue(mockValue('t1')),
    getTurbineKnownMaintPlant: jest.fn().mockResolvedValue(mockValue('t2')),
    getTurbineKnownPlanningPlant: jest.fn().mockResolvedValue(mockValue('t3')),
    getTurbineUnknownPlanningPlantViolation: jest.fn().mockResolvedValue(mockValue('t4')),
    getTurbineUnKnownLocation: jest.fn().mockResolvedValue(mockValue('t5')),
    getTurbineKnownLocation: jest.fn().mockResolvedValue(mockValue('t6')),
  }));
});

describe('DataOverviewOfComplianceDashboard - ZOMBIES', () => {
  test('Z - shows placeholder charts during loading', async () => {
    render(<DataOverviewOfComplianceDashboard />);
    expect(await screen.findAllByTestId('mock-chart')).toHaveLength(6);
  });

  test('O - renders header and charts with correct labels', async () => {
    render(<DataOverviewOfComplianceDashboard />);
    expect(screen.getByText('Overview of Compliance')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Replacement Parts')).toBeInTheDocument();
      expect(screen.getByText('Material Classifications')).toBeInTheDocument();
      expect(screen.getByText("Material Plant ID's")).toBeInTheDocument();
      expect(screen.getByText('Maintenance Plant')).toBeInTheDocument();
      expect(screen.getByText('Planning Plant')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
    });
  });

  test('M - handles multiple chart components correctly', async () => {
    render(<DataOverviewOfComplianceDashboard />);
    const charts = await screen.findAllByTestId('mock-chart');
    expect(charts).toHaveLength(6);
  });

  test('B - renders with 0s when API returns empty data', async () => {
    DataHandler.mockImplementation(() => ({
      getMaterialReplacementPartsViolations: jest.fn().mockResolvedValue([]),
      getMaterialCompliantReplacementParts: jest.fn().mockResolvedValue([]),
      getMaterialUnclassified: jest.fn().mockResolvedValue([]),
      getMaterialClassified: jest.fn().mockResolvedValue([]),
      getMaterialUnknownPlant: jest.fn().mockResolvedValue([]),
      getMaterialKnownPlant: jest.fn().mockResolvedValue([]),
      getTurbineUnknownMaintPlantViolation: jest.fn().mockResolvedValue([]),
      getTurbineKnownMaintPlant: jest.fn().mockResolvedValue([]),
      getTurbineKnownPlanningPlant: jest.fn().mockResolvedValue([]),
      getTurbineUnknownPlanningPlantViolation: jest.fn().mockResolvedValue([]),
      getTurbineUnKnownLocation: jest.fn().mockResolvedValue([]),
      getTurbineKnownLocation: jest.fn().mockResolvedValue([]),
    }));

    render(<DataOverviewOfComplianceDashboard />);
    const charts = await screen.findAllByTestId('mock-chart');
    expect(charts).toHaveLength(6);
  });

  test('I - interface shows correct section headers', () => {
    render(<DataOverviewOfComplianceDashboard />);
    expect(screen.getByText('Material')).toBeInTheDocument();
    expect(screen.getByText('Turbine')).toBeInTheDocument();
  });

  test('E - error during fetch logs to console', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    DataHandler.mockImplementation(() => ({
      getMaterialReplacementPartsViolations: jest.fn().mockRejectedValue(new Error('fail')),
      getMaterialCompliantReplacementParts: jest.fn().mockResolvedValue([]),
      getMaterialUnclassified: jest.fn().mockResolvedValue([]),
      getMaterialClassified: jest.fn().mockResolvedValue([]),
      getMaterialUnknownPlant: jest.fn().mockResolvedValue([]),
      getMaterialKnownPlant: jest.fn().mockResolvedValue([]),
      getTurbineUnknownMaintPlantViolation: jest.fn().mockResolvedValue([]),
      getTurbineKnownMaintPlant: jest.fn().mockResolvedValue([]),
      getTurbineKnownPlanningPlant: jest.fn().mockResolvedValue([]),
      getTurbineUnknownPlanningPlantViolation: jest.fn().mockResolvedValue([]),
      getTurbineUnKnownLocation: jest.fn().mockResolvedValue([]),
      getTurbineKnownLocation: jest.fn().mockResolvedValue([]),
    }));

    render(<DataOverviewOfComplianceDashboard />);
    await waitFor(() => expect(errorSpy).toHaveBeenCalled());
    errorSpy.mockRestore();
  });

  test('S - styling: component has Tailwind grid and flex classes', async () => {
    const { container } = render(<DataOverviewOfComplianceDashboard />);
    await screen.findAllByTestId('mock-chart');
    expect(container.querySelector('.flex')).toBeInTheDocument();
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });
});