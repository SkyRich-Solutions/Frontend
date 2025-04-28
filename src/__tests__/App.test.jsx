import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from '../App';

// Mock Sidebar component
jest.mock('../Components/Layout/SideBar', () => () => (
  <div data-testid="sidebar">Mock Sidebar</div>
));

// Mock Outlet from react-router
jest.mock('react-router', () => {
  const originalModule = jest.requireActual('react-router');
  return {
    ...originalModule,
    Outlet: () => <div data-testid="outlet">Mock Outlet</div>,
    useLocation: () => ({ pathname: '/' }) // mock for RouteTitleManager
  };
});

// Mock RouteTitleManager to isolate it from this test
jest.mock('../RoutesTitle', () => () => <div data-testid="title-manager">Mock RouteTitleManager</div>);

describe('App', () => {
  it('renders the layout with Sidebar and Outlet', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.getByTestId('title-manager')).toBeInTheDocument();

    // Check for gradient wrapper
    expect(document.querySelector('.bg-gradient-to-br')).toBeInTheDocument();
  });
});
