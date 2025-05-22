"use client"
import React from "react"
import { ArrowLeft, Wind, MapPin, Building, Cpu, Zap, Factory, ArrowUpDown, ArrowUp } from "lucide-react"

const TurbineDetailPanel = ({ selectedTurbine, selectedPlant, plantTurbines, onTurbineSelect }) => {
  // Define the specific properties you want to display with icons
  const turbineProperties = [
    { key: "FunctionalLoc", label: "Functional Location", icon: <MapPin size={16} className="text-gray-400" /> },
    { key: "Description", label: "Description", icon: <Wind size={16} className="text-gray-400" /> },
    { key: "MaintPlant", label: "Maintenance Plant", icon: <Building size={16} className="text-gray-400" /> },
    { key: "PlanningPlant", label: "Planning Plant", icon: <Cpu size={16} className="text-gray-400" /> },
    { key: "Platform", label: "Platform", icon: <Factory size={16} className="text-gray-400" /> },
    { key: "TurbineModel", label: "Turbine Model", icon: <Wind size={16} className="text-gray-400" /> },
    { key: "NominalPower", label: "Nominal Power", icon: <Zap size={16} className="text-gray-400" /> },
    { key: "OriginalEqManufact", label: "Manufacturer", icon: <Factory size={16} className="text-gray-400" /> },
    { key: "HubHeight", label: "Hub Height", icon: <ArrowUpDown size={16} className="text-gray-400" /> },
    { key: "TowerHeight", label: "Tower Height", icon: <ArrowUp size={16} className="text-gray-400" /> },
  ]

  return (
    <div className="  backdrop-blur-md  border border-gray-700 h-full flex flex-col text-white overflow-hidden">
    
      <div className="p-5 flex-1 overflow-y-auto">
        {selectedTurbine ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Turbine Details</h2>
              {selectedPlant && (
                <button
                  onClick={() => onTurbineSelect(null)}
                  className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to list
                </button>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white">
                {selectedTurbine.Description || "Unnamed Turbine"}
              </h3>

              <div className="grid grid-cols-1 gap-4 mt-4">
                {turbineProperties.map(
                  ({ key, label, icon }) =>
                    selectedTurbine[key] !== undefined && (
                      <div key={key} className="flex items-start">
                        <div className="mt-0.5 mr-3">{icon}</div>
                        <div>
                          <p className="text-xs text-gray-400">{label}</p>
                          <p className="text-sm font-medium">{selectedTurbine[key]?.toString() || "N/A"}</p>
                        </div>
                      </div>
                    ),
                )}

                <div className="flex items-start">
                  <div className="mt-0.5 mr-3">
                    <MapPin size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Coordinates</p>
                    <p className="text-sm font-medium">
                      {selectedTurbine.TurbineLatitude}, {selectedTurbine.TurbineLongitude}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : selectedPlant ? (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">Turbines in {selectedPlant.Plant_Name}</h2>

            {plantTurbines.length > 0 ? (
              <div className="space-y-3">
                {plantTurbines.map((turbine, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-750 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={() => onTurbineSelect(turbine)}
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-700 rounded-full mr-3">
                        <Wind size={16} className="text-gray-300" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{turbine.Description || "Unnamed Turbine"}</h3>
                        <p className="text-xs text-gray-400 mt-1">{turbine.FunctionalLoc}</p>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>
                        <span className="block">Model:</span>
                        <span className="text-gray-300">{turbine.TurbineModel || "N/A"}</span>
                      </div>
                      <div>
                        <span className="block">Power:</span>
                        <span className="text-gray-300">{turbine.NominalPower || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                <p className="text-gray-400">No turbines found for this plant.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg border border-gray-700 shadow-lg max-w-xs mx-auto">
              <Wind size={48} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Selection</h3>
              <p className="text-sm text-gray-400">
                Select a turbine or plant on the map to view detailed information.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TurbineDetailPanel
