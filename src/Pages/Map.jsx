"use client"
import React from "react"
import { useEffect, useState, lazy, Suspense, useRef } from "react"
import Header from "../Components/Layout/Header"
import Loader from "../Components/ReUseable/Loader"
import FilterBox from "../Components/ReUseable/FilterBox"
import TurbineDetailPanel from "../Components/Maps/TurbineDetailPanel"
import MapsDataHandler from "../Utils/MapsDataHandler"
import { RefreshCw } from "lucide-react"

// Lazy load the heavy map components
const LazyMapComponent = lazy(() => import("../Components/Maps/MapsComponent"))

const Maps = () => {
  const [TurbineData, setTurbineData] = useState([])
  const [PlantData, setPlantData] = useState([])
  const [linePath, setLinePath] = useState([])
  const [SelectedTurbine, setSelectedTurbine] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [SelectedPlant, setSelectedPlant] = useState(null)
  const [PlantTurbines, setPlantTurbines] = useState([])
  const mapRef = useRef(null)

  const [Filters, setFilters] = useState({
    turbine: {
      showAll: true,
    },
    warehouse: {
      showAll: true,
      showMaint: true,
      showPlanning: true,
    },
  })

  const handleFilterChange = (e, group) => {
    const { name, checked } = e.target
    setFilters((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [name]: checked,
      },
    }))
  }

  const handleTurbineClick = (turbine) => {
    if (SelectedTurbine && SelectedTurbine.FunctionalLoc === turbine.FunctionalLoc) {
      setSelectedTurbine(null)
      setLinePath([])
    } else {
      setSelectedTurbine(turbine)
      setSelectedPlant(null) // Clear plant selection when turbine is selected directly
    }
  }

  const handlePlantClick = (plant) => {
    setSelectedTurbine(null) // Clear turbine if plant selected
    setSelectedPlant(plant)

    const associatedTurbines = TurbineData.filter(
      (turbine) => turbine.MaintPlant === plant.Plant_Name || turbine.PlanningPlant === plant.Plant_Name,
    )

    setPlantTurbines(associatedTurbines)
  }

  // New function to handle turbine selection from the detail panel
  const handleTurbineSelect = (turbine) => {
    // Set the selected turbine
    setSelectedTurbine(turbine)

    // Clear the plant selection
    setSelectedPlant(null)

    // Create coordinates for the turbine
    const turbineCoords = {
      lat: Number(turbine.TurbineLatitude),
      lng: Number(turbine.TurbineLongitude),
    }

    // Zoom to the turbine if we have a map reference
    if (mapRef.current) {
      try {
        // Pan to the turbine location
        mapRef.current.panTo(turbineCoords)

        // Zoom in to a level that shows the turbine clearly
        mapRef.current.setZoom(15)
      } catch (error) {
        console.error("Error zooming to turbine:", error)
      }
    }
  }

  const handleMapClick = () => {
    setSelectedTurbine(null)
    setSelectedPlant(null)
    setPlantTurbines([])
    setLinePath([])
  }

  const resetMapView = () => {
    if (mapRef.current) {
      try {
        // Reset to default view
        mapRef.current.setZoom(8)
        mapRef.current.panTo({ lat: 56.2, lng: 9.5 }) // Center on Denmark
      } catch (error) {
        console.error("Error resetting map view:", error)
      }
    }
    setSelectedTurbine(null)
    setSelectedPlant(null)
    setPlantTurbines([])
    setLinePath([])
  }

  // Function to set the map reference
  const setMapReference = (map) => {
    console.log("Map reference set:", map)
    mapRef.current = map
  }

  useEffect(() => {
    if (!SelectedTurbine) {
      setLinePath([])
      return
    }

    const turbineCoords = {
      lat: Number(SelectedTurbine.TurbineLatitude),
      lng: Number(SelectedTurbine.TurbineLongitude),
    }

    const haversineDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = (value) => (value * Math.PI) / 180
      const R = 6371 // Radius of Earth in km
      const dLat = toRad(lat2 - lat1)
      const dLon = toRad(lon2 - lon1)
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    }

    const getFilteredWarehouses = () => {
      let filtered = []

      if (Filters.warehouse.showAll && PlantData.all) {
        filtered = filtered.concat(PlantData.all)
      }

      if (Filters.warehouse.showMaint && PlantData.maint) {
        filtered = filtered.concat(PlantData.maint)
      }

      if (Filters.warehouse.showPlanning && PlantData.planning) {
        filtered = filtered.concat(PlantData.planning)
      }

      return filtered
    }

    const findClosestWarehouse = () => {
      const warehouses = getFilteredWarehouses()
      if (!warehouses.length || !SelectedTurbine) return null

      // Only consider warehouses that match the turbine's associated plants
      const associatedWarehouses = warehouses.filter(
        (wh) => wh.Plant_Name === SelectedTurbine.MaintPlant || wh.Plant_Name === SelectedTurbine.PlanningPlant,
      )

      if (!associatedWarehouses.length) return null

      let closest = associatedWarehouses[0]
      let minDistance = haversineDistance(
        turbineCoords.lat,
        turbineCoords.lng,
        Number(closest.Plant_Latitude),
        Number(closest.Plant_Longitude),
      )

      for (let i = 1; i < associatedWarehouses.length; i++) {
        const wh = associatedWarehouses[i]
        const dist = haversineDistance(
          turbineCoords.lat,
          turbineCoords.lng,
          Number(wh.Plant_Latitude),
          Number(wh.Plant_Longitude),
        )

        if (dist < minDistance) {
          minDistance = dist
          closest = wh
        }
      }

      return closest
    }

    const closest = findClosestWarehouse()

    if (closest) {
      const path = [
        turbineCoords,
        {
          lat: Number(closest.Plant_Latitude),
          lng: Number(closest.Plant_Longitude),
        },
      ]
      setLinePath(path)
    } else {
      setLinePath([])
    }
  }, [SelectedTurbine, PlantData, Filters.warehouse])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch data in parallel
        const [turbineData, allPlants, maintPlants, planningPlants] = await Promise.all([
          MapsDataHandler.getPlanningPlantData(),
          MapsDataHandler.getWarehousePlantData(),
          MapsDataHandler.getWarehouseManufacturingPlantData(),
          MapsDataHandler.getWarehousePlanningPlantData(),
        ])

        setTurbineData(turbineData || [])
        setPlantData({
          all: allPlants || [],
          maint: maintPlants || [],
          planning: planningPlants || [],
        })
      } catch (error) {
        console.error("Error fetching map data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-950 overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-800 shadow-md z-10">
        <Header title="Map Overview" />
        <div className="flex items-center space-x-4">
          <button
            onClick={resetMapView}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors duration-200 shadow-sm"
          >
            <RefreshCw size={16} />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map Section */}
        <div className="flex-1 relative">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <Loader upload />
              </div>
            }
          >
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <Loader upload />
              </div>
            ) : (
              <LazyMapComponent
                turbineData={TurbineData}
                plantData={PlantData}
                filters={Filters}
                linePath={linePath}
                onTurbineClick={handleTurbineClick}
                onPlantClick={handlePlantClick}
                onMapClick={handleMapClick}
                setMapRef={setMapReference}
              />
            )}
          </Suspense>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col w-[350px] bg-gray-900 text-white border-l border-gray-800 shadow-xl overflow-hidden">
          {/* Filter Sections */}
          <div className="p-5 space-y-5 overflow-y-auto">
            {/* Turbine Filtering */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-lg border border-gray-700 p-4 rounded-lg">
              <div className="flex justify-center w-full mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Turbine Filters</h3>
              </div>
              <FilterBox
                title="All Turbines"
                group="turbine"
                filterKey="showAll"
                filters={Filters.turbine}
                onChange={handleFilterChange}
              />
            </div>

            {/* Warehouse Filtering */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-lg border border-gray-700 p-4 rounded-lg">
              <div className="flex justify-center w-full mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Warehouse Filters</h3>
              </div>
              <div className="space-y-2">
                <FilterBox
                  title="Part Warehouse"
                  filterKey="showAll"
                  group="warehouse"
                  filters={Filters.warehouse}
                  onChange={handleFilterChange}
                  color="bg-gray-500"
                />
                <FilterBox
                  title="Maintenance Warehouse"
                  filterKey="showMaint"
                  group="warehouse"
                  filters={Filters.warehouse}
                  onChange={handleFilterChange}
                  color="bg-red-500"
                />
                <FilterBox
                  title="Planning Warehouse"
                  filterKey="showPlanning"
                  group="warehouse"
                  filters={Filters.warehouse}
                  onChange={handleFilterChange}
                  color="bg-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="flex-1 overflow-hidden border-t border-gray-800">
            <TurbineDetailPanel
              selectedTurbine={SelectedTurbine}
              selectedPlant={SelectedPlant}
              plantTurbines={PlantTurbines}
              onTurbineSelect={handleTurbineSelect}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Maps
