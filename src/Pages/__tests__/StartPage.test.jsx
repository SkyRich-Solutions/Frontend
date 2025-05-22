import React from "react"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import StartPage from "../StartPage"
import * as MaterialHandler from "../../Utils/MaterialDashboardDataHandler"
import * as TurbineHandler from "../../Utils/TurbineDashboardDataHandler"

jest.mock("../../Utils/MaterialDashboardDataHandler")
jest.mock("../../Utils/TurbineDashboardDataHandler")

describe("StartPage", () => {
  const materialData = [
    { Material_ID: "Mat1", HealthScore: 45 },
    { Material_ID: "Mat2", HealthScore: 60 },
  ]

  const turbineData = [
    { ModelHealthScore_ID: "Turb1", HealthScore: 48 },
    { ModelHealthScore_ID: "Turb2", HealthScore: 68 },
  ]

  const setupMocks = (material = materialData, turbine = turbineData, reject = false) => {
    if (reject) {
      MaterialHandler.getMaterialComponentHealthScores.mockRejectedValue(new Error("API Error"))
      TurbineHandler.getTurbineModelHealthScores.mockRejectedValue(new Error("API Error"))
    } else {
      MaterialHandler.getMaterialComponentHealthScores.mockResolvedValue(material)
      TurbineHandler.getTurbineModelHealthScores.mockResolvedValue(turbine)
    }
  }

  test("renders loader with no data", async () => {
    setupMocks()
    render(<StartPage />)

    const spinners = document.getElementsByClassName("animate-spin")
    expect(spinners.length).toBeGreaterThan(0)

    await waitFor(() => screen.getByText("Material Components"))
  })

  test("renders dashboard with one data entry", async () => {
    setupMocks([materialData[0]], [turbineData[0]])
    render(<StartPage />)
    await waitFor(() => {
      expect(screen.getByText("Mat1")).toBeInTheDocument()
      expect(screen.getByText("Turb1")).toBeInTheDocument()
    })
  })

    test("renders dashboard with many entries", async () => {
    setupMocks()
    render(<StartPage />)

    // Wait for initial critical data
    await waitFor(() => {
        expect(screen.getByText("Mat1")).toBeInTheDocument()
        expect(screen.getByText("Turb1")).toBeInTheDocument()
    })

    // Change filter to show "Medium" results too
    fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "Medium" },
    })

    // Now Mat2 and Turb2 should appear
    expect(await screen.findByText("Mat2")).toBeInTheDocument()
    expect(await screen.findByText("Turb2")).toBeInTheDocument()
    })

  test("handles API errors gracefully", async () => {
    setupMocks([], [], true)
    render(<StartPage />)
    await waitFor(() => {
      expect(screen.getByText("Material Components")).toBeInTheDocument()
      expect(screen.getByText("Turbine Models")).toBeInTheDocument()
    })
  })

  test("filters data by Medium status", async () => {
    setupMocks()
    render(<StartPage />)
    await waitFor(() => screen.getByText("Material Components"))

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Medium" },
    })

    expect(await screen.findByText("Mat2")).toBeInTheDocument()
    expect(screen.queryByText("Mat1")).not.toBeInTheDocument()
  })

  test("filters data by Critical status", async () => {
    setupMocks()
    render(<StartPage />)
    await waitFor(() => screen.getByText("Material Components"))

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Critical" },
    })

    expect(await screen.findByText("Mat1")).toBeInTheDocument()
    expect(screen.queryByText("Mat2")).not.toBeInTheDocument()
  })

  test("renders no data message when no matches", async () => {
    setupMocks([], [])
    render(<StartPage />)
    await waitFor(() => {
      expect(screen.getAllByText("No data available for the selected filter.").length).toBe(2)
    })
  })
})
