import React from 'react';
import { render } from '@testing-library/react';
import ConnectionLine from '../ConnectingLine';
import '@testing-library/jest-dom';

const mockSetMap = jest.fn();
const mockSetDirections = jest.fn();
const mockOpen = jest.fn();

beforeAll(() => {
  global.google = {
    maps: {
      DirectionsService: jest.fn().mockImplementation(() => ({
        route: (options, callback) => {
          callback({
            routes: [
              {
                legs: [
                  {
                    distance: { text: '10 km' },
                    duration: { text: '15 mins' },
                  },
                ],
                overview_path: [
                  { lat: () => 0, lng: () => 0 },
                  { lat: () => 1, lng: () => 1 },
                ],
              },
            ],
          }, 'OK');
        },
      })),
      DirectionsRenderer: jest.fn().mockImplementation(() => ({
        setMap: mockSetMap,
        setDirections: mockSetDirections,
      })),
      InfoWindow: jest.fn().mockImplementation(() => ({
        open: mockOpen,
      })),
      TravelMode: {
        DRIVING: 'DRIVING',
      },
      DirectionsStatus: {
        OK: 'OK',
      },
      geometry: {
        spherical: {
          computeLength: jest.fn(() => 1000),
          computeDistanceBetween: jest.fn(() => 500),
          interpolate: jest.fn(() => ({ lat: () => 0.5, lng: () => 0.5 })),
        },
      },
    },
  };
});

jest.mock('@vis.gl/react-google-maps', () => ({
  useMap: () => ({}),
}));

jest.mock('../../../Utils/InfoWindow', () => ({
  closeGlobalInfoWindow: jest.fn(),
  setGlobalInfoWindow: jest.fn(),
}));

describe('ConnectionLine - ZOMBIES', () => {
  test('Z - renders without crashing', () => {
    render(<ConnectionLine origin={{ lat: 0, lng: 0 }} destination={{ lat: 1, lng: 1 }} />);
    expect(true).toBe(true);
  });

  test('O - initializes Google Maps services when props are set', () => {
    render(<ConnectionLine origin={{ lat: 5, lng: 5 }} destination={{ lat: 6, lng: 6 }} />);
    expect(google.maps.DirectionsService).toHaveBeenCalled();
    expect(google.maps.DirectionsRenderer).toHaveBeenCalled();
  });

  test('M - re-renders with updated props without crashing', () => {
    const { rerender } = render(<ConnectionLine origin={{ lat: 1, lng: 1 }} destination={{ lat: 2, lng: 2 }} />);
    rerender(<ConnectionLine origin={{ lat: 3, lng: 3 }} destination={{ lat: 4, lng: 4 }} />);
    expect(true).toBe(true);
  });

  test('B - handles missing origin/destination props gracefully', () => {
    mockSetMap.mockClear();
    render(<ConnectionLine origin={null} destination={null} />);
    expect(mockSetMap).toHaveBeenCalledTimes(0);
  });


  test('I - opens an info window when rendering succeeds', () => {
    render(<ConnectionLine origin={{ lat: 7, lng: 7 }} destination={{ lat: 8, lng: 8 }} />);
    expect(mockOpen).toHaveBeenCalled();
  });

  test('E - handles failed directions response without crash', () => {
    google.maps.DirectionsService.mockImplementationOnce(() => ({
      route: (_, cb) => cb(null, 'FAIL'),
    }));
    render(<ConnectionLine origin={{ lat: 0, lng: 0 }} destination={{ lat: 1, lng: 1 }} />);
    expect(true).toBe(true);
  });

  test('S - includes styled HTML in InfoWindow content', () => {
    render(<ConnectionLine origin={{ lat: 9, lng: 9 }} destination={{ lat: 10, lng: 10 }} />);
    expect(google.maps.InfoWindow).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining('Route Details'),
      })
    );
  });
});
