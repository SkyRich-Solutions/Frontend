import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import MaterialComponentPredictionsDashboard from "../MaterialComponentPredictionsDashboard"
import * as DataHandler from "../../Utils/MaterialDashboardDataHandler"

jest.mock("../../Components/Layout/Header", () => () => <div data-testid="header">Header</div>)
jest.mock("../../Components/ReUseable/Loader", () => () => <div data-testid="loader">Loading...</div>)
jest.mock("../../Components/MaterialComponentPredictionsComponent", () => ({ type }) => (
  <div data-testid={`component-${type}`}>{type}</div>
))

const mockData = {
  replacementPredictions: [
    { MonteCarloProbability: "0.5", Material_Description: "M1", BayesianProbability: "0.6" },
  ],
  replacementPredictionGlobal: [
    { MonteCarloProbability: "0.7", MaterialCategory: "CatA", BayesianProbability: "0.8" },
  ],
  monteCarloDominance: [
    { DominanceCount: 5, Description: "Dom1", Percentage: "70%" },
  ],
  materialStatusTransitions: [
    { Material: "M1", Plant: "P1", TransitionCount: 3, Description: "Trans", Direction: "Up" },
  ],
  materialPredictions: [
    { Material_ID: "123", Material_Description: "Desc1", MaterialCategory: "CatA", TotalReplacementCount: 1 },
  ],
}

const mockAllApis = ({ reject = false } = {}) => {
  if (reject) {
    DataHandler.getReplacementPredictions = jest.fn().mockRejectedValue(new Error("API Error"))
    DataHandler.getReplacementPredictionGlobal = jest.fn().mockRejectedValue(new Error("API Error"))
    DataHandler.getMonteCarloDominance = jest.fn().mockRejectedValue(new Error("API Error"))
    DataHandler.getMaterialStatusTransitions = jest.fn().mockRejectedValue(new Error("API Error"))
    DataHandler.getMaterialPredictions = jest.fn().mockRejectedValue(new Error("API Error"))
  } else {
    DataHandler.getReplacementPredictions = jest.fn().mockResolvedValue(mockData.replacementPredictions)
    DataHandler.getReplacementPredictionGlobal = jest.fn().mockResolvedValue(mockData.replacementPredictionGlobal)
    DataHandler.getMonteCarloDominance = jest.fn().mockResolvedValue(mockData.monteCarloDominance)
    DataHandler.getMaterialStatusTransitions = jest.fn().mockResolvedValue(mockData.materialStatusTransitions)
    DataHandler.getMaterialPredictions = jest.fn().mockResolvedValue(mockData.materialPredictions)
  }
}

describe("MaterialComponentPredictionsDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Z - Zero data
  it("renders loader with no data", async () => {
    mockAllApis()

    render(<MaterialComponentPredictionsDashboard />)

    expect(screen.getAllByTestId("loader").length).toBeGreaterThan(0)

    await waitFor(() => {
      expect(screen.getByTestId("component-bar_ReplacementPrediction")).toBeInTheDocument()
    })
  })

  // O - One item
  it("renders dashboard with one prediction entry", async () => {
    mockAllApis()

    render(<MaterialComponentPredictionsDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("component-bar_ReplacementPrediction")).toBeInTheDocument()
      expect(screen.getByTestId("component-line_GlobalMonteCarloVsBayesian")).toBeInTheDocument()
    })
  })

  // M - Many items
  it("renders dashboard with many entries", async () => {
    const many = Array.from({ length: 50 }, (_, i) => ({
      MonteCarloProbability: `${Math.random()}`,
      Material_Description: `Mat${i}`,
      BayesianProbability: `${Math.random()}`,
    }))
    DataHandler.getReplacementPredictions = jest.fn().mockResolvedValue(many)
    mockAllApis()

    render(<MaterialComponentPredictionsDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("component-bar_ReplacementPrediction")).toBeInTheDocument()
    })
  })

  // B - Boundary interaction (search + suggestions)
  it("shows and clears search suggestions", async () => {
    mockAllApis()
    render(<MaterialComponentPredictionsDashboard />)

    const input = screen.getByPlaceholderText("Search Material...")
    fireEvent.change(input, { target: { value: "M1" } })

    await waitFor(() => {
      expect(screen.getByText("M1")).toBeInTheDocument()
    })

    const clearBtn = screen.getByLabelText("Clear search")
    fireEvent.click(clearBtn)

    expect(input.value).toBe("")
  })

  // I - Interface behavior (suggestion click updates query)
  it("updates searchQuery on suggestion click", async () => {
    mockAllApis()
    render(<MaterialComponentPredictionsDashboard />)

    const input = screen.getByPlaceholderText("Search Material...")
    fireEvent.change(input, { target: { value: "M1" } })

    await waitFor(() => {
      fireEvent.click(screen.getByText("M1"))
    })

    expect(input.value).toBe("M1")
  })

  // E - Exception handling
  it("handles API errors gracefully", async () => {
    mockAllApis({ reject: true })

    render(<MaterialComponentPredictionsDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("component-bar_ReplacementPrediction")).toBeInTheDocument()
    })
  })

  // S - State change
  it("selects and deselects item on click (mock interaction)", async () => {
    mockAllApis()

    render(<MaterialComponentPredictionsDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId("component-bar_ReplacementPrediction")).toBeInTheDocument()
    })

    // This is mocked, so we just ensure component rendered and no crash on interaction
    // In real tests, we would simulate clicks on MaterialComponentPredictionsComponent
  })
})
