import React from 'react';
import { AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const isValidLatLng = (lat, lng) =>
    !isNaN(lat) &&
    !isNaN(lng) &&
    typeof lat === 'number' &&
    typeof lng === 'number';

const TurbineMarkers = ({
    filters,
    allData,
    maintData,
    planningData,
    setSelectedTurbine
}) => {
    return (
        <>
            {filters.showAll &&
                allData.map((turbine, index) => (
                    <AdvancedMarker
                        key={`all-${index}`}
                        position={{
                            lat: parseFloat(turbine.TurbineLatitude),
                            lng: parseFloat(turbine.TurbineLongitude)
                        }}
                        title={turbine.FunctionalLoc}
                        onClick={() => setSelectedTurbine(turbine)}
                    >
                        <Pin background='gray' />
                    </AdvancedMarker>
                ))}

            {filters.showMaint &&
                maintData.map((turbine, index) => {
                    const lat = parseFloat(turbine.TurbineLatitude);
                    const lng = parseFloat(turbine.TurbineLongitude);
                    if (!isValidLatLng(lat, lng)) return null;

                    return (
                        <AdvancedMarker
                            key={`maint-${index}`}
                            position={{ lat, lng }}
                            title={`MaintPlant: ${turbine.FunctionalLoc}`}
                            onClick={() => setSelectedTurbine(turbine)}
                        >
                            <Pin background='red' />
                        </AdvancedMarker>
                    );
                })}

            {filters.showPlanning &&
                planningData.map((turbine, index) => {
                    const lat = parseFloat(turbine.TurbineLatitude);
                    const lng = parseFloat(turbine.TurbineLongitude);
                    if (!isValidLatLng(lat, lng)) return null;

                    return (
                        <AdvancedMarker
                            key={`planning-${index}`}
                            position={{ lat, lng }}
                            title={`PlanningPlant: ${turbine.FunctionalLoc}`}
                            onClick={() => setSelectedTurbine(turbine)}
                        >
                            <Pin background='blue' />
                        </AdvancedMarker>
                    );
                })}
        </>
    );
};

export default TurbineMarkers;
