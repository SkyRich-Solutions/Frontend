import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import TurbineDashboard from "../TurbineDashboard"
import * as TurbineHandler from "../../Utils/TurbineDashboardDataHandler"

jest.mock("../../Utils/TurbineDashboardDataHandler")
jest.mock("../../Components/TurbineOverviewComponent", () => () => <div data-testid="mock-chart">Chart</div>)
jest.mock("../../Components/ReUseable/Loader", () => () => <div role="progressbar">Loading...</div>)

describe("TurbineDashboard", () => {
  const oneTurbine = [
    {
      FunctionalLoc: "LOC1",
      Region: "Europe",
      Platform: "PLT1",
      MaintPlant: "MP1",
      PlanningPlant: "PP1",
      OriginalEqManufact: "OEM1",
    },
  ]

  const manyTurbines = Array.from({ length: 6 }).map((_, i) => ({
    FunctionalLoc: `LOC${i}`,
    Region: `Region${i}`,
    Platform: `Platform${i}`,
    MaintPlant: `MaintPlant${i}`,
    PlanningPlant: `PlanningPlant${i}`,
    OriginalEqManufact: `OEM${i}`,
  }))

  // Z - Zero: No data
  test("renders with zero data", async () => {
    TurbineHandler.getPredictionTurbineData.mockResolvedValue([])
    render(<TurbineDashboard />)
    expect(await screen.findAllByRole("progressbar")).toHaveLength(6)
  })

  // O - One: Single entry
  test("renders with one turbine entry", async () => {
    TurbineHandler.getPredictionTurbineData.mockResolvedValue(oneTurbine)
    render(<TurbineDashboard />)
    await waitFor(() => expect(screen.getAllByTestId("mock-chart")).toHaveLength(6))
  })

  // M - Many: Multiple entries
  test("renders charts with many turbine entries", async () => {
    TurbineHandler.getPredictionTurbineData.mockResolvedValue(manyTurbines)
    render(<TurbineDashboard />)
    await waitFor(() => expect(screen.getAllByTestId("mock-chart")).toHaveLength(6))
  })

  // B - Boundary: Suggestion list limits
  test("suggestions list renders max 5 items", async () => {
    TurbineHandler.getPredictionTurbineData.mockResolvedValue(manyTurbines)
    render(<TurbineDashboard />)
    await waitFor(() => screen.getByPlaceholderText("Search Turbine..."))

    fireEvent.change(screen.getByPlaceholderText("Search Turbine..."), {
      target: { value: "LOC" },
    })

    const suggestions = await screen.findAllByRole("listitem")
    expect(suggestions.length).toBeLessThanOrEqual(5)
  })

  // I - Interface: Clear button clears input
  test("clear button clears input", async () => {
    TurbineHandler.getPredictionTurbineData.mockResolvedValue(oneTurbine)
    render(<TurbineDashboard />)
    await waitFor(() => screen.getByPlaceholderText("Search Turbine..."))

    fireEvent.change(screen.getByPlaceholderText("Search Turbine..."), {
      target: { value: "LOC" },
    })
    fireEvent.click(screen.getByLabelText("Clear search"))
    expect(screen.getByPlaceholderText("Search Turbine...").value).toBe("")
  })

  // E - Exception: API error handling
  test("handles API error gracefully", async () => {
    TurbineHandler.getPredictionTurbineData.mockRejectedValue(new Error("API Error"))
    render(<TurbineDashboard />)
    await waitFor(() => screen.getByPlaceholderText("Search Turbine..."))
    expect(screen.getByPlaceholderText("Search Turbine...")).toBeInTheDocument()
  })

  // S - State: Selecting a suggestion updates input
  test("clicking suggestion fills input", async () => {
    TurbineHandler.getPredictionTurbineData.mockResolvedValue(manyTurbines)
    render(<TurbineDashboard />)
    await waitFor(() => screen.getByPlaceholderText("Search Turbine..."))

    fireEvent.change(screen.getByPlaceholderText("Search Turbine..."), {
      target: { value: "OEM" },
    })

    const suggestion = await screen.findAllByRole("listitem")
    fireEvent.click(suggestion[0])
    expect(screen.getByPlaceholderText("Search Turbine...").value).toBe(suggestion[0].textContent)
  })
})
