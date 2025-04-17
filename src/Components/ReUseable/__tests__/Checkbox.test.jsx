import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChechBox from '../ChechBox';
import '@testing-library/jest-dom';

describe('ChechBox component', () => {
  const setup = (props = {}) => {
    const defaultProps = {
      checked: false,
      onChange: jest.fn(),
      name: 'example-checkbox',
      ...props,
    };

    render(<ChechBox {...defaultProps} />);
    const checkbox = screen.getByLabelText('', { selector: 'input[type="checkbox"]' });
    return { checkbox, props: defaultProps };
  };

  it('renders without crashing', () => {
    const { checkbox } = setup();
    expect(checkbox).toBeInTheDocument();
  });

  it('renders checked state correctly', () => {
    const { checkbox } = setup({ checked: true });
    expect(checkbox).toBeChecked();
  });

  it('renders unchecked state correctly', () => {
    const { checkbox } = setup({ checked: false });
    expect(checkbox).not.toBeChecked();
  });

  it('fires onChange when clicked', () => {
    const { checkbox, props } = setup();
    fireEvent.click(checkbox);
    expect(props.onChange).toHaveBeenCalledTimes(1);
  });

  it('assigns the correct name prop', () => {
    const { checkbox, props } = setup({ name: 'custom-checkbox' });
    expect(checkbox).toHaveAttribute('name', props.name);
  });

  it('renders the custom checkmark element', () => {
    const { container } = render(<ChechBox checked={false} onChange={() => {}} name="test" />);
    const checkmark = container.querySelector('.checkmark');
    expect(checkmark).toBeInTheDocument();
  });
});
