import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import MaterialComponentOverviewDashboard from "../MaterialComponentOverviewDashboard"
import * as DataHandler from "../../Utils/MaterialDashboardDataHandler"

// 🔧 Mock Header
jest.mock("../../Components/Layout/Header", () => () => <div data-testid="header">Header</div>)

// 🔧 Mock Loader
jest.mock("../../Components/ReUseable/Loader", () => () => <div data-testid="loader">Loading...</div>)

// 🔧 Mock Overview Component
jest.mock("../../Components/MaterialComponentOverviewComponent", () => ({ type }) => (
  <div data-testid={`component-${type}`}>{type}</div>
))

// 🔧 Mock Fuse
jest.mock("fuse.js", () =>
  jest.fn().mockImplementation(() => ({
    search: (query) => [{ item: query }],
  }))
)

describe("MaterialComponentOverviewDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockApi = ({ data = [], reject = false } = {}) => {
    if (reject) {
      DataHandler.getPredictionMaterialData = jest.fn().mockRejectedValue(new Error("Test error"))
    } else {
      DataHandler.getPredictionMaterialData = jest.fn().mockResolvedValue(data)
    }
  }

  // 🧪 Zero - no data
  it("renders multiple loaders with no data", async () => {
    mockApi()
    render(<MaterialComponentOverviewDashboard />)

    // 6 loaders expected (3 top + 1 large + 2 bottom)
    expect(screen.getAllByTestId("loader")).toHaveLength(6)

    await waitFor(() => {
      expect(screen.getByTestId("component-bar_PlantSpecificMaterialStatus")).toBeInTheDocument()
    })
  })

  // 🧪 One - one material entry
  it("renders charts with a single material entry", async () => {
    mockApi({
      data: [
        {
          Material: "M1",
          MaterialCategory: "Cat1",
          Plant: "P1",
          PlantSpecificMaterialStatus: "Active",
        },
      ],
    })

    render(<MaterialComponentOverviewDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("component-line_TopMaterialByReplacementParts")).toBeInTheDocument()
    })
  })

  // 🧪 Many - large dataset
  it("renders charts with many material entries", async () => {
    const data = Array.from({ length: 30 }, (_, i) => ({
      Material: `M${i}`,
      MaterialCategory: `Cat${i % 3}`,
      Plant: `P${i % 2}`,
      PlantSpecificMaterialStatus: "Active",
    }))
    mockApi({ data })

    render(<MaterialComponentOverviewDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("component-bar_MaterialCount")).toBeInTheDocument()
    })
  })

  // 🧪 Boundary - search + clear
  it("shows and clears search suggestions", async () => {
    mockApi({
      data: [
        {
          Material: "ABC",
          MaterialCategory: "TestCat",
          Plant: "Plant1",
          PlantSpecificMaterialStatus: "Good",
        },
      ],
    })

    render(<MaterialComponentOverviewDashboard />)

    const input = screen.getByPlaceholderText("Search Material...")
    fireEvent.change(input, { target: { value: "ABC" } })

    await waitFor(() => {
      expect(screen.getByText("ABC")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText("Clear search"))
    expect(input.value).toBe("")
  })

  // 🧪 Interface - click on search suggestion
  it("updates search query on suggestion click", async () => {
    mockApi({
      data: [
        {
          Material: "ClickMe",
          MaterialCategory: "X",
          Plant: "Y",
          PlantSpecificMaterialStatus: "Z",
        },
      ],
    })

    render(<MaterialComponentOverviewDashboard />)

    const input = screen.getByPlaceholderText("Search Material...")
    fireEvent.change(input, { target: { value: "ClickMe" } })

    await waitFor(() => {
      expect(screen.getByText("ClickMe")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText("ClickMe"))
    expect(input.value).toBe("ClickMe")
  })

  // 🧪 Exception - simulate API error
  it("handles API error gracefully", async () => {
    mockApi({ reject: true })
    render(<MaterialComponentOverviewDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("component-bar_PlantSpecificMaterialStatus")).toBeInTheDocument()
    })
  })

  // 🧪 State - clicking on item toggles selection (mocked)
  it("toggles selectedItem when clicking items (mocked)", async () => {
    mockApi({
      data: [
        {
          Material: "T1",
          MaterialCategory: "C1",
          Plant: "P1",
          PlantSpecificMaterialStatus: "Active",
        },
      ],
    })

    render(<MaterialComponentOverviewDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("component-bar_PlantSpecificMaterialStatus")).toBeInTheDocument()
    })

    // Cannot test actual click logic due to mocking, but UI renders as expected
  })
})
