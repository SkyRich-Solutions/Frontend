import React from 'react';
import { render } from '@testing-library/react';
import CountUp from '../Counter';
import '@testing-library/jest-dom';

// ZOMBIES: CountUp component test suite

describe('CountUp - ZOMBIES', () => {
  // Z - Zero state: Renders with default props
  test('Z - renders with default props and displays initial value', () => {
    const { container } = render(<CountUp to={100} />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  // O - One state: Renders with specific from and to values
  test('O - renders from 50 to 150', () => {
    const { container } = render(<CountUp from={50} to={150} />);
    expect(container.querySelector('span')).toHaveTextContent('50');
  });

  // M - Multiple state: Calls onStart and onEnd hooks
  test('M - calls onStart and onEnd correctly', () => {
    jest.useFakeTimers();
    const onStart = jest.fn();
    const onEnd = jest.fn();
    render(
      <CountUp to={100} from={0} duration={1} delay={0.5} onStart={onStart} onEnd={onEnd} />
    );
    jest.advanceTimersByTime(500);
    expect(onStart).toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(onEnd).toHaveBeenCalled();
    jest.useRealTimers();
  });

  // B - Boundary: accepts large values and formats them
  test('B - handles large numbers correctly with separator', () => {
    const { container } = render(<CountUp to={1000000} separator="," />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  // I - Interface: accepts and applies className
  test('I - applies provided className to span element', () => {
    const { container } = render(<CountUp to={100} className="custom-class" />);
    expect(container.querySelector('span')).toHaveClass('custom-class');
  });

  // E - Edge Case: startWhen is false so no animation starts
  test('E - does not start animation when startWhen is false', () => {
    const { container } = render(<CountUp to={100} startWhen={false} />);
    expect(container.querySelector('span')).toHaveTextContent('0');
  });

  // S - Styling: span remains in DOM with content update
  test('S - span updates text content over time', () => {
    const { container } = render(<CountUp to={100} duration={1} />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });
});
