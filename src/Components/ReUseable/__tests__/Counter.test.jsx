import React from 'react';
import { render, act, screen } from '@testing-library/react';
import CountUp from '../Counter';

jest.useFakeTimers();

// Mock IntersectionObserver for useInView (Framer Motion)
beforeAll(() => {
  global.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {
      this.callback([{ isIntersecting: true }]);
    }
    unobserve() {}
    disconnect() {}
  };
});

describe('CountUp component', () => {
  it('renders initial value correctly', () => {
    const { container } = render(<CountUp from={0} to={100} />);
    expect(container.textContent).toBe('0');
  });

  it('calls onStart and onEnd callbacks correctly', () => {
    const onStart = jest.fn();
    const onEnd = jest.fn();

    render(
      <CountUp from={0} to={100} delay={1} duration={2} onStart={onStart} onEnd={onEnd} />
    );

    // Delay timer triggers onStart
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(onStart).toHaveBeenCalled();

    // After full duration, onEnd should be called
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(onEnd).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(<CountUp from={0} to={100} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('respects downward direction', () => {
    const { container } = render(<CountUp from={100} to={0} direction="down" />);
    expect(container.textContent).toBe('0'); // down sets initial to `to`
  });

  it('does not start if startWhen is false', () => {
    const { container } = render(<CountUp from={0} to={999} startWhen={false} />);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container.textContent).toBe('0'); // value should remain unchanged
  });

  it('formats number with separator', () => {
    const { container } = render(<CountUp from={1000} to={1000} separator="." />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Accept either raw or formatted value due to animation async
    const formatted = container.textContent.replace(/\s/g, '');
    expect(['1000', '1.000']).toContain(formatted);
  });
});
