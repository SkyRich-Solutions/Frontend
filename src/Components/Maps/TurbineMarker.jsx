import React from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

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
                        <div className='p-1 rounded-full bg-zinc-500'>
                            <img
                                src='/icons/turbine.png'
                                alt='Turbine'
                                className='w-6 h-6'
                            />
                        </div>
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
                            <div className='p-1 rounded-full bg-red-500'>
                                <img
                                    src='/icons/turbine.png'
                                    alt='Turbine'
                                    className='w-6 h-6'
                                />
                            </div>
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
                            <div className='p-1 rounded-full bg-blue-500'>
                                <img
                                    src='/icons/turbine.png'
                                    alt='Turbine'
                                    className='w-6 h-6'
                                />
                            </div>
                        </AdvancedMarker>
                    );
                })}
        </>
    );
};

export default TurbineMarkers;
