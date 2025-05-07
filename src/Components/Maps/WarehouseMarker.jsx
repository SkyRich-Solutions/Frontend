import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { createRoot } from 'react-dom/client';
import { Warehouse } from 'lucide-react';

const isValidLatLng = (lat, lng) =>
    typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);

const createReactDivIcon = (colorClass) => {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(
        <div className={`p-1 rounded-full ${colorClass} text-white shadow-md`}>
            <Warehouse size={20} color="white" className="m-1" />
        </div>
    );
    return new L.DivIcon({
        html: container,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    });
};

const WarehouseMarker = ({ plantData = {}, filters = {} }) => {
    const combined = useMemo(() => {
        const merged = {};

        const tag = (list = [], type) => {
            list.forEach((p) => {
                const key = `${p.Plant_Name}_${p.Plant_Latitude}_${p.Plant_Longitude}`;
                if (!merged[key]) {
                    merged[key] = { ...p, isMaint: false, isPlanning: false };
                }
                if (type === 'maint') merged[key].isMaint = true;
                if (type === 'planning') merged[key].isPlanning = true;
            });
        };

        if (filters.showMaint) tag(plantData.maint, 'maint');
        if (filters.showPlanning) tag(plantData.planning, 'planning');
        if (filters.showAll) tag(plantData.all, 'all');

        return Object.values(merged);
    }, [plantData, filters]);

    return (
        <>
            {combined.map((plant, index) => {
                const lat = parseFloat(plant.Plant_Latitude);
                const lng = parseFloat(plant.Plant_Longitude);
                if (!isValidLatLng(lat, lng)) return null;

                let color = 'bg-gray-500';
                if (plant.isMaint && plant.isPlanning) color = 'bg-green-500';
                else if (plant.isMaint) color = 'bg-red-500';
                else if (plant.isPlanning) color = 'bg-blue-500';

                return (
                    <Marker
                        key={`plant-${index}`}
                        position={[lat, lng]}
                        icon={createReactDivIcon(color)}
                    >
                        <Popup>
                            <strong>{plant.Plant_Name}</strong><br />
                            Role: {plant.isMaint && plant.isPlanning ? 'Both'
                                : plant.isMaint ? 'Maintenance'
                                : plant.isPlanning ? 'Planning'
                                : 'Unknown'}
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default WarehouseMarker;
