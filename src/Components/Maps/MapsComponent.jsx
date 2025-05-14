
import { APIProvider, Map } from "@vis.gl/react-google-maps"
import TurbineMarkers from "./TurbineMarker"
import WarehouseMarker from "./WarehouseMarker"
import ConnectionLine from "./ConnectingLine"

const MapComponent = ({ turbineData, plantData, filters, linePath, onTurbineClick, onMapClick }) => {
  const position = { lat: 0, lng: 0 }

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={["geometry"]}>
      <Map defaultCenter={position} defaultZoom={3} mapId={process.env.REACT_APP_GOOGLE_MAPS_ID} onClick={onMapClick}>
        <TurbineMarkers filters={filters.turbine} allData={turbineData} setSelectedTurbine={onTurbineClick} />
        <WarehouseMarker plantData={plantData} filters={filters.warehouse} />
        {linePath.length === 2 && <ConnectionLine origin={linePath[0]} destination={linePath[1]} />}
      </Map>
    </APIProvider>
  )
}

export default MapComponent
