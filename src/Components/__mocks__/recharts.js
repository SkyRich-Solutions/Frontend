// __mocks__/recharts.js
import React from 'react';

export const BarChart = ({ children }) => <svg data-testid="BarChart">{children}</svg>;
export const Bar = ({ children }) => <g>{children}</g>;
export const Cell = ({ onClick }) => (
  <rect data-testid="bar" onClick={onClick} />
);

export const PieChart = ({ children }) => <svg data-testid="PieChart">{children}</svg>;
export const Pie = ({ children }) => <g>{children}</g>;
export const ScatterChart = ({ children }) => <svg data-testid="ScatterChart">{children}</svg>;
export const Scatter = ({ children }) => <g>{children}</g>;

export const LineChart = ({ children }) => <svg data-testid="LineChart">{children}</svg>;
export const Line = ({ children }) => <g>{children}</g>;

export const XAxis = () => null;
export const YAxis = () => null;
export const ZAxis = () => null;
export const Tooltip = () => null;
export const Legend = () => null;
export const Label = () => null;

export const ResponsiveContainer = ({ children }) => (
  <div style={{ width: 800, height: 400 }}>{children}</div>
);
