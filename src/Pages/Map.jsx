import React, { useEffect, useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Header from '../Components/Layout/Header';
import MapsDataHandler from '../Utils/MapsDataHandler';
import FilterBox from '../Components/ReUseable/FilterBox';
import TurbineMarkers from '../Components/Maps/TurbineMarker';
import TurbineDetailPanel from '../Components/Maps/TurbineDetailPanel';
import WarehouseMarker from '../Components/Maps/WarehouseMarker';
import ConnectionLine from '../Components/Maps/ConnectingLine';

const Maps = () => {
    const [TurbineData, setTurbineData] = useState([]);
    const [PlantData, setPlantData] = useState([]);
    const [linePath, setLinePath] = useState([]);
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

    const handleTurbineClick = (turbine) => {
        if (
            SelectedTurbine &&
            SelectedTurbine.TurbineName === turbine.TurbineName
        ) {
            setSelectedTurbine(null);
            setLinePath([]);
        } else {
            setSelectedTurbine(turbine);
        }
    };

    const handleMapClick = () => {
        setSelectedTurbine(null);
        setLinePath([]);
    };

    useEffect(() => {
        if (!SelectedTurbine) {
            setLinePath([]);
            return;
        }

        const turbineCoords = {
            lat: parseFloat(SelectedTurbine.TurbineLatitude),
            lng: parseFloat(SelectedTurbine.TurbineLongitude)
        };

        const haversineDistance = (lat1, lon1, lat2, lon2) => {
            const toRad = (value) => (value * Math.PI) / 180;
            const R = 6371; // Radius of Earth in km
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) *
                    Math.cos(toRad(lat2)) *
                    Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        const getFilteredWarehouses = () => {
            let filtered = [];

            if (Filters.warehouse.showAll && PlantData.all) {
                filtered = filtered.concat(PlantData.all);
            }

            if (Filters.warehouse.showMaint && PlantData.maint) {
                filtered = filtered.concat(PlantData.maint);
            }

            if (Filters.warehouse.showPlanning && PlantData.planning) {
                filtered = filtered.concat(PlantData.planning);
            }

            return filtered;
        };

        const findClosestWarehouse = () => {
            const warehouses = getFilteredWarehouses();
            if (!warehouses.length) return null;

            let closest = warehouses[0];
            let minDistance = haversineDistance(
                turbineCoords.lat,
                turbineCoords.lng,
                parseFloat(closest.Plant_Latitude),
                parseFloat(closest.Plant_Longitude)
            );

            for (let i = 1; i < warehouses.length; i++) {
                const wh = warehouses[i];
                const dist = haversineDistance(
                    turbineCoords.lat,
                    turbineCoords.lng,
                    parseFloat(wh.Plant_Latitude),
                    parseFloat(wh.Plant_Longitude)
                );

                if (dist < minDistance) {
                    minDistance = dist;
                    closest = wh;
                }
            }

            return closest;
        };

        const closest = findClosestWarehouse();

        if (closest) {
            const path = [
                turbineCoords,
                {
                    lat: parseFloat(closest.Plant_Latitude),
                    lng: parseFloat(closest.Plant_Longitude)
                }
            ];
            setLinePath(path);
        } else {
            setLinePath([]);
        }
    }, [SelectedTurbine, PlantData, Filters.warehouse]);

    useEffect(() => {
        const syncTurbineData = async () => {
            try {
                const response = await MapsDataHandler.getPlanningPlantData();
                setTurbineData(response || []);
            } catch (error) {
                console.error('Error syncing turbine data:', error);
            }
        };
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

        syncTurbineData();
        syncPlantData();
    }, []);

    return (
        <div className='flex flex-col h-screen w-screen z-10 space-y-4  bg-gray-950'>
            {/* Header Section */}
            <div className='flex justify-between items-center px-6 pt-6 bg-gray-900 bg-opacity-90 z-10'>
                <Header title='Map Overview' />
            </div>

            {/* Main Content */}
            <div className='flex flex-1 overflow-hidden'>
                {/* Map Section */}
                <div className='flex-1 relative'>
                    <APIProvider
                        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                        libraries={['geometry']}
                    >
                        <Map
                            defaultCenter={position}
                            defaultZoom={3}
                            mapId={process.env.REACT_APP_GOOGLE_MAPS_ID}
                            onClick={handleMapClick}
                        >
                            <TurbineMarkers
                                filters={Filters.turbine}
                                allData={TurbineData}
                                setSelectedTurbine={handleTurbineClick}
                            />
                            <WarehouseMarker
                                plantData={PlantData}
                                filters={Filters.warehouse}
                            />
                            {linePath.length === 2 && (
                                <ConnectionLine
                                    origin={linePath[0]}
                                    destination={linePath[1]}
                                />
                            )}
                        </Map>
                    </APIProvider>
                </div>

                {/* Sidebar */}
                <div className='flex flex-col space-y-4 p-4 w-[350px] bg-gray-900 text-white border-l border-gray-700 overflow-y-auto'>
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
