import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ConnectionLine from '../ConnectingLine';

// Mock useMap from @vis.gl/react-google-maps
jest.mock('@vis.gl/react-google-maps', () => ({
  useMap: jest.fn()
}));

// Create a mock for Polyline
const setMapMock = jest.fn();
const PolylineMock = jest.fn().mockImplementation(() => ({
  setMap: setMapMock
}));

// Assign the mock to global window.google
beforeAll(() => {
  global.window.google = {
    maps: {
      Polyline: PolylineMock
    }
  };
});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('ConnectionLine', () => {
  const mockMap = { setMap: jest.fn() };
  const mockPath = [
    { lat: 10, lng: 20 },
    { lat: 30, lng: 40 }
  ];

  it('renders and initializes a polyline when map and path are valid', () => {
    const { useMap } = require('@vis.gl/react-google-maps');
    useMap.mockReturnValue(mockMap);

    render(<ConnectionLine path={mockPath} />);

    expect(PolylineMock).toHaveBeenCalledWith({
      path: mockPath,
      geodesic: true,
      strokeOpacity: 0,
      strokeWeight: 2,
      icons: [
        {
          icon: {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 4
          },
          offset: '0',
          repeat: '10px'
        }
      ],
      map: mockMap
    });
  });

  it('cleans up polyline on unmount', () => {
    const { useMap } = require('@vis.gl/react-google-maps');
    useMap.mockReturnValue(mockMap);

    const { unmount } = render(<ConnectionLine path={mockPath} />);
    unmount();

    expect(setMapMock).toHaveBeenCalledWith(null);
  });

  it('does not create a polyline if map is not available', () => {
    const { useMap } = require('@vis.gl/react-google-maps');
    useMap.mockReturnValue(null);

    render(<ConnectionLine path={mockPath} />);
    expect(PolylineMock).not.toHaveBeenCalled();
  });

  it('does not create a polyline if path is too short', () => {
    const { useMap } = require('@vis.gl/react-google-maps');
    useMap.mockReturnValue(mockMap);

    render(<ConnectionLine path={[{ lat: 10, lng: 20 }]} />);
    expect(PolylineMock).not.toHaveBeenCalled();
  });
});
