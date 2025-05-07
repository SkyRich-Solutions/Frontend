

import { useEffect, useState, useMemo } from "react"
import Header from "../Components/Layout/Header"
import PieChart from "../Components/ReUseable/PieChart"
import DataHandler from "../Utils/DataHandler"

const DataOverviewOfComplianceDashboard = () => {
  const {
    getMaterialReplacementPartsViolations,
    getMaterialCompliantReplacementParts,
    getMaterialUnclassified,
    getMaterialClassified,
    getMaterialUnknownPlant,
    getMaterialKnownPlant,
    getTurbineUnknownMaintPlantViolation,
    getTurbineKnownMaintPlant,
    getTurbineKnownPlanningPlant,
    getTurbineUnknownPlanningPlantViolation,
    getTurbineUnKnownLocation,
    getTurbineKnownLocation,
  } = useMemo(() => DataHandler(), [])

  const [materialChartData, setMaterialChartData] = useState(null)
  const [turbineChartData, setTurbineChartData] = useState(null)
  const [classificationChartData, setClassificationChartData] = useState(null)
  const [plantChartData, setPlantChartData] = useState(null)
  const [PlanningPlant, setPlanningPlant] = useState(null)
  const [Location, setLocation] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Material Data
        const NonCompliantMaterialData = await getMaterialReplacementPartsViolations()
        const CompliantMaterialData = await getMaterialCompliantReplacementParts()
        const materialViolations = NonCompliantMaterialData[0]?.total_violations || 0
        const materialSafe = CompliantMaterialData[0]?.total_violations || 0

        const CompliantData = await getMaterialClassified()
        const NonCompliantData = await getMaterialUnclassified()
        const classified = CompliantData[0]?.total_violations || 0
        const unclassified = NonCompliantData[0]?.total_violations || 0

        const CompliantPlantData = await getMaterialKnownPlant()
        const NonCompliantPlantData = await getMaterialUnknownPlant()
        const known = CompliantPlantData[0]?.total_violations || 0
        const unknown = NonCompliantPlantData[0]?.total_violations || 0

        // Turbine Data
        const NonCompliantTurbineData = await getTurbineUnknownMaintPlantViolation()
        const CompliantTurbineData = await getTurbineKnownMaintPlant()
        const turbineViolations = NonCompliantTurbineData[0]?.total_violations || 0
        const turbineSafe = CompliantTurbineData[0]?.total_violations || 0

        const CompliantPlanningPlant = await getTurbineKnownPlanningPlant()
        const NonCompliantPlanningPlant = await getTurbineUnknownPlanningPlantViolation()
        const planningCompliant = CompliantPlanningPlant[0]?.total_violations || 0
        const planningViolations = NonCompliantPlanningPlant[0]?.total_violations || 0

        const CompliantLocationData = await getTurbineKnownLocation()
        const NonCompliantLocationData = await getTurbineUnKnownLocation()
        const knownLocation = CompliantLocationData[0]?.total_violations || 0
        const unknownLocation = NonCompliantLocationData[0]?.total_violations || 0

        const buildPieChart = (label1, label2, value1, value2, color1, color2) => ({
          labels: [label1, label2],
          datasets: [
            {
              label: "Items",
              data: [value1, value2],
              backgroundColor: [color1, color2],
              borderColor: [color1.replace("0.6", "1"), color2.replace("0.6", "1")],
              borderWidth: 1,
            },
          ],
        })

        // Set charts
        setMaterialChartData(
          buildPieChart(
            "Non-Compliant",
            "Compliant",
            materialViolations,
            materialSafe,
            "rgba(255, 99, 132, 0.6)",
            "rgba(75, 192, 75, 0.6)",
          ),
        )
        setTurbineChartData(
          buildPieChart(
            "Non-Compliant",
            "Compliant",
            turbineViolations,
            turbineSafe,
            "rgba(255, 99, 132, 0.6)",
            "rgba(75, 192, 75, 0.6)",
          ),
        )
        setClassificationChartData(
          buildPieChart(
            "Unclassified",
            "Classified",
            unclassified,
            classified,
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ),
        )
        setPlantChartData(
          buildPieChart(
            "Unknown Plant",
            "Known Plant",
            unknown,
            known,
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ),
        )
        setPlanningPlant(
          buildPieChart(
            "Planning Plant Violation",
            "Planning Plant",
            planningViolations,
            planningCompliant,
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ),
        )
        setLocation(
          buildPieChart(
            "Unknown Location",
            "Known Location",
            unknownLocation,
            knownLocation,
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ),
        )
      } catch (error) {
        console.error("Error loading chart data:", error)
      }
    }

    fetchData()
  }, [
    getMaterialReplacementPartsViolations,
    getMaterialCompliantReplacementParts,
    getMaterialUnclassified,
    getMaterialClassified,
    getMaterialUnknownPlant,
    getMaterialKnownPlant,
    getTurbineUnknownMaintPlantViolation,
    getTurbineKnownMaintPlant,
    getTurbineKnownPlanningPlant,
    getTurbineUnknownPlanningPlantViolation,
    getTurbineUnKnownLocation,
    getTurbineKnownLocation,
  ])

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-950 overflow-hidden">
      {/* Header Section - consistent height and padding */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-900 bg-opacity-90 z-10">
        <Header title="Overview of Compliance" />
      </div>

      {/* Main Content - takes remaining height */}
      <div className="flex-1 p-4">
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 rounded-lg h-full">
          <div className="bg-gray-900 rounded-lg shadow-lg h-full p-4 flex flex-col">
            {/* Section Titles */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-100 text-center">Material</h2>
              <h2 className="text-xl md:text-2xl font-bold text-gray-100 text-center">Turbine</h2>
            </div>

            {/* Charts Container */}
            <div className="flex-1 flex flex-col md:flex-row">
              {/* Material Charts */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 md:border-r md:border-gray-700 md:pr-4 mb-4 md:mb-0">
                {[
                  { data: materialChartData, text: "Replacement Parts" },
                  { data: classificationChartData, text: "Material Classifications" },
                  { data: plantChartData, text: "Material Plant ID's" },
                ].map((chart, idx) => (
                  <div key={idx} className="aspect-square flex items-center justify-center">
                    <PieChart text={chart.text} chartData={chart.data} />
                  </div>
                ))}
                {/* Optional fourth chart slot */}
                <div className="aspect-square hidden sm:flex items-center justify-center"></div>
              </div>

              {/* Turbine Charts */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 md:border-l md:border-gray-700 md:pl-4">
                {[
                  { data: turbineChartData, text: "Maintenance Plant" },
                  { data: PlanningPlant, text: "Planning Plant" },
                  { data: Location, text: "Location" },
                ].map((chart, idx) => (
                  <div key={idx} className="aspect-square flex items-center justify-center">
                    <PieChart text={chart.text} chartData={chart.data} />
                  </div>
                ))}
                {/* Optional fourth chart slot */}
                <div className="aspect-square hidden sm:flex items-center justify-center"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataOverviewOfComplianceDashboard
