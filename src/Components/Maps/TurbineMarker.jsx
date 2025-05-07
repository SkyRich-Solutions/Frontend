import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '../Components/Layout/Header';
import MapsDataHandler from '../Utils/MapsDataHandler';
import FilterBox from '../Components/ReUseable/FilterBox';
import L from 'leaflet';
import axios from 'axios';

const Maps = () => {
    const [TurbineData, setTurbineData] = useState([]);
    const [PlantData, setPlantData] = useState([]);
    const [SelectedTurbine, setSelectedTurbine] = useState(null);
    const [PolylineCoords, setPolylineCoords] = useState([]);
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

    const position = [0, 0];

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
            setPolylineCoords([]);
        } else {
            setSelectedTurbine(turbine);
        }
    };

    useEffect(() => {
        if (!SelectedTurbine || !PlantData.maint) {
            setPolylineCoords([]);
            return;
        }

        const turbineCoords = [
            parseFloat(SelectedTurbine.TurbineLatitude),
            parseFloat(SelectedTurbine.TurbineLongitude)
        ];

        const maintLocation = PlantData.maint.find(
            (item) => item.Plant_Name === SelectedTurbine.MaintPlant
        );

        if (!maintLocation) return;

        const plantCoords = [
            parseFloat(maintLocation.Plant_Latitude),
            parseFloat(maintLocation.Plant_Longitude)
        ];

        const fetchRoute = async () => {
            try {
                const response = await axios.post(
                    'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
                    {
                        coordinates: [
                            [turbineCoords[1], turbineCoords[0]],
                            [plantCoords[1], plantCoords[0]]
                        ]
                    },
                    {
                        headers: {
                            Authorization: process.env.REACT_APP_ORS_API_KEY,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                const coords = response.data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
                setPolylineCoords(coords);
            } catch (err) {
                console.error('Failed to fetch ORS route:', err);
            }
        };

        fetchRoute();
    }, [SelectedTurbine, PlantData]);

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

    const customIcon = new L.Icon({
        iconUrl: '/icons/wind-turbine.png',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
    });

    const renderPlantMarkers = (data = [], color, prefix, label) =>
        data.map((plant, index) => {
            const lat = parseFloat(plant.Plant_Latitude);
            const lng = parseFloat(plant.Plant_Longitude);
            if (isNaN(lat) || isNaN(lng)) return null;

            return (
                <Marker
                    key={`${prefix}-${index}`}
                    position={[lat, lng]}
                    icon={L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style='background:${color};width:12px;height:12px;border-radius:50%;'></div>`,
                        iconSize: [12, 12],
                        iconAnchor: [6, 6]
                    })}
                >
                    <Popup>
                        <strong>{plant.Plant_Name}</strong><br />
                        Type: {label}
                    </Popup>
                </Marker>
            );
        });

    return (
        <div className="flex flex-col h-screen w-screen z-10 space-y-4 bg-gray-950">
            {/* Header Section */}
            <div className="flex justify-between items-center px-6 pt-6 bg-gray-900 bg-opacity-90 z-10">
                <Header title="Map Overview" />
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Map Section */}
                <div className="flex-1 relative">
                    <MapContainer center={position} zoom={3} className="w-full h-full z-0">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {Filters.turbine.showAll &&
                            TurbineData.map((turbine, index) => (
                                <Marker
                                    key={index}
                                    position={[
                                        turbine.TurbineLatitude,
                                        turbine.TurbineLongitude
                                    ]}
                                    icon={customIcon}
                                    eventHandlers={{
                                        click: () => handleTurbineClick(turbine)
                                    }}
                                >
                                    <Popup>
                                        <strong>{turbine.FunctionalLoc}</strong><br />
                                        {turbine.TurbineModel}<br />
                                        {turbine.MaintPlant}
                                    </Popup>
                                </Marker>
                            ))}

                        {Filters.warehouse.showMaint && renderPlantMarkers(PlantData.maint, '#dc2626', 'maint', 'Maintenance')}
                        {Filters.warehouse.showPlanning && renderPlantMarkers(PlantData.planning, '#2563eb', 'planning', 'Planning')}
                        {Filters.warehouse.showAll && renderPlantMarkers(PlantData.all, '#6b7280', 'all', 'Warehouse')}

                        {PolylineCoords.length > 0 && (
                            <Polyline positions={PolylineCoords} pathOptions={{ color: 'blue' }} />
                        )}
                    </MapContainer>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col space-y-4 p-4 w-[350px] bg-gray-900 text-white border-l border-gray-700 overflow-y-auto">
                    {/* Turbine Filtering */}
                    <div className="bg-gray-800 bg-opacity-60 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex flex-wrap gap-4 items-center rounded-lg w-[300px]">
                        <div className="flex justify-center w-full">
                            <strong>Turbine</strong>
                        </div>
                        <FilterBox
                            title="All Turbines"
                            group="turbine"
                            filterKey="showAll"
                            filters={Filters.turbine}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* Warehouse Filtering */}
                    <div className="bg-gray-800 bg-opacity-60 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex flex-wrap gap-4 items-center rounded-lg w-[300px]">
                        <div className="flex justify-center w-full">
                            <strong>Warehouse</strong>
                        </div>
                        <FilterBox
                            title="Part Warehouse (Grey)"
                            filterKey="showAll"
                            group="warehouse"
                            filters={Filters.warehouse}
                            onChange={handleFilterChange}
                        />
                        <FilterBox
                            title="Maintenance Warehouse (Red)"
                            filterKey="showMaint"
                            group="warehouse"
                            filters={Filters.warehouse}
                            onChange={handleFilterChange}
                        />
                        <FilterBox
                            title="Planning Warehouse (Blue)"
                            filterKey="showPlanning"
                            group="warehouse"
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
