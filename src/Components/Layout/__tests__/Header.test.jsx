import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header component', () => {
  it('renders without crashing', () => {
    render(<Header title="Dashboard" />);
    const heading = screen.getByRole('heading', { name: /dashboard/i });
    expect(heading).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    const testTitle = 'Fault Report';
    render(<Header title={testTitle} />);
    expect(screen.getByText(testTitle)).toBeInTheDocument();
  });
});
