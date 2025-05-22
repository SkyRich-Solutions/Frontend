import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter, useLocation } from "react-router"
import RouteTitleManager from "../RoutesTitle"

// Mock document.title so we can assert on it
const originalTitle = global.document.title

afterEach(() => {
  global.document.title = originalTitle
})

function TestWrapper({ initialEntries }) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <RouteTitleManager />
      <Dummy />
    </MemoryRouter>
  )
}

function Dummy() {
  // Dummy component to ensure useLocation updates
  const location = useLocation()
  return <div data-testid="pathname">{location.pathname}</div>
}

describe("RouteTitleManager", () => {
  // Z - Zero: No matching route
  test("sets default title if path is not in routeTitles", () => {
    render(<TestWrapper initialEntries={["/non-existent"]} />)
    expect(document.title).toBe("My App")
  })

  // O - One: Single known path
  test("sets correct title for /upload", () => {
    render(<TestWrapper initialEntries={["/upload"]} />)
    expect(document.title).toBe("Upload Page")
  })

  // M - Many: Loop over known paths and validate titles
  test("sets correct title for all known routes", () => {
    const routes = {
      "/DataOverviewOfComplianceDashboard": "Overview of Compliance Dashboard",
      "/upload": "Upload Page",
      "/MaterialComponentOverviewDashboard": "Material Component Overview Dashboard",
      "/turbineDashboard": "Turbine Dashboard",
      "/MaterialComponentPredictionsDashboard": "Material Component Predictions Dashboard",
      "/MaterialComponentHealthScoreDashboard": "Material Component Health Score Dashboard",
      "/turbinePredictionsDashboard": "Turbine Predictions Dashboard",
      "/categoryClassificationDashboard": "Category Classification Dashboard",
      "/map": "Map Overview",
      "/fault-report": "Fault Report",
      "/": "Start Page",
    }

    for (const [path, expectedTitle] of Object.entries(routes)) {
      render(<TestWrapper initialEntries={[path]} />)
      expect(document.title).toBe(expectedTitle)
    }
  })

  // B - Boundary: Root route
  test("sets correct title for root path '/'", () => {
    render(<TestWrapper initialEntries={["/"]} />)
    expect(document.title).toBe("Start Page")
  })

  // I - Interface: Location is valid object
  test("location object has pathname", () => {
    const { getByTestId } = render(<TestWrapper initialEntries={["/upload"]} />)
    expect(getByTestId("pathname").textContent).toBe("/upload")
  })

  // E - Exception: Unknown path fallback
  test("falls back to 'My App' title for undefined path", () => {
    render(<TestWrapper initialEntries={["/something-weird"]} />)
    expect(document.title).toBe("My App")
  })

  // S - State: Title updates based on path
  test("updates document title when location changes", () => {
    const { unmount } = render(<TestWrapper initialEntries={["/upload"]} />)
    expect(document.title).toBe("Upload Page")

    unmount() // Cleanup previous render
    render(<TestWrapper initialEntries={["/turbineDashboard"]} />)
    expect(document.title).toBe("Turbine Dashboard")
  })

})
