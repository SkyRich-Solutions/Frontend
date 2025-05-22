"use client"

import { AdvancedMarker } from "@vis.gl/react-google-maps"
import { Warehouse } from "lucide-react"
import { useState } from "react"
import React from "react"

const isValidLatLng = (lat, lng) => !isNaN(lat) && !isNaN(lng) && typeof lat === "number" && typeof lng === "number"

const WarehouseMarker = ({ plantData = {}, filters, onPlantClick }) => {
  const [hoveredPlant, setHoveredPlant] = useState(null)

  const renderMarkers = (data = [], colorClass, prefix, handleClick) =>
    data.map((warehouse, index) => {
      const lat = Number.parseFloat(warehouse.Plant_Latitude)
      const lng = Number.parseFloat(warehouse.Plant_Longitude)
      const isHovered = hoveredPlant === `${prefix}-${index}`

      if (!isValidLatLng(lat, lng)) return null

      return (
        <AdvancedMarker
          key={`${prefix}-${index}`}
          position={{ lat, lng }}
          title={warehouse.Plant_Name}
          onClick={() => handleClick?.(warehouse)}
          onMouseOver={() => setHoveredPlant(`${prefix}-${index}`)}
          onMouseOut={() => setHoveredPlant(null)}
        >
          <div
            className={`flex items-center justify-center p-1 rounded-lg ${colorClass} ${
              isHovered ? "scale-125 shadow-lg" : "shadow-md"
            } transition-all duration-200`}
          >
            <Warehouse size={isHovered ? 22 : 20} className="text-white m-1" />
          </div>
        </AdvancedMarker>
      )
    })

  return (
    <>
      {filters?.showAll && renderMarkers(plantData.all, "bg-gray-600", "warehouse-all", onPlantClick)}
      {filters?.showMaint && renderMarkers(plantData.maint, "bg-red-600", "warehouse-maint", onPlantClick)}
      {filters?.showPlanning && renderMarkers(plantData.planning, "bg-blue-600", "warehouse-planning", onPlantClick)}
    </>
  )
}

export default WarehouseMarker
