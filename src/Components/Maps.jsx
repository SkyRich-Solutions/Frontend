import React from 'react';
import {
    AdvancedMarker,
    APIProvider,
    Map,
    Pin
} from '@vis.gl/react-google-maps';
import TurbineData from '../MockData/TurbineData.json';
// import DataHandler from '../Utils/DataHandler';

const Maps = () => {
    const position = { lat: 0, lng: 0 };

    const Locations = TurbineData.map((turbine) => {
        return {
            lat: parseFloat(turbine.TurbineLatitude),
            lng: parseFloat(turbine.TurbineLongitude)
        };
    });

    console.log(Locations)

    return (
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <Map
                defaultCenter={position}
                defaultZoom={3}
                mapId={process.env.REACT_APP_GOOGLE_MAPS_ID}
            >
                {TurbineData.map((turbine, index) => {
                    return (
                        <AdvancedMarker
                            key={index}
                            position={Locations[index]}
                            title={turbine.FunctionalLoc}
                            onClick={() => console.log('Pin clicked!')}
                        >
                            <Pin
                                background="red"
                            ></Pin>
                        </AdvancedMarker>
                    );
                })}
            </Map>
        </APIProvider>
    );
};

export default Maps;
