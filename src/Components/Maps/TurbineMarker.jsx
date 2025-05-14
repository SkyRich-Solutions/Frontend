import React from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

const TurbineMarkers = ({ filters, allData, setSelectedTurbine }) => {
    console.log('allData', allData);
    return (
        <>
            {filters.showAll &&
                allData.map((turbine, index) => (
                    <AdvancedMarker
                        key={`all-${index}`}
                        position={{
                            lat: turbine.TurbineLatitude,
                            lng: turbine.TurbineLongitude
                        }}
                        title={turbine.FunctionalLoc}
                        onClick={() => setSelectedTurbine(turbine)}
                    >
                        <div className='p-1 rounded-full '>
                            <img
                                src='/icons/turbine.png'
                                alt='Turbine'
                                className='w-6 h-6'
                            />
                        </div>
                    </AdvancedMarker>
                ))}
        </>
    );
};

export default TurbineMarkers;
