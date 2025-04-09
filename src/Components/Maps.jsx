import React, { useEffect, useState } from 'react';
import {
    AdvancedMarker,
    APIProvider,
    Map,
    Pin
} from '@vis.gl/react-google-maps';
import TurbineData from '../MockData/TurbineData.json';
import MapsDataHandler from '../Utils/MapsDataHandler.js';
import Checkbox from './ReUseable/ChechBox.jsx';

const Maps = () => {
    const [MaintPlantData, setMaintPlantData] = useState([]);
    const [PlanningPlantData, setPlanningPlantData] = useState([]);
    const [Filters, setFilters] = useState({
        showAll: true,
        showMaint: true,
        showPlanning: true
    });

    const position = { lat: 0, lng: 0 };

    const isValidLatLng = (lat, lng) => {
        return (
            !isNaN(lat) &&
            !isNaN(lng) &&
            typeof lat === 'number' &&
            typeof lng === 'number'
        );
    };

    const handleFilterChange = (e) => {
        const { name, checked } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: checked
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            let planningData = [];
            let maintData = [];
            try {
                planningData = await MapsDataHandler.getPlanningPlantData();
                maintData = await MapsDataHandler.getMaintPlantData();
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            if (planningData) setPlanningPlantData(planningData);
            if (maintData) setMaintPlantData(maintData);

            console.log('Planning Plant Data:', planningData);
            console.log('Maint Plant Data:', maintData);
        };

        fetchData();
    }, []);

    return (
        <>
            <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex items-center justify-between rounded-lg'>
                <h2 className='text-lg font-bold'>Filter Options</h2>
                <label className='flex gap-2 items-center justify-center'>
                    <Checkbox
                        name='showAll'
                        checked={Filters.showAll}
                        onChange={handleFilterChange}
                    />
                    Show All (Gray)
                </label>
                <label className='flex gap-2 items-center justify-center'>
                    <Checkbox
                        name='showMaint'
                        checked={Filters.showMaint}
                        onChange={handleFilterChange}
                    />
                    Show Maintenance (Red)
                </label>
                <label className='flex gap-2 items-center justify-center'>
                    <Checkbox
                        name='showPlanning'
                        checked={Filters.showPlanning}
                        onChange={handleFilterChange}
                    />
                    Show Planning (Blue)
                </label>
            </div>

            <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <Map
                    defaultCenter={position}
                    defaultZoom={3}
                    mapId={process.env.REACT_APP_GOOGLE_MAPS_ID}
                >
                    {/* All Turbines (Gray) */}
                    {Filters.showAll &&
                        TurbineData.map((turbine, index) => (
                            <AdvancedMarker
                                key={`all-${index}`}
                                position={{
                                    lat: parseFloat(turbine.TurbineLatitude),
                                    lng: parseFloat(turbine.TurbineLongitude)
                                }}
                                title={turbine.FunctionalLoc}
                            >
                                <Pin background='gray' />
                            </AdvancedMarker>
                        ))}

                    {/* MaintPlant - Red */}
                    {Filters.showMaint &&
                        MaintPlantData.map((turbine, index) => {
                            const lat = parseFloat(turbine.TurbineLatitude);
                            const lng = parseFloat(turbine.TurbineLongitude);
                            if (!isValidLatLng(lat, lng)) return null;

                            return (
                                <AdvancedMarker
                                    key={`maint-${index}`}
                                    position={{ lat, lng }}
                                    title={`MaintPlant: ${turbine.FunctionalLoc}`}
                                >
                                    <Pin background='red' />
                                </AdvancedMarker>
                            );
                        })}

                    {/* PlanningPlant - Blue */}
                    {Filters.showPlanning &&
                        PlanningPlantData.map((turbine, index) => {
                            const lat = parseFloat(turbine.TurbineLatitude);
                            const lng = parseFloat(turbine.TurbineLongitude);
                            if (!isValidLatLng(lat, lng)) return null;

                            return (
                                <AdvancedMarker
                                    key={`planning-${index}`}
                                    position={{ lat, lng }}
                                    title={`PlanningPlant: ${turbine.FunctionalLoc}`}
                                >
                                    <Pin background='blue' />
                                </AdvancedMarker>
                            );
                        })}
                </Map>
            </APIProvider>
        </>
    );
};

export default Maps;
