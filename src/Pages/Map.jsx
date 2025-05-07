import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { Warehouse } from 'lucide-react';

import Header from '../Components/Layout/Header';
import MapsDataHandler from '../Utils/MapsDataHandler';
import FilterBox from '../Components/ReUseable/FilterBox';
import TurbineDetailPanel from '../Components/Maps/TurbineDetailPanel';
import WarehouseMarker from '../Components/Maps/WarehouseMarker';

const Maps = () => {
    const [TurbineData, setTurbineData] = useState([]);
    const [PlantData, setPlantData] = useState({ all: [], maint: [], planning: [] });
    const [SelectedTurbine, setSelectedTurbine] = useState(null);
    const [PolylineCoords, setPolylineCoords] = useState([]);
    const [PolylineColor, setPolylineColor] = useState('blue');
    const [RouteInfo, setRouteInfo] = useState(null);
    const [ConnectedPlant, setConnectedPlant] = useState(null);
    const [Filters, setFilters] = useState({
        turbine: { showAll: true },
        warehouse: { showAll: true, showMaint: true, showPlanning: true }
    });

    const position = [56.2639, 9.5018];

    const safeParseFloat = (val) => {
        if (typeof val === 'string') val = val.replace(',', '.');
        const parsed = parseFloat(val);
        return isNaN(parsed) ? null : parsed;
    };

    const isValidLatLng = (lat, lng) => typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);

    const handleFilterChange = (e, group) => {
        const { name, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [group]: { ...prev[group], [name]: checked }
        }));
    };

    const handleTurbineClick = (turbine) => {
        setSelectedTurbine(turbine);
    };

    const snapToRoad = async ([lng, lat]) => {
        try {
            const res = await axios.get('https://api.openrouteservice.org/v2/nearest', {
                params: {
                    api_key: process.env.REACT_APP_ORS_API_KEY,
                    point: `${lng},${lat}`,
                    radius: 1000
                }
            });
            const coords = res.data?.coordinates;
            return Array.isArray(coords) && coords.length === 2 ? coords : [lng, lat];
        } catch {
            return [lng, lat];
        }
    };

    useEffect(() => {
        if (!SelectedTurbine || !PlantData) {
            setPolylineCoords([]);
            setRouteInfo(null);
            setConnectedPlant(null);
            return;
        }

        const toRad = (value) => (value * Math.PI) / 180;
        const haversineDistance = (lat1, lng1, lat2, lng2) => {
            const R = 6371;
            const dLat = toRad(lat2 - lat1);
            const dLng = toRad(lng2 - lng1);
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        };

        const turbineLat = safeParseFloat(SelectedTurbine.TurbineLatitude);
        const turbineLng = safeParseFloat(SelectedTurbine.TurbineLongitude);
        if (!isValidLatLng(turbineLat, turbineLng)) {
            setPolylineCoords([]);
            setRouteInfo(null);
            setConnectedPlant(null);
            return;
        }

        const plantSources = [
            ...(Filters.warehouse.showAll ? PlantData.all : []),
            ...(Filters.warehouse.showMaint ? PlantData.maint : []),
            ...(Filters.warehouse.showPlanning ? PlantData.planning : [])
        ];

        const uniquePlantsMap = new Map();
        plantSources.forEach(plant => {
            const key = `${plant.Plant_Name}_${plant.Plant_Latitude}_${plant.Plant_Longitude}`;
            if (!uniquePlantsMap.has(key)) {
                uniquePlantsMap.set(key, plant);
            }
        });

        const allPlants = Array.from(uniquePlantsMap.values());

        let closestPlant = null;
        let minDistance = Infinity;

        for (const plant of allPlants) {
            const plantLat = safeParseFloat(plant.Plant_Latitude);
            const plantLng = safeParseFloat(plant.Plant_Longitude);
            if (!isValidLatLng(plantLat, plantLng)) continue;

            const distance = haversineDistance(turbineLat, turbineLng, plantLat, plantLng);
            if (distance < minDistance) {
                minDistance = distance;
                closestPlant = plant;
            }
        }

        if (!closestPlant) {
            setPolylineCoords([]);
            setRouteInfo(null);
            setConnectedPlant(null);
            return;
        }

        setConnectedPlant(closestPlant);

        const fetchRoute = async () => {
            try {
                const rawFrom = [turbineLng, turbineLat];
                const rawTo = [
                    safeParseFloat(closestPlant.Plant_Longitude),
                    safeParseFloat(closestPlant.Plant_Latitude)
                ];

                const from = await snapToRoad(rawFrom);
                const to = await snapToRoad(rawTo);

                const res = await axios.post('http://localhost:4000/api/ors-route', {
                    coordinates: [from, to]
                });

                const route = res.data.features[0].geometry.coordinates.map(
                    ([lng, lat]) => [lat, lng]
                );

                const distanceMeters = res.data.features[0].properties.summary.distance;
                const durationSeconds = res.data.features[0].properties.summary.duration;

                setRouteInfo({
                    distance: (distanceMeters / 1000).toFixed(2) + ' km',
                    duration: (durationSeconds / 60).toFixed(1) + ' min'
                });

                setPolylineColor('#22c55e');
                setPolylineCoords(route);
            } catch {
                setPolylineCoords([
                    [turbineLat, turbineLng],
                    [safeParseFloat(closestPlant.Plant_Latitude), safeParseFloat(closestPlant.Plant_Longitude)]
                ]);
                setRouteInfo({
                    distance: haversineDistance(
                        turbineLat, turbineLng,
                        safeParseFloat(closestPlant.Plant_Latitude),
                        safeParseFloat(closestPlant.Plant_Longitude)
                    ).toFixed(2) + ' km',
                    duration: 'Unknown'
                });
            }
        };

        fetchRoute();
    }, [SelectedTurbine, PlantData, Filters.warehouse]);

    useEffect(() => {
        const syncTurbineData = async () => {
            try {
                const res = await MapsDataHandler.getPlanningPlantData();
                setTurbineData(res || []);
            } catch (err) {
                console.error('Error syncing turbine data:', err);
            }
        };

        const syncPlantData = async () => {
            try {
                const [all, maint, planning] = await Promise.all([
                    MapsDataHandler.getWarehousePlantData(),
                    MapsDataHandler.getWarehouseManufacturingPlantData(),
                    MapsDataHandler.getWarehousePlanningPlantData()
                ]);
                setPlantData({ all: all || [], maint: maint || [], planning: planning || [] });
            } catch (err) {
                console.error('Error syncing plant data:', err);
            }
        };

        syncTurbineData();
        syncPlantData();
    }, []);

    const turbineIcon = new L.Icon({
        iconUrl: '/icons/wind-turbine.png',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
    });

    return (
        <div className="flex flex-col h-screen w-screen z-10 space-y-4 bg-gray-950">
            <div className="flex justify-between items-center px-6 pt-6 bg-gray-900 bg-opacity-90 z-10">
                <Header title="Map Overview" />
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 relative" style={{ height: '100vh' }}>
                    <MapContainer center={position} zoom={5} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {Filters.turbine.showAll &&
                            TurbineData.filter(t =>
                                isValidLatLng(safeParseFloat(t.TurbineLatitude), safeParseFloat(t.TurbineLongitude))
                            ).map((turbine, i) => (
                                <Marker
                                    key={`turbine-${i}`}
                                    position={[
                                        safeParseFloat(turbine.TurbineLatitude),
                                        safeParseFloat(turbine.TurbineLongitude)
                                    ]}
                                    icon={turbineIcon}
                                    eventHandlers={{ click: () => handleTurbineClick(turbine) }}
                                >
                                    <Popup>
                                        <strong>{turbine.FunctionalLoc}</strong><br />
                                        {turbine.TurbineModel}<br />
                                        {turbine.MaintPlant}
                                    </Popup>
                                </Marker>
                            ))}

                        <WarehouseMarker plantData={PlantData} filters={Filters.warehouse} />

                        {PolylineCoords.length > 0 && (
                            <Polyline positions={PolylineCoords} pathOptions={{ color: PolylineColor }} />
                        )}
                    </MapContainer>
                </div>

                <div className="flex flex-col space-y-4 p-4 w-[350px] bg-gray-900 text-white border-l border-gray-700 overflow-y-auto">
                    <div className="bg-gray-800 p-4 rounded-lg w-[300px]">
                        <div className="flex items-center justify-center w-full space-x-2">
                            <img src="/icons/wind-turbine.png" alt="Turbine Icon" className="w-5 h-5" />
                            <strong>Turbine</strong>
                        </div>
                        <FilterBox title="All Turbines" group="turbine" filterKey="showAll" filters={Filters.turbine} onChange={handleFilterChange} />
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg w-[300px] space-y-2">
                        <div className="flex items-center justify-center w-full space-x-2">
                            <div className="p-1 rounded-full bg-gray-500 text-white shadow-md">
                                <Warehouse size={16} />
                            </div>
                            <strong>Warehouse</strong>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="p-1 rounded-full bg-gray-500 text-white shadow-md">
                                <Warehouse size={16} />
                            </div>
                            <FilterBox title="Part Warehouse (Grey)" filterKey="showAll" group="warehouse" filters={Filters.warehouse} onChange={handleFilterChange} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="p-1 rounded-full bg-red-500 text-white shadow-md">
                                <Warehouse size={16} />
                            </div>
                            <FilterBox title="Maintenance Warehouse (Red)" filterKey="showMaint" group="warehouse" filters={Filters.warehouse} onChange={handleFilterChange} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="p-1 rounded-full bg-blue-500 text-white shadow-md">
                                <Warehouse size={16} />
                            </div>
                            <FilterBox title="Planning Warehouse (Blue)" filterKey="showPlanning" group="warehouse" filters={Filters.warehouse} onChange={handleFilterChange} />
                        </div>

                        <div className="text-xs text-gray-400 mt-2 px-1">
                            <div className="flex items-center space-x-2">
                                <div className="p-1 rounded-full bg-green-500 text-white shadow-md">
                                    <Warehouse size={12} />
                                </div>
                                <span>
                                    Shown as green when both <strong>Planning</strong> and <strong>Maintenance</strong> are selected and the plant has both roles.
                                </span>
                            </div>
                        </div>
                    </div>

                    <TurbineDetailPanel selectedTurbine={SelectedTurbine} />

                    {RouteInfo && ConnectedPlant && (
                        <div className="bg-gray-800 p-4 rounded-lg w-[300px]">
                            <div className="flex items-center justify-center w-full space-x-2">
                                <img src="/icons/wind-turbine.png" alt="Route Icon" className="w-5 h-5" />
                                <strong>Route Info</strong>
                            </div>
                            <div className="mt-2">
                                Connected to: <strong>{ConnectedPlant.Plant_Name}</strong><br />
                                Distance: {RouteInfo.distance}<br />
                                Duration: {RouteInfo.duration}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Maps;
