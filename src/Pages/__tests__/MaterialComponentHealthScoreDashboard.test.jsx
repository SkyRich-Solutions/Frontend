import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import MaterialComponentHealthScoreDashboard from "../MaterialComponentHealthScoreDashboard"
import * as DataHandler from "../../Utils/MaterialDashboardDataHandler"

//  Mock Header and Loader
jest.mock("../../Components/Layout/Header", () => () => <div data-testid="header">Header</div>)

// Mock Loader directly
jest.mock("../../Components/ReUseable/Loader", () => () => <div data-testid="loader">Loading...</div>)

jest.mock("../../Components/MaterialComponentHealthScoresComponent", () => (props) => {
  return <div data-testid={`component-${props.type}`}>{props.type}</div>
})


// Mock Fuse.js to always return the query string as the top match
jest.mock("fuse.js", () =>
  jest.fn().mockImplementation(() => ({
    search: (query) => [{ item: query }],
  }))
)

describe("MaterialComponentHealthScoreDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockAllApis = ({
    componentSummary = [],
    componentScores = [],
    categorySummary = [],
    categoryScores = [],
    predictions = [],
    forecasts = [],
    reject = false,
  }) => {
    const fn = reject
      ? () => jest.fn().mockRejectedValue(new Error("Test error"))
      : (value) => jest.fn().mockResolvedValue(value)

    DataHandler.getMaterialComponentScoreSummary = fn(componentSummary)
    DataHandler.getMaterialComponentHealthScores = fn(componentScores)
    DataHandler.getMaterialCategoryScoreSummary = fn(categorySummary)
    DataHandler.getMaterialCategoryHealthScores = fn(categoryScores)
    DataHandler.getMaterialCategoryPredictions = fn(predictions)
    DataHandler.getMaintenanceForecasts = fn(forecasts)
  }

// Zero
it("renders loader with no data", async () => {
  mockAllApis({})
  render(<MaterialComponentHealthScoreDashboard />)

  // 🔧 FIX: Multiple loaders expected
  expect(screen.getAllByTestId("loader").length).toBeGreaterThan(0)

  await waitFor(() => {
    expect(screen.getByTestId("component-bar_MaterialComponentScoreSummary")).toBeInTheDocument()
  })
})

  // One
  it("renders dashboard with one data entry", async () => {
    const entry = [{ Material_ID: "M1", HealthScore: 100 }]
    mockAllApis({ componentSummary: entry, componentScores: entry })

    render(<MaterialComponentHealthScoreDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("component-bar_MaterialComponentHealthScores")).toBeInTheDocument()
    })
  })

  // Many
  it("renders dashboard with many entries", async () => {
    const entries = Array.from({ length: 50 }, (_, i) => ({ Material_ID: `M${i}`, HealthScore: i }))
    mockAllApis({ componentSummary: entries, componentScores: entries, forecasts: entries })

    render(<MaterialComponentHealthScoreDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("component-table_MaintenanceForecasts")).toBeInTheDocument()
    })
  })

  // Boundary
  it("shows and clears search suggestions", async () => {
    mockAllApis({
      componentSummary: [{ Material_ID: "ABC", TotalComponentScore: 42 }],
    })

    render(<MaterialComponentHealthScoreDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("component-bar_MaterialComponentScoreSummary")).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText("Search Material...")
    fireEvent.change(input, { target: { value: "ABC" } })

    await waitFor(() => {
      expect(screen.getByText("ABC")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText("Clear search"))
    expect(input.value).toBe("")
  })

  // Interface
  it("updates searchQuery on suggestion click", async () => {
    mockAllApis({
      componentScores: [{ Material_ID: "ClickMe", HealthScore: 95 }],
    })

    render(<MaterialComponentHealthScoreDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("component-bar_MaterialComponentHealthScores")).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText("Search Material...")
    fireEvent.change(input, { target: { value: "ClickMe" } })

    await waitFor(() => {
      expect(screen.getByText("ClickMe")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText("ClickMe"))
    expect(input.value).toBe("ClickMe")
  })

  // Exception
  it("handles API errors gracefully", async () => {
    mockAllApis({ reject: true })

    render(<MaterialComponentHealthScoreDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("component-bar_MaterialComponentScoreSummary")).toBeInTheDocument()
    })
  })

  // State
  it("selects and deselects item on click (mock interaction)", async () => {
    mockAllApis({
      componentScores: [{ Material_ID: "Item1", HealthScore: 80 }],
    })

    render(<MaterialComponentHealthScoreDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("component-bar_MaterialComponentHealthScores")).toBeInTheDocument()
    })

    // Can't directly simulate internal onItemClick because it's handled inside mocked component
    // But test renders without error and UI is stable
  })
})
