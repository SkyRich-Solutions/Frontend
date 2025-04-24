// src/components/__tests__/RouteTitleManager.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import RouteTitleManager from '../RoutesTitle';

describe('RouteTitleManager', () => {
  const renderWithRoute = (path) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="*" element={<RouteTitleManager />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('sets the document title based on route', () => {
    renderWithRoute('/upload');
    expect(document.title).toBe('Upload Page');
  });

  it('defaults to "My App" if route not in mapping', () => {
    renderWithRoute('/unknown-route');
    expect(document.title).toBe('My App');
  });

  it('sets the title for root route', () => {
    renderWithRoute('/');
    expect(document.title).toBe('Main Page');
  });
});
