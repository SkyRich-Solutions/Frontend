import * as InfoWindowUtils from '../InfoWindow';

describe('InfoWindow Utils (ZOMBIES)', () => {
  let mockInfoWindow;

  beforeEach(() => {
    mockInfoWindow = { close: jest.fn() };
    InfoWindowUtils.setGlobalInfoWindow(null); // Reset state between tests
  });

  // Z - Zero
  test('closeGlobalInfoWindow does nothing if no globalInfoWindow is set', () => {
    expect(() => InfoWindowUtils.closeGlobalInfoWindow()).not.toThrow();
  });

  // O - One
  test('setGlobalInfoWindow sets the window and closes previous if exists', () => {
    const prevWindow = { close: jest.fn() };
    InfoWindowUtils.setGlobalInfoWindow(prevWindow); // 1st time
    InfoWindowUtils.setGlobalInfoWindow(mockInfoWindow); // 2nd time
    expect(prevWindow.close).toHaveBeenCalledTimes(1);
  });

  // M - Many
  test('multiple setGlobalInfoWindow calls close the previous one each time', () => {
    const win1 = { close: jest.fn() };
    const win2 = { close: jest.fn() };
    const win3 = { close: jest.fn() };

    InfoWindowUtils.setGlobalInfoWindow(win1);
    InfoWindowUtils.setGlobalInfoWindow(win2);
    InfoWindowUtils.setGlobalInfoWindow(win3);

    expect(win1.close).toHaveBeenCalledTimes(1);
    expect(win2.close).toHaveBeenCalledTimes(1);
    expect(win3.close).not.toHaveBeenCalled(); // last one is active
  });

  // B - Boundary
  test('setGlobalInfoWindow(null) still clears the previous', () => {
    const win = { close: jest.fn() };
    InfoWindowUtils.setGlobalInfoWindow(win);
    InfoWindowUtils.setGlobalInfoWindow(null);
    expect(win.close).toHaveBeenCalledTimes(1);
  });

  // I - Interface
  test('setGlobalInfoWindow calls close() on previous object', () => {
    const win = { close: jest.fn() };
    InfoWindowUtils.setGlobalInfoWindow(win);
    const newWin = { close: jest.fn() };
    InfoWindowUtils.setGlobalInfoWindow(newWin);
    expect(win.close).toHaveBeenCalled();
  });

  // E - Exception
  test('setGlobalInfoWindow doesn’t throw if previous window has no close method', () => {
    const win = {}; // no close method
    expect(() => InfoWindowUtils.setGlobalInfoWindow(win)).not.toThrow();
  });

});
