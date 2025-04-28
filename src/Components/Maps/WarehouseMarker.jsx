
import React from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Warehouse } from 'lucide-react';

const isValidLatLng = (lat, lng) =>
    !isNaN(lat) && !isNaN(lng) && typeof lat === 'number' && typeof lng === 'number';

const renderMarkers = (data = [], color, prefix) =>
    data.map((warehouse, index) => {
        const lat = parseFloat(warehouse.Plant_Latitude);
        const lng = parseFloat(warehouse.Plant_Longitude);
        if (!isValidLatLng(lat, lng)) return null;

        return (
            <AdvancedMarker
                key={`${prefix}-${index}`}
                position={{ lat, lng }}
                title={warehouse.Plant_Name}
            >
                <div className={`p-1 rounded-full ${color} text-white`}>
                    <Warehouse size={20} color="white" className="m-1" />
                </div>
            </AdvancedMarker>
        );
    });

const WarehouseMarker = ({ plantData = {}, filters }) => {
    return (
        <>
            {filters?.showAll && renderMarkers(plantData.all, 'bg-gray-500', 'warehouse-all')}
            {filters?.showMaint && renderMarkers(plantData.maint, 'bg-red-500', 'warehouse-maint')}
            {filters?.showPlanning && renderMarkers(plantData.planning, 'bg-blue-500', 'warehouse-planning')}
        </>
    );
};

export default WarehouseMarker;
