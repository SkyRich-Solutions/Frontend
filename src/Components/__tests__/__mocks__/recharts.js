// __mocks__/recharts.js
import React from 'react';

export const BarChart = ({ children }) => <g data-testid="BarChart">{children}</g>;
export const XAxis = () => <g />;
export const YAxis = () => <g />;
export const CartesianGrid = () => <g />;
export const Tooltip = () => <g />;
export const Legend = () => <g />;
export const ResponsiveContainer = ({ children }) => (
  <div style={{ width: 800, height: 400 }}>{children}</div>
);

// 👇 Inject a real click handler on the mock Bar component
export const Bar = ({ onClick }) => (
  <rect
    data-testid="bar"
    onClick={(e) => {
      onClick?.({ payload: { material_id: 'mat-001' } });
    }}
  />
);
