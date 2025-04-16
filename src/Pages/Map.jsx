

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    APIProvider,
    Map,
} from '@vis.gl/react-google-maps';
import Header from '../Components/Layout/Header';
import TurbineData from '../MockData/TurbineData.json';
import MapsDataHandler from '../Utils/MapsDataHandler';
import FilterBox from '../Components/ReUseable/FilterBox';
import TurbineMarkers from '../Components/Maps/TurbineMarker';
import TurbineDetailPanel from '../Components/Maps/TurbineDetailPanel';
import WarehouseMarker from '../Components/Maps/WarehouseMarker';

const Maps = () => {
    const [PlantData, setPlantData] = useState([]);
    const [SelectedTurbine, setSelectedTurbine] = useState(null);

    const [Filters, setFilters] = useState({
        turbine: {
            showAll: true
        },
        warehouse: {
            showAll: true,
            showMaint: true,
            showPlanning: true
        }
    });

    const position = { lat: 0, lng: 0 };

    const handleFilterChange = (e, group) => {
        const { name, checked } = e.target;
        setFilters((prev) => ({
            ...prev,
            [group]: {
                ...prev[group],
                [name]: checked
            }
        }));
    };

    useEffect(() => {
        const syncPlantData = async () => {
            try {
                const [all, maint, planning] = await Promise.all([
                    MapsDataHandler.getWarehousePlantData(),
                    MapsDataHandler.getWarehouseManufacturingPlantData(),
                    MapsDataHandler.getWarehousePlanningPlantData()
                ]);
    
                setPlantData({
                    all: all || [],
                    maint: maint || [],
                    planning: planning || []
                });
            } catch (error) {
                console.error('Error syncing plant data:', error);
            }
        };
    
        syncPlantData();
    }, []);

    return (
        <div className='flex-1 overflow-auto z-1 h-auto space-y-4'>
            <Header title='Map' />
            <div className='flex w-full h-[90vh] ml-4'>
                {/* Map Section */}
                <div className='flex-1 relative'>
                    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                        <Map
                            defaultCenter={position}
                            defaultZoom={3}
                            mapId={process.env.REACT_APP_GOOGLE_MAPS_ID}
                        >
                            <TurbineMarkers
                                filters={Filters.turbine}
                                allData={TurbineData}
                                setSelectedTurbine={setSelectedTurbine}
                            />

                            <WarehouseMarker
                                plantData={PlantData}
                                filters={Filters.warehouse}
                            />
                        </Map>
                    </APIProvider>
                </div>

                {/* Sidebar */}
                <div className='flex flex-col space-y-4 p-4 w-[350px] bg-gray-900 text-white border-l border-gray-700 '>
                    {/* Turbine Filtering */}
                    <div className='bg-gray-800 bg-opacity-60 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex flex-wrap gap-4 items-center rounded-lg w-[300px]'>
                        <div className='flex justify-center w-full'>
                            <strong>Turbine</strong>
                        </div>
                        <FilterBox
                            title='All Turbines'
                            group='turbine'
                            filterKey='showAll'
                            filters={Filters.turbine}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* Warehouse Filtering */}
                    <div className='bg-gray-800 bg-opacity-60 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex flex-wrap gap-4 items-center rounded-lg w-[300px]'>
                        <div className='flex justify-center w-full'>
                            <strong>Warehouse</strong>
                        </div>

                        <FilterBox
                            title='Part Warehouse (Grey)'
                            filterKey='showAll'
                            group='warehouse'
                            filters={Filters.warehouse}
                            onChange={handleFilterChange}
                        />
                        <FilterBox
                            title='Maintenance Warehouse (Red)'
                            filterKey='showMaint'
                            group='warehouse'
                            filters={Filters.warehouse}
                            onChange={handleFilterChange}
                        />
                        <FilterBox
                            title='Planning Warehouse (Blue)'
                            filterKey='showPlanning'
                            group='warehouse'
                            filters={Filters.warehouse}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <TurbineDetailPanel selectedTurbine={SelectedTurbine} />
                </div>
            </div>
        </div>
    );
};

export default Maps;
