import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { Outlet } from 'react-router-dom';

// Mock Sidebar component
jest.mock('../Components/Layout/SideBar', () => () => (
  <div data-testid="sidebar">Mock Sidebar</div>
));

// Mock Outlet from react-router-dom
jest.mock('react-router', () => {
  const originalModule = jest.requireActual('react-router');
  return {
    ...originalModule,
    Outlet: () => <div data-testid="outlet">Mock Outlet</div>,
  };
});

describe('App', () => {
  it('renders the layout with Sidebar and Outlet', () => {
    render(<App />);

    const sidebar = screen.getByTestId('sidebar');
    const outlet = screen.getByTestId('outlet');

    expect(sidebar).toBeInTheDocument();
    expect(outlet).toBeInTheDocument();

    // Optional: Check for gradient/background wrapper
    expect(document.querySelector('.bg-gradient-to-br')).toBeInTheDocument();
  });
});
