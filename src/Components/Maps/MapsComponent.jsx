import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps"
import TurbineMarkers from "./TurbineMarker"
import WarehouseMarker from "./WarehouseMarker"
import ConnectionLine from "./ConnectingLine"
import { Compass, ZoomIn, ZoomOut } from "lucide-react"
import React from "react"

// Custom map controls as a separate component to access map context
const MapControls = ({ onResetView }) => {
  const map = useMap()

  if (!map) return null

  const handleZoomIn = () => {
    const currentZoom = map.getZoom() || 8
    map.setZoom(Math.min(currentZoom + 1, 20))
  }

  const handleZoomOut = () => {
    const currentZoom = map.getZoom() || 8
    map.setZoom(Math.max(currentZoom - 1, 1))
  }

  const handleResetOrientation = () => {
    map.setHeading(0)
    map.setTilt(0)
    if (onResetView) {
      onResetView() // Call the reset function passed as prop
    }
  }

  return (
    <>
      {/* Custom Map Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col space-y-2 z-10">
        <button
          onClick={handleZoomIn}
          className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
          aria-label="Zoom in"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
          aria-label="Zoom out"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={handleResetOrientation}
          className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
          aria-label="Reset orientation"
        >
          <Compass size={20} />
        </button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-6 left-6 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm text-gray-800 shadow-lg z-10">
        Zoom: {map.getZoom()?.toFixed(1) || "8.0"}
      </div>
    </>
  )
}

const MapComponent = ({
  turbineData,
  plantData,
  filters,
  linePath,
  onTurbineClick,
  onMapClick,
  onPlantClick,
  setMapRef,
  resetMapView,
}) => {
  // Default center position (can be adjusted as needed)
  const position = { lat: 56.2, lng: 9.5 } // Centered on Denmark based on your data

  // Function to handle map load and set the reference
  const handleMapLoad = (map) => {
    if (map && setMapRef) {
      setMapRef(map)
    }
  }

  return (
    <div className="relative h-full w-full">
      <APIProvider
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        loadScriptUrl={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=geometry`}
      >
        <Map
          defaultCenter={position}
          defaultZoom={8}
          mapId={process.env.REACT_APP_GOOGLE_MAPS_ID}
          onClick={onMapClick}
          onLoad={handleMapLoad}
          gestureHandling="greedy"
          disableDefaultUI={true}
          mapTypeId="roadmap"
          styles={[
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ]}
          className="h-full w-full"
        >
          <TurbineMarkers filters={filters.turbine} allData={turbineData} setSelectedTurbine={onTurbineClick} />
          <WarehouseMarker plantData={plantData} filters={filters.warehouse} onPlantClick={onPlantClick} />
          {linePath.length === 2 && <ConnectionLine origin={linePath[0]} destination={linePath[1]} />}
          <MapControls onResetView={resetMapView} />
        </Map>
      </APIProvider>
    </div>
  )
}

export default MapComponent
