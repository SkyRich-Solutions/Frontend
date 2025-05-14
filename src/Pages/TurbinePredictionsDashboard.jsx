import { useState, useMemo, useEffect, useRef } from "react"
import Header from "../Components/Layout/Header"
import TurbineComponentHealthScoresComponent from "../Components/TurbineComponentHealthScoresComponent"
import Loader from "../Components/ReUseable/Loader"
import Fuse from "fuse.js"
import {
  getTurbineModelHealthScores,
  getTurbineModelScoreSummary,
  getTurbinePlatformHealthScores,
  getTurbinePlatformScoreSummary,
} from "../Utils/TurbineDashboardDataHandler"

const TurbinePredictionsDashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [TurbineModelHealthScores, setTurbineModelHealthScores] = useState([])
  const [TurbineModelScoreSummary, setTurbineModelScoreSummary] = useState([])
  const [TurbinePlatformHealthScores, setTurbinePlatformHealthScores] = useState([])
  const [TurbinePlatformScoreSummary, setTurbinePlatformScoreSummary] = useState([])

  const handleItemClick = (item) => {
    setSelectedItem((prev) => (prev === item ? null : item))
  }

  const searchWrapperRef = useRef(null)
  const chartContainerRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (chartContainerRef.current && !chartContainerRef.current.contains(e.target)) {
        setSelectedItem(null) // Clear selection
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        setTurbineModelHealthScores(await getTurbineModelHealthScores())
        setTurbineModelScoreSummary(await getTurbineModelScoreSummary())
        setTurbinePlatformHealthScores(await getTurbinePlatformHealthScores())
        setTurbinePlatformScoreSummary(await getTurbinePlatformScoreSummary())
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
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

    extractTerms(TurbineModelHealthScores, ["TurbineModel", "HealthScore"])
    extractTerms(TurbineModelScoreSummary, ["TurbineModel", "TotalModelScore"])
    extractTerms(TurbinePlatformHealthScores, ["Platform", "Plant", "HealthScore"])
    extractTerms(TurbinePlatformScoreSummary, ["Platform", "TotalPlatformScore"])

    return [...termSet]
  }, [TurbineModelHealthScores, TurbineModelScoreSummary, TurbinePlatformHealthScores, TurbinePlatformScoreSummary])

  const fuse = useMemo(() => new Fuse(allTerms, { includeScore: true, threshold: 0.4 }), [allTerms])

  const suggestions = searchQuery
    ? fuse
        .search(searchQuery)
        .map((res) => res.item)
        .slice(0, 5)
    : []

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-950 overflow-hidden">
      {/* Header - fixed height */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-900 bg-opacity-90 z-10">
        <Header title="Turbine Model Health Scores" />
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

      {/* Main content - flexible height */}
      <div className="flex-1 p-4 overflow-hidden" ref={chartContainerRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          {/* Top row charts - responsive layout */}
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 rounded-lg flex items-center justify-center h-[calc(33vh-2.5rem)]"
            >
              {isLoading ? (
                <Loader upload />
              ) : (
                <TurbineComponentHealthScoresComponent
                  type={
                    index === 0
                      ? "bar_TurbineModelHealthScores"
                      : index === 1
                        ? "line_TurbineModelHealthScores"
                        : "bar_TurbineModelScoreSummary"
                  }
                  selectedItem={selectedItem}
                  onItemClick={handleItemClick}
                  searchQuery={searchQuery}
                />
              )}
            </div>
          ))}

          {/* Middle-left charts - responsive layout */}
          <div className="flex flex-col gap-4 h-[calc(66vh-5rem)]">
            {[3, 4].map((index) => (
              <div
                key={index}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 rounded-lg flex-1 flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader upload />
                ) : (
                  <TurbineComponentHealthScoresComponent
                    type={index === 3 ? "bubble_PlatformHealthScores" : "bar_TurbinePlatformScoreSummary"}
                    selectedItem={selectedItem}
                    onItemClick={handleItemClick}
                    searchQuery={searchQuery}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Large square chart - spans 2 columns on larger screens */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 rounded-lg flex items-center justify-center col-span-1 md:col-span-2 h-[calc(66vh-5rem)]">
            {isLoading ? (
              <Loader upload />
            ) : (
              <TurbineComponentHealthScoresComponent
                type="radar_TurbineModelHealthScores_ByPlant"
                selectedItem={selectedItem}
                onItemClick={handleItemClick}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TurbinePredictionsDashboard

