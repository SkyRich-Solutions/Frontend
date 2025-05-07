

import { useState, useMemo, useEffect, useRef } from "react"
import Header from "../Components/Layout/Header"
import MaterialComponentHealthScoresComponent from "../Components/MaterialComponentHealthScoresComponent"
import Fuse from "fuse.js"

import {
  getMaterialComponentScoreSummary,
  getMaterialCategoryHealthScores,
  getMaterialCategoryPredictions,
  getMaterialComponentHealthScores,
  getMaterialCategoryScoreSummary,
  getMaintenanceForecasts,
} from "../Utils/MaterialDashboardDataHandler"

const MaterialComponentHealthScoreDashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [MaterialComponentScoreSummary, setMaterialComponentScoreSummary] = useState([])
  const [MaterialComponentHealthScores, setMaterialComponentHealthScores] = useState([])
  const [MaterialCategoryScoreSummary, setMaterialCategoryScoreSummary] = useState([])
  const [MaterialCategoryHealthScores, setMaterialCategoryHealthScores] = useState([])
  const [MaterialCategoryPredictions, setMaterialCategoryPredictions] = useState([])
  const [MaintenanceForecasts, setMaintenanceForecasts] = useState([])

  const handleItemClick = (item) => {
    setSelectedItem((prev) => (prev === item ? null : item))
  }

  const searchWrapperRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setMaterialComponentScoreSummary(await getMaterialComponentScoreSummary())
        setMaterialComponentHealthScores(await getMaterialComponentHealthScores())
        setMaterialCategoryScoreSummary(await getMaterialCategoryScoreSummary())
        setMaterialCategoryHealthScores(await getMaterialCategoryHealthScores())
        setMaterialCategoryPredictions(await getMaterialCategoryPredictions())
        setMaintenanceForecasts(await getMaintenanceForecasts())
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const allTerms = useMemo(() => {
    const termSet = new Set()
    const extractTerms = (data, keys) => {
      data.forEach((item) => {
        keys.forEach((key) => {
          if (item[key]) termSet.add(String(item[key]))
        })
      })
    }

    extractTerms(MaterialComponentScoreSummary, ["Material_ID", "TotalComponentScore"])
    extractTerms(MaterialComponentHealthScores, ["Material_ID", "HealthScore"])
    extractTerms(MaterialCategoryScoreSummary, ["Material_ID", "TotalCategoryScore"])
    extractTerms(MaterialCategoryHealthScores, ["Material_ID", "HealthScore"])
    extractTerms(MaterialCategoryPredictions, ["Category", "BayesianProbability", "MonteCarloEstimate"])
    extractTerms(MaintenanceForecasts, [
      "Forecast_ID",
      "Material_ID",
      "Plant_ID",
      "LastMaintenance",
      "AverageIntervalDays",
      "NextEstimatedMaintenanceDate",
    ])

    return [...termSet]
  }, [
    MaterialComponentScoreSummary,
    MaterialComponentHealthScores,
    MaterialCategoryScoreSummary,
    MaterialCategoryHealthScores,
    MaterialCategoryPredictions,
    MaintenanceForecasts,
  ])

  const fuse = useMemo(() => new Fuse(allTerms, { includeScore: true, threshold: 0.4 }), [allTerms])

  const suggestions = searchQuery
    ? fuse
        .search(searchQuery)
        .map((res) => res.item)
        .slice(0, 5)
    : []

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-950 overflow-hidden">
      {/* Header - consistent padding */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-900 bg-opacity-90 z-10">
        <Header title="Material Component Health Scores" />
        <div className="relative w-full md:w-1/2 max-w-md" ref={searchWrapperRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Material..."
              className="w-full bg-gray-800 text-white px-4 py-2 pr-10 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSuggestions(true)
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setShowSuggestions(false)
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/10 px-2 py-0.5 rounded text-gray-300 hover:text-white hover:bg-white/20 transition"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-50 bg-gray-900 text-white w-full mt-1 rounded-md shadow-lg border border-gray-700 max-h-40 overflow-auto">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setSearchQuery(item)
                    setShowSuggestions(false)
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Content - takes remaining height */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          {/* Top row charts - responsive grid */}
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex items-center justify-center rounded-lg h-[calc(33vh-2.5rem)]"
            >
              <MaterialComponentHealthScoresComponent
                type={
                  index === 0
                    ? "bar_MaterialComponentScoreSummary"
                    : index === 1
                      ? "bar_MaterialComponentHealthScores"
                      : "bar_MaterialCategoryScoreSummary"
                }
                selectedItem={selectedItem}
                onItemClick={handleItemClick}
                searchQuery={searchQuery}
              />
            </div>
          ))}

          {/* Two stacked charts - responsive height */}
          <div className="flex flex-col gap-4 h-[calc(66vh-5rem)]">
            {[3, 4].map((index) => (
              <div
                key={index}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex-1 flex items-center justify-center rounded-lg"
              >
                <MaterialComponentHealthScoresComponent
                  type={index === 3 ? "bar_MaterialCategoryHealthScores" : "line_MaterialCategoryPredictions"}
                  selectedItem={selectedItem}
                  onItemClick={handleItemClick}
                  searchQuery={searchQuery}
                />
              </div>
            ))}
          </div>

          {/* Large Forecast Table - spans 2 columns on larger screens */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 rounded-lg col-span-1 md:col-span-2 h-[calc(66vh-5rem)] overflow-hidden">
            <div className="w-full h-full overflow-auto">
              <MaterialComponentHealthScoresComponent
                type="table_MaintenanceForecasts"
                selectedItem={selectedItem}
                onItemClick={handleItemClick}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaterialComponentHealthScoreDashboard
