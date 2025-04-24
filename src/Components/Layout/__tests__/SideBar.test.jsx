import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Sidebar from '../SideBar';
import '@testing-library/jest-dom';

describe('Sidebar component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
  });

  test('renders minimized sidebar initially', () => {
    const menuButton = screen.getByRole('button');
    expect(menuButton).toBeInTheDocument();

    // Sidebar labels should not be visible when minimized
    expect(screen.queryByText('Overview')).not.toBeInTheDocument();
    expect(screen.queryByText('Upload')).not.toBeInTheDocument();
  });

  test('expands sidebar and shows item names on click', () => {
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton); // Simulate click to expand sidebar

    // Labels should now be visible
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByText('Maps')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Fault Report')).toBeInTheDocument();
  });

  test('renders all navigation links with correct hrefs', () => {
    const links = screen.getAllByRole('link');
    const expectedHrefs = [
      '/',
      '/upload',
      '/map',
      '/dashboard',
      '/fault-report',
    ];

    const actualHrefs = links.map((link) => link.getAttribute('href'));
    expect(actualHrefs).toEqual(expectedHrefs);
  });

  test('each icon is rendered properly', () => {
    // This assumes you've added data-testid="sidebar-icon" to each <item.icon /> in SideBar.jsx
    const icons = screen.getAllByTestId('sidebar-icon');
    expect(icons).toHaveLength(5); // Matches number of SIDEBAR_ITEMS
  });
});
