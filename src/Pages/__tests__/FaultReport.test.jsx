import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FaultReport from '../FaultReport'
import axios from 'axios'
import '@testing-library/jest-dom'

jest.mock('axios')

const mockTechs = [{ Technician_ID: 'T001', Name: 'Jane', Surname: 'Doe' }]
const mockLocations = [{ Location_ID: 'L001', Location_Name: 'Site A' }]
const mockReports = [
  {
    Technician_ID: 'T001',
    TurbineLocation: 'L001',
    Report_Date: '2024-01-01',
    Fault_Type: 'Mechanical Fault',
    Report_Status: 'Open',
  },
]

beforeEach(() => {
  axios.get.mockImplementation((url) => {
    if (url.includes('technicians')) return Promise.resolve({ data: { data: mockTechs } })
    if (url.includes('locations')) return Promise.resolve({ data: { data: mockLocations } })
    if (url.includes('getAllFaultReports')) return Promise.resolve({ data: { data: mockReports } })
  })
})

describe('FaultReport - ZOMBIES', () => {
  test('Z - Zero state: loads and renders form', async () => {
    render(<FaultReport />)
    expect(screen.getByText(/Loading data/i)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(/Submit New Fault Report/i)).toBeInTheDocument()
    })
  })

  test('O - One report is displayed', async () => {
    render(<FaultReport />)
    await waitFor(() => {
      expect(screen.getByText('T001')).toBeInTheDocument()
      expect(screen.getAllByText('Mechanical Fault').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Open').length).toBeGreaterThan(0)
    })
  })

  test('M - Many filter options and filters by status', async () => {
    render(<FaultReport />)
    await waitFor(() => screen.getByText('T001'))

    const selects = screen.getAllByRole('combobox')
    const statusSelect = selects[selects.length - 1]
    fireEvent.change(statusSelect, { target: { value: 'Open' } })

    await waitFor(() => {
      expect(screen.getAllByText('Open').length).toBeGreaterThan(1)
    })
  })

  test('B - Boundary: no reports returned', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('getAllFaultReports')) return Promise.resolve({ data: { data: [] } })
      if (url.includes('technicians')) return Promise.resolve({ data: { data: mockTechs } })
      if (url.includes('locations')) return Promise.resolve({ data: { data: mockLocations } })
    })

    render(<FaultReport />)
    await waitFor(() => {
      expect(screen.getByText(/No reports found/i)).toBeInTheDocument()
    })
  })

  test('I - Interface fields are present', async () => {
    render(<FaultReport />)
    await waitFor(() => screen.getByText(/Submit New Fault Report/i))

    expect(screen.getAllByText(/Technician/i).some(el => el.tagName === 'LABEL')).toBe(true)
    expect(screen.getAllByText(/Turbine Location/i).some(el => el.tagName === 'LABEL')).toBe(true)
    expect(screen.getAllByText(/Report Date/i).some(el => el.tagName === 'LABEL')).toBe(true)
    expect(screen.getAllByText(/Fault Type/i).some(el => el.tagName === 'LABEL')).toBe(true)
    expect(screen.getAllByText(/Report Status/i).some(el => el.tagName === 'LABEL')).toBe(true)
    expect(screen.getAllByText(/Upload PDF Report/i).some(el => el.tagName === 'LABEL')).toBe(true)
  })

  test('E - Exception: alerts on non-PDF file', async () => {
    window.alert = jest.fn()
    render(<FaultReport />)
    await waitFor(() => screen.getByText(/Submit New Fault Report/i))

    const fileInput = document.querySelector('input[type="file"]')
    fireEvent.change(fileInput, {
      target: { files: [new File(['text'], 'note.txt', { type: 'text/plain' })] },
    })

    const button = screen.getByRole('button', { name: /submit report/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Only PDF files are allowed.')
    })
  })

  test('S - Style: applies correct container class', async () => {
    render(<FaultReport />)
    const header = await screen.findByText(/Submit New Fault Report/i)
    expect(header.closest('div')).toHaveClass('bg-gray-800')
  })
})
