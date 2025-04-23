import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Maps from '../../Pages/Map';

// Mock the MapsDataHandler module
jest.mock('../../Utils/MapsDataHandler', () => ({
    getPlanningPlantData: jest.fn().mockResolvedValue([{ id: 1, name: 'Planning A' }]),
    getMaintPlantData: jest.fn().mockResolvedValue([{ id: 1, name: 'Maint A' }]),
}));

// Mock turbine data
jest.mock('../../MockData/TurbineData.json', () => [
    {
        id: 'T1',
        TurbineModel: 'Model X',
        NominalPower: '1500 KW',
        TurbineLatitude: 55.6,
        TurbineLongitude: 12.6,
        Region: 'North'
    }
]);

// Mock child components
jest.mock('@vis.gl/react-google-maps', () => ({
    APIProvider: ({ children }) => <div data-testid="api-provider">{children}</div>,
    Map: ({ children }) => <div data-testid="google-map">{children}</div>
}));

jest.mock('../../Components/Maps/TurbineMarker', () => () => (
    <div data-testid="turbine-markers">Turbine Markers</div>
));

jest.mock('../../Components/Maps/TurbineDetailPanel', () => () => (
    <div data-testid="turbine-detail-panel">Detail Panel</div>
));

jest.mock('../../Components/ReUseable/FilterBox', () => () => (
    <div data-testid="filter-box">Filter Box</div>
));

jest.mock('../../Components/Layout/Header', () => ({ title }) => (
    <div data-testid="header">{title}</div>
));

describe('Maps Page', () => {
    it('renders the map page layout correctly', async () => {
        render(<Maps />);

        expect(screen.getByTestId('header')).toHaveTextContent('Map');
        expect(screen.getByTestId('api-provider')).toBeInTheDocument();
        expect(screen.getByTestId('google-map')).toBeInTheDocument();
        expect(screen.getByTestId('filter-box')).toBeInTheDocument();
        expect(screen.getByTestId('turbine-detail-panel')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId('turbine-markers')).toBeInTheDocument();
        });
    });
});
