import React from "react"
import { render, screen } from "@testing-library/react"
import App from "../App"

// Mock SideBar to avoid rendering the real one
jest.mock("../Components/Layout/SideBar", () => () => <div data-testid="sidebar">Sidebar</div>)

// Mock RouteTitleManager if it does anything
jest.mock("../RoutesTitle", () => () => <div data-testid="route-title">RouteTitleManager</div>)

// Mock react-router (NOT react-router-dom) to provide Outlet
jest.mock("react-router", () => ({
  Outlet: () => <div data-testid="outlet">Outlet</div>
}))

describe("App", () => {
  test("renders sidebar, route title, and outlet", () => {
    render(<App />)

    expect(screen.getByTestId("sidebar")).toBeInTheDocument()
    expect(screen.getByTestId("route-title")).toBeInTheDocument()
    expect(screen.getByTestId("outlet")).toBeInTheDocument()
  })
})
