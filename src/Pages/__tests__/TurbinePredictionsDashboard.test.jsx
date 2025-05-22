import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import TurbinePredictionsDashboard from "../TurbinePredictionsDashboard"
import * as TurbineHandler from "../../Utils/TurbineDashboardDataHandler"

jest.mock("../../Utils/TurbineDashboardDataHandler")
jest.mock("../../Components/TurbineComponentHealthScoresComponent", () => () => (
  <div data-testid="mock-chart">Chart</div>
))
jest.mock("../../Components/ReUseable/Loader", () => () => <div role="progressbar">Loading...</div>)

describe("TurbinePredictionsDashboard", () => {
  const oneEntry = [{ TurbineModel: "M1", HealthScore: 50 }]
  const manyEntries = Array.from({ length: 10 }).map((_, i) => ({
    TurbineModel: `M${i}`,
    HealthScore: 60 + i,
    TotalModelScore: 100 + i,
    Platform: `P${i}`,
    Plant: `PLANT${i}`,
    TotalPlatformScore: 200 + i,
  }))

  const setupMocks = (model = [], modelSum = [], platform = [], platformSum = [], reject = false) => {
    if (reject) {
      TurbineHandler.getTurbineModelHealthScores.mockRejectedValue(new Error("fail"))
      TurbineHandler.getTurbineModelScoreSummary.mockRejectedValue(new Error("fail"))
      TurbineHandler.getTurbinePlatformHealthScores.mockRejectedValue(new Error("fail"))
      TurbineHandler.getTurbinePlatformScoreSummary.mockRejectedValue(new Error("fail"))
    } else {
      TurbineHandler.getTurbineModelHealthScores.mockResolvedValue(model)
      TurbineHandler.getTurbineModelScoreSummary.mockResolvedValue(modelSum)
      TurbineHandler.getTurbinePlatformHealthScores.mockResolvedValue(platform)
      TurbineHandler.getTurbinePlatformScoreSummary.mockResolvedValue(platformSum)
    }
  }

  // Z - Zero
  test("renders with zero data", async () => {
    setupMocks()
    render(<TurbinePredictionsDashboard />)
    expect(await screen.findAllByRole("progressbar")).toHaveLength(6)
  })

  // O - One
  test("renders with one entry", async () => {
    setupMocks(oneEntry, oneEntry, oneEntry, oneEntry)
    render(<TurbinePredictionsDashboard />)
    await waitFor(() => expect(screen.getAllByTestId("mock-chart")).toHaveLength(6))
  })

  // M - Many
  test("renders charts with many entries", async () => {
    setupMocks(manyEntries, manyEntries, manyEntries, manyEntries)
    render(<TurbinePredictionsDashboard />)
    await waitFor(() => expect(screen.getAllByTestId("mock-chart")).toHaveLength(6))
  })

  // B - Boundary
  test("suggestions list renders max 5 items", async () => {
    setupMocks(manyEntries, manyEntries, manyEntries, manyEntries)
    render(<TurbinePredictionsDashboard />)
    await waitFor(() => screen.getByPlaceholderText("Search Material..."))

    fireEvent.change(screen.getByPlaceholderText("Search Material..."), {
      target: { value: "M" },
    })

    const suggestions = await screen.findAllByRole("listitem")
    expect(suggestions.length).toBeLessThanOrEqual(5)
  })

  // I - Interface
  test("clear button clears input", async () => {
    setupMocks(oneEntry, oneEntry, oneEntry, oneEntry)
    render(<TurbinePredictionsDashboard />)
    await waitFor(() => screen.getByPlaceholderText("Search Material..."))

    fireEvent.change(screen.getByPlaceholderText("Search Material..."), {
      target: { value: "M" },
    })
    fireEvent.click(screen.getByLabelText("Clear search"))
    expect(screen.getByPlaceholderText("Search Material...").value).toBe("")
  })

  // E - Exception
  test("handles API error gracefully", async () => {
    setupMocks([], [], [], [], true)
    render(<TurbinePredictionsDashboard />)
    await waitFor(() => screen.getByPlaceholderText("Search Material..."))
    expect(screen.getByPlaceholderText("Search Material...")).toBeInTheDocument()
  })

  // S - State
  test("clicking suggestion fills input", async () => {
    setupMocks(manyEntries, manyEntries, manyEntries, manyEntries)
    render(<TurbinePredictionsDashboard />)
    await waitFor(() => screen.getByPlaceholderText("Search Material..."))

    fireEvent.change(screen.getByPlaceholderText("Search Material..."), {
      target: { value: "P" },
    })

    const suggestion = await screen.findAllByRole("listitem")
    fireEvent.click(suggestion[0])
    expect(screen.getByPlaceholderText("Search Material...").value).toBe(suggestion[0].textContent)
  })
})
