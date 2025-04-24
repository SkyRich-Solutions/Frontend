import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Upload from '../Upload';
import '@testing-library/jest-dom';

describe('Upload Component', () => {
  it('renders the Upload button and input', () => {
    render(<Upload />);
    const button = screen.getByText('Upload File');
    const fileInput = screen.getByRole('button').querySelector('input[type="file"]');

    expect(button).toBeInTheDocument();
    expect(fileInput).toBeInTheDocument();
  });

  it('accepts a file when uploaded', () => {
    render(<Upload />);
    const fileInput = screen.getByRole('button').querySelector('input[type="file"]');

    const mockFile = new File(['dummy content'], 'example.txt', { type: 'text/plain' });

    // Simulate file upload
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Assert file input is updated
    expect(fileInput.files[0]).toBe(mockFile);
    expect(fileInput.files).toHaveLength(1);
  });
});
