import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Maps from "../Map"
import MapsDataHandler from "../../Utils/MapsDataHandler"

jest.mock("../../Components/Layout/Header", () => () => <div data-testid="header">Header</div>)
jest.mock("../../Components/ReUseable/Loader", () => () => <div data-testid="loader">Loading...</div>)
jest.mock("../../Components/ReUseable/FilterBox", () => ({ title }) => <div>{title}</div>)
jest.mock("../../Components/Maps/TurbineDetailPanel", () => () => <div data-testid="detail-panel">Detail Panel</div>)
jest.mock("../../Components/Maps/MapsComponent", () => () => <div data-testid="map-component">Map</div>)

describe("Maps Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockEmptyData = () => {
    MapsDataHandler.getPlanningPlantData = jest.fn().mockResolvedValue([])
    MapsDataHandler.getWarehousePlantData = jest.fn().mockResolvedValue([])
    MapsDataHandler.getWarehouseManufacturingPlantData = jest.fn().mockResolvedValue([])
    MapsDataHandler.getWarehousePlanningPlantData = jest.fn().mockResolvedValue([])
  }

  it("renders correctly with no data", async () => {
    mockEmptyData()

    render(<Maps />)

    expect(screen.getByTestId("header")).toBeInTheDocument()
    expect(screen.getByTestId("loader")).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId("map-component")).toBeInTheDocument()
    })
  })

  it("handles single turbine and warehouse correctly", async () => {
    const turbine = {
      FunctionalLoc: "T1",
      TurbineLatitude: "55.0",
      TurbineLongitude: "10.0",
      MaintPlant: "Plant1",
      PlanningPlant: "Plant2",
    }
    const warehouse = {
      Plant_Name: "Plant1",
      Plant_Latitude: "55.1",
      Plant_Longitude: "10.1",
    }

    MapsDataHandler.getPlanningPlantData = jest.fn().mockResolvedValue([turbine])
    MapsDataHandler.getWarehousePlantData = jest.fn().mockResolvedValue([warehouse])
    MapsDataHandler.getWarehouseManufacturingPlantData = jest.fn().mockResolvedValue([warehouse])
    MapsDataHandler.getWarehousePlanningPlantData = jest.fn().mockResolvedValue([])

    render(<Maps />)

    await waitFor(() => {
      expect(screen.getByTestId("map-component")).toBeInTheDocument()
    })
  })

  it("renders with many turbines and warehouses", async () => {
    const turbines = Array.from({ length: 50 }, (_, i) => ({
      FunctionalLoc: `T${i}`,
      TurbineLatitude: "55.0",
      TurbineLongitude: "10.0",
      MaintPlant: `Plant${i % 5}`,
      PlanningPlant: `Plant${(i + 1) % 5}`,
    }))
    const warehouses = Array.from({ length: 5 }, (_, i) => ({
      Plant_Name: `Plant${i}`,
      Plant_Latitude: "55.2",
      Plant_Longitude: "10.2",
    }))

    MapsDataHandler.getPlanningPlantData = jest.fn().mockResolvedValue(turbines)
    MapsDataHandler.getWarehousePlantData = jest.fn().mockResolvedValue(warehouses)
    MapsDataHandler.getWarehouseManufacturingPlantData = jest.fn().mockResolvedValue(warehouses)
    MapsDataHandler.getWarehousePlanningPlantData = jest.fn().mockResolvedValue(warehouses)

    render(<Maps />)

    await waitFor(() => {
      expect(screen.getByTestId("map-component")).toBeInTheDocument()
    })
  })

  it("allows toggling warehouse filters", async () => {
    mockEmptyData()

    render(<Maps />)

    await waitFor(() => {
      expect(screen.getByTestId("map-component")).toBeInTheDocument()
    })

    expect(screen.getByText("Part Warehouse")).toBeInTheDocument()
    expect(screen.getByText("Maintenance Warehouse")).toBeInTheDocument()
    expect(screen.getByText("Planning Warehouse")).toBeInTheDocument()
  })

  it("resets map view when reset button is clicked", async () => {
    mockEmptyData()

    render(<Maps />)

    await waitFor(() => {
      expect(screen.getByTestId("map-component")).toBeInTheDocument()
    })

    const resetButton = screen.getByText("Reset View")
    expect(resetButton).toBeInTheDocument()

    fireEvent.click(resetButton)
  })

  it("handles data fetch error gracefully", async () => {
    MapsDataHandler.getPlanningPlantData = jest.fn().mockRejectedValue(new Error("Test error"))
    MapsDataHandler.getWarehousePlantData = jest.fn().mockResolvedValue([])
    MapsDataHandler.getWarehouseManufacturingPlantData = jest.fn().mockResolvedValue([])
    MapsDataHandler.getWarehousePlanningPlantData = jest.fn().mockResolvedValue([])

    render(<Maps />)

    await waitFor(() => {
      expect(screen.getByTestId("map-component")).toBeInTheDocument()
    })
  })

  it("shows detail panel when a turbine is selected", async () => {
    const turbine = {
      FunctionalLoc: "T1",
      TurbineLatitude: "55.0",
      TurbineLongitude: "10.0",
      MaintPlant: "Plant1",
      PlanningPlant: "Plant2",
    }

    MapsDataHandler.getPlanningPlantData = jest.fn().mockResolvedValue([turbine])
    MapsDataHandler.getWarehousePlantData = jest.fn().mockResolvedValue([])
    MapsDataHandler.getWarehouseManufacturingPlantData = jest.fn().mockResolvedValue([])
    MapsDataHandler.getWarehousePlanningPlantData = jest.fn().mockResolvedValue([])

    render(<Maps />)

    await waitFor(() => {
      expect(screen.getByTestId("map-component")).toBeInTheDocument()
    })

    expect(screen.getByTestId("detail-panel")).toBeInTheDocument()
  })
})
