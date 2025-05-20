import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  Cell,
  Label,
} from "recharts"
import { useState, useEffect, useMemo } from "react"

import {
  getTurbineModelHealthScores,
  getTurbineModelScoreSummary,
  getTurbinePlatformHealthScores,
  getTurbinePlatformScoreSummary,
} from "../Utils/TurbineDashboardDataHandler"

const COLORS = [
  "rgba(153, 102, 255, 0.6)",
  "rgba(255, 159, 64, 0.6)",
  "rgba(54, 162, 235, 0.6)",
  "rgba(255, 206, 86, 0.6)",
  "rgba(255, 99, 132, 0.6)",
  "rgba(75, 192, 75, 0.6)",
  "rgba(0, 128, 128, 0.6)",
  "rgba(255, 140, 0, 0.6)",
  "rgba(106, 90, 205, 0.6)",
  "rgba(199, 21, 133, 0.6)",
  "rgba(100, 149, 237, 0.6)",
  "rgba(0, 206, 209, 0.6)",
  "rgba(46, 139, 87, 0.6)",
  "rgba(220, 20, 60, 0.6)",
  "rgba(244, 164, 96, 0.6)",
]

const getColorByScore = (score) => {
  if (score < 50) return "rgba(255, 99, 132, 0.8)"
  if (score < 70) return "rgba(255, 159, 64, 0.8)"
  return "rgba(75, 192, 75, 0.8)"
}

//-------------------------------------------------MaterialPredictions--------------------------------------------------//
const TurbineComponentHealthScoresComponent = ({ type, searchQuery, selectedItem, onItemClick = () => {} }) => {
  const [turbineModelHealthScores, setTurbineModelHealthScores] = useState([])
  const [turbineModelScoreSummary, setTurbineModelScoreSummary] = useState([])
  const [turbinePlatformHealthScores, setTurbinePlatformHealthScores] = useState([])
  const [turbinePlatformScoreSummary, setTurbinePlatformScoreSummary] = useState([])

  // Add state for shuffled data
  const [shuffledModelHealthScores, setShuffledModelHealthScores] = useState([])
  const [shuffledModelScoreSummary, setShuffledModelScoreSummary] = useState([])
  const [shuffledPlatformHealthScores, setShuffledPlatformHealthScores] = useState([])
  const [shuffledPlatformScoreSummary, setShuffledPlatformScoreSummary] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modelHealthScoresData = await getTurbineModelHealthScores()
        const modelScoreSummaryData = await getTurbineModelScoreSummary()
        const platformHealthScoresData = await getTurbinePlatformHealthScores()
        const platformScoreSummaryData = await getTurbinePlatformScoreSummary()

        setTurbineModelHealthScores(modelHealthScoresData)
        setTurbineModelScoreSummary(modelScoreSummaryData)
        setTurbinePlatformHealthScores(platformHealthScoresData)
        setTurbinePlatformScoreSummary(platformScoreSummaryData)

        // Shuffle the data once when it's loaded
        setShuffledModelHealthScores([...modelHealthScoresData].sort(() => Math.random() - 0.5))
        setShuffledModelScoreSummary([...modelScoreSummaryData].sort(() => Math.random() - 0.5))
        setShuffledPlatformHealthScores([...platformHealthScoresData].sort(() => Math.random() - 0.5))
        setShuffledPlatformScoreSummary([...platformScoreSummaryData].sort(() => Math.random() - 0.5))
      } catch (error) {
        console.error("Error fetching turbine data:", error)
      }
    }
    fetchData()
  }, [])

  // Normalize search query
  const query = searchQuery.toLowerCase()

  // Apply filters to the original data
  const filteredTurbineModelHealthScores = useMemo(() => {
    return turbineModelHealthScores.filter((item) =>
      [item.TurbineModel, item.HealthScore].some((field) => field?.toString().toLowerCase().includes(query)),
    )
  }, [turbineModelHealthScores, query])

  const filteredTurbineModelScoreSummary = useMemo(() => {
    return turbineModelScoreSummary.filter((item) =>
      [item.TurbineModel, item.TotalModelScore].some((field) => field?.toString().toLowerCase().includes(query)),
    )
  }, [turbineModelScoreSummary, query])

  const filteredTurbinePlatformHealthScores = useMemo(() => {
    return turbinePlatformHealthScores.filter((item) =>
      [item.Platform, item.Plant, item.HealthScore].some((field) => field?.toString().toLowerCase().includes(query)),
    )
  }, [turbinePlatformHealthScores, query])

  const filteredTurbinePlatformScoreSummary = useMemo(() => {
    return turbinePlatformScoreSummary.filter((item) =>
      [item.Platform, item.TotalPlatformScore].some((field) => field?.toString().toLowerCase().includes(query)),
    )
  }, [turbinePlatformScoreSummary, query])

  // Apply filters to the shuffled data
  const filteredShuffledModelHealthScores = useMemo(() => {
    return shuffledModelHealthScores.filter((item) =>
      [item.TurbineModel, item.HealthScore].some((field) => field?.toString().toLowerCase().includes(query)),
    )
  }, [shuffledModelHealthScores, query])

  const filteredShuffledModelScoreSummary = useMemo(() => {
    return shuffledModelScoreSummary.filter((item) =>
      [item.TurbineModel, item.TotalModelScore].some((field) => field?.toString().toLowerCase().includes(query)),
    )
  }, [shuffledModelScoreSummary, query])

  const filteredShuffledPlatformHealthScores = useMemo(() => {
    return shuffledPlatformHealthScores.filter((item) =>
      [item.Platform, item.Plant, item.HealthScore].some((field) => field?.toString().toLowerCase().includes(query)),
    )
  }, [shuffledPlatformHealthScores, query])

  const filteredShuffledPlatformScoreSummary = useMemo(() => {
    return shuffledPlatformScoreSummary.filter((item) =>
      [item.Platform, item.TotalPlatformScore].some((field) => field?.toString().toLowerCase().includes(query)),
    )
  }, [shuffledPlatformScoreSummary, query])

  // Pre-process data for all chart types at the top level to avoid conditional hooks
  const modelHealthScoresData = useMemo(() => {
    const rawData = filteredShuffledModelHealthScores.map((item) => ({
      TurbineModel: item.TurbineModel,
      HealthScore: item.HealthScore || 0,
    }))

    // Take top 10 items without reshuffling
    const topItems = rawData.slice(0, 10)

    // Ensure selected item is included if it exists
    if (selectedItem && !topItems.some((item) => item.TurbineModel === selectedItem)) {
      const selectedEntry = filteredTurbineModelHealthScores.find((item) => item.TurbineModel === selectedItem)
      if (selectedEntry) {
        // Replace the last item with the selected one to ensure it's visible
        topItems[topItems.length - 1] = {
          TurbineModel: selectedEntry.TurbineModel,
          HealthScore: selectedEntry.HealthScore || 0,
        }
      }
    }

    return topItems
  }, [filteredShuffledModelHealthScores, filteredTurbineModelHealthScores, selectedItem])

  const modelScoreSummaryData = useMemo(() => {
    const rawData = filteredShuffledModelScoreSummary.map((item) => ({
      TurbineModel: item.TurbineModel,
      TotalModelScore: item.TotalModelScore || 0,
    }))

    // Take top 10 items without reshuffling
    const topItems = rawData.slice(0, 10)

    // Ensure selected item is included if it exists
    if (selectedItem && !topItems.some((item) => item.TurbineModel === selectedItem)) {
      const selectedEntry = filteredTurbineModelScoreSummary.find((item) => item.TurbineModel === selectedItem)
      if (selectedEntry) {
        // Replace the last item with the selected one to ensure it's visible
        topItems[topItems.length - 1] = {
          TurbineModel: selectedEntry.TurbineModel,
          TotalModelScore: selectedEntry.TotalModelScore || 0,
        }
      }
    }

    return topItems
  }, [filteredShuffledModelScoreSummary, filteredTurbineModelScoreSummary, selectedItem])

  const radarModelHealthScoresData = useMemo(() => {
    const modelGroups = {}

    filteredTurbineModelHealthScores.forEach((item) => {
      const model = item.TurbineModel || "Unknown"
      const healthScore = item.HealthScore || 0

      if (!modelGroups[model]) {
        modelGroups[model] = { model, totalHealthScore: 0, count: 0 }
      }
      modelGroups[model].totalHealthScore += healthScore
      modelGroups[model].count += 1
    })

    // Calculate average scores and format data
    return Object.values(modelGroups)
      .map((item) => ({
        TurbineModel: item.model,
        AvgHealthScore: item.count > 0 ? Math.min(100, Math.max(0, item.totalHealthScore / item.count)) : 0,
      }))
      .sort((a, b) => b.AvgHealthScore - a.AvgHealthScore)
      .slice(0, 10)
  }, [filteredTurbineModelHealthScores])

  const platformHealthScoresData = useMemo(() => {
    const PLATFORM_KEY = "Platform"
    const PLANT_KEY = "Plant"
    const HEALTH_SCORE_KEY = "HealthScore"

    return Array.isArray(filteredShuffledPlatformHealthScores)
      ? filteredShuffledPlatformHealthScores
          .map((item) => ({
            [PLATFORM_KEY]: item.Platform || "Unknown",
            [PLANT_KEY]: item.Plant || "Unknown",
            [HEALTH_SCORE_KEY]: item.HealthScore || 0,
          }))
          .slice(0, 10)
      : []
  }, [filteredShuffledPlatformHealthScores])

  const platformScoreSummaryData = useMemo(() => {
    const rawData = filteredShuffledPlatformScoreSummary.map((item) => ({
      Platform: item.Platform,
      TotalPlatformScore: item.TotalPlatformScore || 0,
    }))

    // Take top 10 items without reshuffling
    const topItems = rawData.slice(0, 10)

    // Ensure selected item is included if it exists
    if (selectedItem && !topItems.some((item) => item.Platform === selectedItem)) {
      const selectedEntry = filteredTurbinePlatformScoreSummary.find((item) => item.Platform === selectedItem)
      if (selectedEntry) {
        // Replace the last item with the selected one to ensure it's visible
        topItems[topItems.length - 1] = {
          Platform: selectedEntry.Platform,
          TotalPlatformScore: selectedEntry.TotalPlatformScore || 0,
        }
      }
    }

    return topItems
  }, [filteredShuffledPlatformScoreSummary, filteredTurbinePlatformScoreSummary, selectedItem])

  const lineModelHealthScoresData = useMemo(() => {
    return Array.isArray(filteredShuffledModelHealthScores)
      ? filteredShuffledModelHealthScores
          .map((item) => ({
            TurbineModel: item.TurbineModel || "Unknown",
            HealthScore: item.HealthScore || 0,
          }))
          .sort((a, b) => b.HealthScore - a.HealthScore)
          .slice(0, 10)
      : []
  }, [filteredShuffledModelHealthScores])

  const radarOverallAvg = useMemo(() => {
    return radarModelHealthScoresData.length > 0
      ? radarModelHealthScoresData.reduce((sum, item) => sum + item.AvgHealthScore, 0) /
          radarModelHealthScoresData.length
      : 0
  }, [radarModelHealthScoresData])

  const safeOnItemClick = typeof onItemClick === "function" ? onItemClick : () => {}

  // Shared click handler that works across all chart types
  const handleClick = (data) => {
    if (data) {
      const key =
        data.TurbineModel ||
        data.Platform ||
        data.Plant ||
        data.material ||
        data.materialDescription ||
        data.materialCategory

      if (key !== undefined) {
        safeOnItemClick((prev) => (prev === key ? null : key))
      }
    }
  }

  if (type === "bar_TurbineModelHealthScores") {
    const CustomTooltipBarTurbineModelHealthScores = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
          <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
            <p>
              <strong>Turbine Model:</strong> {data.TurbineModel}
            </p>
            <p>
              <strong>Turbine Model Health Score:</strong> {data.HealthScore}
            </p>
          </div>
        )
      }
      return null
    }

    return (
      <div className="w-full h-full relative">
        {/* Info Icon Tooltip */}
        <div className="absolute top-2 right-1 group cursor-pointer z-10">
          <span className="text-gray-500">ℹ️</span>
          <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
            <p>
              <strong>Chart Info:</strong>
            </p>
            <p>
              This chart displays the Health Scores of different turbine models based on their operational reliability
              and performance history.
            </p>
            <hr className="my-2 border-gray-300" />
            <p>
              <strong>Health Score (%):</strong>
            </p>
            <p>
              A value between 0 and 100 indicating the overall condition of the turbine model. Higher scores suggest
              better performance and fewer issues over time.
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={modelHealthScoresData}
              margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
              onClick={(data) => {
                if (data && data.activePayload && data.activePayload[0]) {
                  handleClick(data.activePayload[0].payload)
                }
              }}
            >
              <XAxis dataKey="TurbineModel" angle={-30} textAnchor="end" interval={0}>
                <Label value="Turbine Model" offset={-5} position="insideBottom" style={{ textAnchor: "middle" }} />
              </XAxis>
              <YAxis domain={[0, 100]}>
                <Label value="Health Score (%)" angle={-90} position="insideLeft" style={{ textAnchor: "middle" }} />
              </YAxis>
              <Tooltip content={<CustomTooltipBarTurbineModelHealthScores />} />
              <Bar dataKey="HealthScore">
                {modelHealthScoresData.map((entry, index) => {
                  const isSelected = entry.TurbineModel === selectedItem
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isSelected ? "#00ffff" : getColorByScore(entry.HealthScore)}
                      stroke={isSelected ? "#00ffff" : "none"}
                      strokeWidth={isSelected ? 2 : 0}
                      opacity={selectedItem && !isSelected ? 0.3 : 1}
                      style={{
                        transition: "all 0.3s ease",
                        filter: isSelected ? "drop-shadow(0 0 6px #00ffff)" : "none",
                        cursor: "pointer",
                      }}
                    />
                  )
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  if (type === "bar_TurbineModelScoreSummary") {
    const CustomTooltipBarTurbineModelScoreSummary = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
          <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
            <p>
              <strong>Turbine Model:</strong> {data.TurbineModel}
            </p>
            <p>
              <strong>Turbine Model Summary Score:</strong> {data.TotalModelScore}
            </p>
          </div>
        )
      }
      return null
    }

    return (
      <div className="w-full h-full relative">
        {/* Info Icon Tooltip */}
        <div className="absolute top-2 right-1 group cursor-pointer z-10">
          <span className="text-gray-500">ℹ️</span>
          <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
            <p>
              <strong>Chart Info:</strong>
            </p>
            <p>
              This chart presents the summary scores for different turbine models, reflecting their overall performance
              across multiple operational factors.
            </p>
            <hr className="my-2 border-gray-300" />
            <p>
              <strong>Summary Score (%):</strong>
            </p>
            <p>
              A composite score from 0 to 100 that aggregates metrics like component health, usage trends, and
              historical reliability. Higher scores indicate stronger-performing turbine models.
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={modelScoreSummaryData}
              margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
              onClick={(data) => {
                if (data && data.activePayload && data.activePayload[0]) {
                  handleClick(data.activePayload[0].payload)
                }
              }}
            >
              <XAxis dataKey="TurbineModel" angle={-30} textAnchor="end" interval={0}>
                <Label value="Turbine Model" offset={-5} position="insideBottom" style={{ textAnchor: "middle" }} />
              </XAxis>
              <YAxis domain={[0, 100]}>
                <Label
                  value="Health Score Summary (%)"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip content={<CustomTooltipBarTurbineModelScoreSummary />} />
              <Bar dataKey="TotalModelScore">
                {modelScoreSummaryData.map((entry, index) => {
                  const isSelected = entry.TurbineModel === selectedItem
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isSelected ? "#00ffff" : getColorByScore(entry.TotalModelScore)}
                      stroke={isSelected ? "#00ffff" : "none"}
                      strokeWidth={isSelected ? 2 : 0}
                      opacity={selectedItem && !isSelected ? 0.3 : 1}
                      style={{
                        transition: "all 0.3s ease",
                        filter: isSelected ? "drop-shadow(0 0 6px #00ffff)" : "none",
                        cursor: "pointer",
                      }}
                    />
                  )
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  if (type === "radar_TurbineModelHealthScores_ByPlant") {
    const radarColor = getColorByScore(radarOverallAvg)

    const CustomTooltipRadar = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
          <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
            <p>
              <strong>Turbine Model:</strong> {data.TurbineModel}
            </p>
            <p>
              <strong>Avg Health Score:</strong> {data.AvgHealthScore.toFixed(2)}%
            </p>
          </div>
        )
      }
      return null
    }

    const handleClickRadar = (model) => {
      safeOnItemClick((prev) => (prev === model ? null : model))
    }

    return (
      <div className="w-full h-full relative">
        {/* Info Icon Tooltip */}
        <div className="absolute top-2 right-1 group cursor-pointer z-10">
          <span className="text-gray-500">ℹ️</span>
          <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
            <p>
              <strong>Chart Info:</strong>
            </p>
            <p>
              This radar chart compares average health scores of turbine models across different plants to highlight
              which models tend to perform more reliably overall.
            </p>
            <hr className="my-2 border-gray-300" />
            <p>
              <strong>Avg Health Score (%):</strong>
            </p>
            <p>
              Represents the mean health score for each turbine model across all its plant deployments. Higher scores
              suggest better performance and lower maintenance needs.
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="80%"
              data={radarModelHealthScoresData}
              onClick={(e) => {
                if (e?.activeLabel) {
                  handleClickRadar(e.activeLabel)
                }
              }}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="TurbineModel" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Tooltip content={<CustomTooltipRadar />} />
              <Legend />
              <Radar
                name="Avg Health Score"
                dataKey="AvgHealthScore"
                stroke={radarColor}
                fill={radarColor}
                fillOpacity={selectedItem ? 0.2 : 0.6}
              />
              {selectedItem && (
                <Radar
                  name={`Selected: ${selectedItem}`}
                  data={radarModelHealthScoresData.filter((d) => d.TurbineModel === selectedItem)}
                  dataKey="AvgHealthScore"
                  stroke="#00ffff"
                  fill="#00ffff"
                  fillOpacity={0.9}
                />
              )}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  if (type === "bubble_PlatformHealthScores") {
    const PLATFORM_KEY = "Platform"
    const PLANT_KEY = "Plant"
    const HEALTH_SCORE_KEY = "HealthScore"

    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
          <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
            <p>
              <strong>Platform:</strong> {data.Platform}
            </p>
            <p>
              <strong>Plant:</strong> {data.Plant}
            </p>
            <p>
              <strong>Health Score:</strong> {data.HealthScore.toFixed(2)}%
            </p>
          </div>
        )
      }
      return null
    }

    const getKey = (d) => `${d.Platform}|${d.Plant}`

    const handleBubbleClick = (payload) => {
      if (!payload) return
      const key = getKey(payload)
      safeOnItemClick((prev) => (prev === key ? null : key))
    }

    const CustomShape = ({ cx, cy, size, payload, index }) => {
      if (typeof cx !== "number" || typeof cy !== "number" || typeof size !== "number") return null

      const key = getKey(payload)
      const isSelected = selectedItem === key
      const radius = Math.sqrt(size)
      const fill = isSelected ? "#00ffff" : COLORS[index % COLORS.length]
      const opacity = selectedItem && !isSelected ? 0.2 : 1

      return (
        <circle
          cx={cx}
          cy={cy}
          r={isSelected ? radius + 2 : radius}
          fill={fill}
          stroke={isSelected ? "#00ffff" : "#444"}
          strokeWidth={isSelected ? 2 : 0}
          opacity={opacity}
          onClick={(e) => {
            e.stopPropagation()
            handleBubbleClick(payload)
          }}
          style={{
            transition: "all 0.3s ease",
            cursor: "pointer",
            filter: isSelected ? "drop-shadow(0 0 6px #00ffff)" : "none",
          }}
        />
      )
    }

    return (
      <div className="w-full h-full relative">
        {/* Info Icon Tooltip */}
        <div className="absolute top-2 right-1 group cursor-pointer z-10">
          <span className="text-gray-500">ℹ️</span>
          <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
            <p>
              <strong>Chart Info:</strong>
            </p>
            <p>
              This bubble chart displays health scores for turbine platforms deployed at various plants, allowing
              comparison of platform performance across locations.
            </p>
            <hr className="my-2 border-gray-300" />
            <p>
              <strong>Health Score (%):</strong>
            </p>
            <p>
              Each bubble's size represents the platform's health score at a specific plant. Larger bubbles indicate
              more reliable platform performance at that location.
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
              <XAxis
                type="category"
                dataKey={PLATFORM_KEY}
                name="Platform"
                label={{ value: "Platform", position: "insideBottom", offset: -5, style: { textAnchor: "middle" } }}
              />
              <YAxis
                type="category"
                dataKey={PLANT_KEY}
                name="Plant"
                label={{ value: "Plant", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }}
              />
              <ZAxis type="number" dataKey={HEALTH_SCORE_KEY} range={[60, 400]} name="Health Score" />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="center" layout="horizontal" />
              <Scatter
                name="Platform Health"
                data={platformHealthScoresData}
                shape={(props) => {
                  const index = platformHealthScoresData.findIndex((item) => getKey(item) === getKey(props.payload))
                  return <CustomShape {...props} index={index} />
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  if (type === "bar_TurbinePlatformScoreSummary") {
    const CustomTooltipBarTurbinePlatformScoreSummary = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
          <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
            <p>
              <strong>Platform:</strong> {data.Platform}
            </p>
            <p>
              <strong>Total Platform Health Score:</strong> {data.TotalPlatformScore.toFixed(2)}%
            </p>
          </div>
        )
      }
      return null
    }

    return (
      <div className="w-full h-full relative">
        {/* Info Icon Tooltip */}
        <div className="absolute top-2 right-1 group cursor-pointer z-10">
          <span className="text-gray-500">ℹ️</span>
          <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
            <p>
              <strong>Chart Info:</strong>
            </p>
            <p>
              This chart presents the total health scores of different turbine platforms based on their operational
              performance and reliability across multiple plants.
            </p>
            <hr className="my-2 border-gray-300" />
            <p>
              <strong>Total Platform Score (%):</strong>
            </p>
            <p>
              A score from 0 to 100 representing the overall condition of each platform. Higher scores indicate better
              reliability, fewer failures, and lower maintenance needs.
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={platformScoreSummaryData}
              margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
              onClick={(data) => {
                if (data && data.activePayload && data.activePayload[0]) {
                  handleClick(data.activePayload[0].payload)
                }
              }}
            >
              <XAxis dataKey="Platform" angle={-30} textAnchor="end" interval={0}>
                <Label value="Platform" offset={-5} position="insideBottom" style={{ textAnchor: "middle" }} />
              </XAxis>
              <YAxis domain={[0, 100]}>
                <Label
                  value="Total Platform Score (%)"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip content={<CustomTooltipBarTurbinePlatformScoreSummary />} />
              <Bar dataKey="TotalPlatformScore">
                {platformScoreSummaryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.Platform === selectedItem ? "#00ffff" : getColorByScore(entry.TotalPlatformScore)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  if (type === "line_TurbineModelHealthScores") {
    const CustomTooltipLineTurbineModelHealthScores = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
          <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
            <p>
              <strong>Turbine Model:</strong> {data.TurbineModel}
            </p>
            <p>
              <strong>Turbine Model Health Score:</strong> {data.HealthScore}
            </p>
          </div>
        )
      }
      return null
    }

    return (
      <div className="w-full h-full relative">
        {/* Info Icon Tooltip */}
        <div className="absolute top-2 right-1 group cursor-pointer z-10">
          <span className="text-gray-500">ℹ️</span>
          <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
            <p>
              <strong>Chart Info:</strong>
            </p>
            <p>
              This line chart displays the health scores of the top 10 turbine models based on their operational
              performance across all deployments.
            </p>
            <hr className="my-2 border-gray-300" />
            <p>
              <strong>Health Score (%):</strong>
            </p>
            <p>
              A value between 0 and 100 that summarizes the reliability and condition of each turbine model. Higher
              scores indicate better performance and lower likelihood of issues.
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineModelHealthScoresData}
              margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
              onClick={(data) => {
                if (data && data.activePayload && data.activePayload[0]) {
                  const model = data.activePayload[0].payload.TurbineModel
                  if (model) safeOnItemClick((prev) => (prev === model ? null : model))
                }
              }}
            >
              <XAxis dataKey="TurbineModel" angle={-45} textAnchor="end" interval={0}>
                <Label value="Turbine Model" offset={-5} position="insideBottom" style={{ textAnchor: "middle" }} />
              </XAxis>
              <YAxis domain={[0, 100]}>
                <Label value="Health Score (%)" angle={-90} position="insideLeft" style={{ textAnchor: "middle" }} />
              </YAxis>
              <Tooltip content={<CustomTooltipLineTurbineModelHealthScores />} />
              <Legend verticalAlign="top" align="center" layout="horizontal" />
              <Line
                type="monotone"
                dataKey="HealthScore"
                stroke="#00b0ad"
                strokeWidth={2}
                activeDot={false}
                dot={(props) => {
                  const { cx, cy, payload } = props
                  const isSelected = payload.TurbineModel === selectedItem
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 3}
                      fill={isSelected ? "#00ffff" : "#00b0ad"}
                      stroke="#fff"
                      strokeWidth={isSelected ? 2 : 1}
                      style={{
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        filter: isSelected ? "drop-shadow(0 0 6px #00ffff)" : "none",
                        opacity: selectedItem && !isSelected ? 0.3 : 1,
                      }}
                    />
                  )
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  return null
}

export default TurbineComponentHealthScoresComponent
