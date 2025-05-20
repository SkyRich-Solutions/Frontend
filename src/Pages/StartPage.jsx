"use client"

import { useEffect, useState } from "react"
import Header from "../Components/Layout/Header"
import { getMaterialComponentHealthScores } from "../Utils/MaterialDashboardDataHandler"
import { getTurbineModelHealthScores } from "../Utils/TurbineDashboardDataHandler"
import { AlertTriangle, Filter } from "lucide-react"

const StartPage = () => {
  const [materialData, setMaterialData] = useState([])
  const [turbineData, setTurbineData] = useState([])
  const [filterStatus, setFilterStatus] = useState("Critical")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const materialScores = await getMaterialComponentHealthScores()
        setMaterialData(materialScores)

        const turbineScores = await getTurbineModelHealthScores()
        setTurbineData(turbineScores)
      } catch (error) {
        console.error("Error fetching data", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter based on HealthScore and selected status filter
  const filteredMaterialData = materialData.filter((item) => {
    const healthScore = item.HealthScore
    if (filterStatus === "Critical") return healthScore < 50
    if (filterStatus === "Medium") return healthScore >= 50 && healthScore < 70
    return true
  })

  const filteredTurbineData = turbineData.filter((item) => {
    const healthScore = item.HealthScore
    if (filterStatus === "Critical") return healthScore < 50
    if (filterStatus === "Medium") return healthScore >= 50 && healthScore < 70
    return true
  })

  // Sort filtered data
  const sortedMaterialData = [...filteredMaterialData].sort((a, b) => a.HealthScore - b.HealthScore)
  const sortedTurbineData = [...filteredTurbineData].sort((a, b) => a.HealthScore - b.HealthScore)

  const getHealthScoreColor = (score) => {
    if (score < 50) return "rgba(239, 68, 68, 0.9)" // Critical - more vibrant red
    if (score < 70) return "rgba(245, 158, 11, 0.9)" // Medium - more vibrant orange
    return "rgba(34, 197, 94, 0.9)" // Good - more vibrant green
  }

  const getHealthScoreLabel = (score) => {
    if (score < 50) return "Critical"
    if (score < 70) return "Medium"
    return "Good"
  }

  // Mapping of default key names to custom header names
  const headerMapping = {
    Material_ID: "Material",
    ModelHealthScore_ID: "Model",
    // Add other key mappings as needed
  }

  // Function to get the custom header name
  const getCustomHeaderName = (key) => {
    return headerMapping[key] || key
  }

  return (
    <div className="flex flex-col h-screen w-screen  overflow-hidden  bg-gray-900 bg-opacity-90 z-10">
      {/* Header Section */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-900 shadow-md z-10">
        <Header title="Warnings Dashboard" />
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
          <span className="text-white text-sm font-medium">
            {filterStatus === "Critical"
              ? `${sortedMaterialData.length + sortedTurbineData.length} Critical Issues`
              : `${sortedMaterialData.length + sortedTurbineData.length} Medium Issues`}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden">
        {/* Filter Controls */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 mb-6">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-white font-medium mr-4">Filter by Status:</span>
            <select
              className="bg-gray-700 text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Critical">Critical</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
        </div>

        {/* Tables Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-220px)]">
          {/* Material Data Table */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-800 border-b border-gray-700">
              <h2 className="text-white font-semibold text-lg">Material Components</h2>
            </div>
            <div className="overflow-auto h-[calc(100%-60px)]">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : sortedMaterialData.length > 0 ? (
                <table className="w-full">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th className="bg-gray-700 text-white font-semibold px-4 py-3 text-left">Status</th>
                      {materialData.length > 0 &&
                        Object.keys(materialData[0] || {})
                          .filter((key) => key !== "ComponentHealthScore_ID")
                          .map((key) => (
                            <th key={key} className="bg-gray-700 text-white font-semibold px-4 py-3 text-left">
                              {getCustomHeaderName(key)}
                            </th>
                          ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMaterialData.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"}>
                        <td className="px-4 py-3 border-b border-gray-700">
                          <span
                            className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: getHealthScoreColor(item.HealthScore) }}
                          >
                            {getHealthScoreLabel(item.HealthScore)}
                          </span>
                        </td>
                        {Object.entries(item)
                          .filter(([key]) => key !== "ComponentHealthScore_ID")
                          .map(([key, value], i) => (
                            <td key={i} className="px-4 py-3 border-b border-gray-700 text-gray-200">
                              {value}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex justify-center items-center h-full text-gray-400">
                  No data available for the selected filter.
                </div>
              )}
            </div>
          </div>

          {/* Turbine Data Table */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-800 border-b border-gray-700">
              <h2 className="text-white font-semibold text-lg">Turbine Models</h2>
            </div>
            <div className="overflow-auto h-[calc(100%-60px)]">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : sortedTurbineData.length > 0 ? (
                <table className="w-full">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th className="bg-gray-700 text-white font-semibold px-4 py-3 text-left">Status</th>
                      {turbineData.length > 0 &&
                        Object.keys(turbineData[0] || {})
                          .filter((key) => key !== "ComponentHealthScore_ID")
                          .map((key) => (
                            <th key={key} className="bg-gray-700 text-white font-semibold px-4 py-3 text-left">
                              {getCustomHeaderName(key)}
                            </th>
                          ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTurbineData.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"}>
                        <td className="px-4 py-3 border-b border-gray-700">
                          <span
                            className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: getHealthScoreColor(item.HealthScore) }}
                          >
                            {getHealthScoreLabel(item.HealthScore)}
                          </span>
                        </td>
                        {Object.entries(item)
                          .filter(([key]) => key !== "ComponentHealthScore_ID")
                          .map(([key, value], i) => (
                            <td key={i} className="px-4 py-3 border-b border-gray-700 text-gray-200">
                              {value}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex justify-center items-center h-full text-gray-400">
                  No data available for the selected filter.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartPage
