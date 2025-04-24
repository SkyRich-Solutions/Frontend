import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FaultReport from '../FaultReport';
import axios from 'axios';
jest.mock('axios');

describe('FaultReport Component', () => {
  const techniciansMock = [
    { Technician_ID: '1', Name: 'Alice' },
    { Technician_ID: '2', Name: 'Bob' },
  ];

  const locationsMock = [
    { Location_ID: '10', Location_Name: 'Wind Farm A' },
    { Location_ID: '11', Location_Name: 'Wind Farm B' },
  ];

  beforeEach(async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('technicians')) {
        return Promise.resolve({ data: { data: techniciansMock } });
      } else if (url.includes('locations')) {
        return Promise.resolve({ data: { data: locationsMock } });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    render(<FaultReport />);
    await waitFor(() => screen.getByRole('button', { name: /submit report/i }));
  });

  it('renders form fields after loading', async () => {
    const comboBoxes = screen.getAllByRole('combobox');
    expect(comboBoxes).toHaveLength(2); // Technician and Turbine Location

    const dateInput = document.querySelector('input[name="Report_Date"]');
    expect(dateInput).toBeInTheDocument();

    const faultType = document.querySelector('textarea[name="Fault_Type"]');
    expect(faultType).toBeInTheDocument();

    const reportStatus = document.querySelector('input[name="Report_Status"]');
    expect(reportStatus).toBeInTheDocument();

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  it('alerts if non-PDF file is uploaded', async () => {
    window.alert = jest.fn();
    const file = new File(['txt content'], 'report.txt', { type: 'text/plain' });

    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    fireEvent.submit(screen.getByRole('button', { name: /submit report/i }));
    expect(window.alert).toHaveBeenCalledWith('Only PDF files are allowed.');
  });

  it('submits form with valid PDF file', async () => {
    window.alert = jest.fn();
    axios.post.mockResolvedValue({ data: { message: 'Report submitted successfully!' } });

    const comboBoxes = screen.getAllByRole('combobox');
    fireEvent.change(comboBoxes[0], { target: { value: '1' } });
    fireEvent.change(comboBoxes[1], { target: { value: '10' } });

    const dateInput = document.querySelector('input[name="Report_Date"]');
    fireEvent.change(dateInput, { target: { value: '2025-04-24' } });

    const faultType = document.querySelector('textarea[name="Fault_Type"]');
    fireEvent.change(faultType, { target: { value: 'Blade crack' } });

    const reportStatus = document.querySelector('input[name="Report_Status"]');
    fireEvent.change(reportStatus, { target: { value: 'Pending' } });

    const validFile = new File(['pdf content'], 'report.pdf', { type: 'application/pdf' });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, {
      target: { files: [validFile] },
    });

    fireEvent.submit(screen.getByRole('button', { name: /submit report/i }));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Report submitted successfully!');
    });
  });
});