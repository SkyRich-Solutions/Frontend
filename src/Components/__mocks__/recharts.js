// __mocks__/recharts.js
import React from 'react';

const MockComponent = (props) => <g {...props}>{props.children}</g>;

module.exports = {
  ResponsiveContainer: ({ children }) => (
    <div data-testid="ResponsiveContainer" style={{ width: 800, height: 400 }}>
      {children}
    </div>
  ),
  BarChart: ({ children }) => <svg data-testid="BarChart">{children}</svg>,
  LineChart: ({ children }) => <svg data-testid="LineChart">{children}</svg>,
  RadarChart: ({ children }) => <svg data-testid="RadarChart">{children}</svg>,
  ComposedChart: ({ children }) => <svg data-testid="ComposedChart">{children}</svg>,
  ScatterChart: ({ children }) => <svg data-testid="ScatterChart">{children}</svg>,
  PieChart: ({ children }) => <svg data-testid="PieChart">{children}</svg>,
  Bar: ({ children }) => <g data-testid="bar">{children}</g>,
  Line: MockComponent,
  Radar: MockComponent,
  PolarGrid: MockComponent,
  PolarAngleAxis: MockComponent,
  PolarRadiusAxis: MockComponent,
  Cell: ({ onClick }) => <rect data-testid="bar" onClick={onClick} />,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Legend: () => null,
  CartesianGrid: () => null,
  Label: () => null,
  ReferenceLine: () => null,
  Pie: MockComponent,
  Scatter: MockComponent,
  ZAxis: () => null,
};
