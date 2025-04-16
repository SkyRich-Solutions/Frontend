import React from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Warehouse } from 'lucide-react';

const isValidLatLng = (lat, lng) =>
    !isNaN(lat) &&
    !isNaN(lng) &&
    typeof lat === 'number' &&
    typeof lng === 'number';

const WarehouseMarker = ({ plantData, filters }) => {
    console.log('Warehouse Data:', plantData);

    return (
        <div>
            {filters.showAll &&
                plantData.map((warehouse, index) => {
                    const lat = parseFloat(warehouse.Plant_Latitude);
                    const lng = parseFloat(warehouse.Plant_Longitude);
                    if (!isValidLatLng(lat, lng)) return null;

                    return (
                        <AdvancedMarker
                            key={`warehouse-${index}`}
                            position={{ lat, lng }}
                            title={warehouse.Plant_Name}
                        >
                            <div className='p-1 rounded-full bg-gray-500 text-white'>
                                <Warehouse
                                    size={20}
                                    color='white'
                                    className='m-1'
                                />
                            </div>
                        </AdvancedMarker>
                    );
                })}

            {filters.showMaint &&
                plantData.map((warehouse, index) => {
                    const lat = parseFloat(warehouse.Plant_Latitude);
                    const lng = parseFloat(warehouse.Plant_Longitude);
                    if (!isValidLatLng(lat, lng)) return null;

                    return (
                        <AdvancedMarker
                            key={`warehouse-${index}`}
                            position={{ lat, lng }}
                            title={warehouse.Plant_Name}
                        >
                            <div className='p-1 rounded-full bg-red-500 text-white'>
                                <Warehouse
                                    size={20}
                                    color='white'
                                    className='m-1'
                                />
                            </div>
                        </AdvancedMarker>
                    );
                })}

            {filters.showPlanning &&
                plantData.map((warehouse, index) => {
                    const lat = parseFloat(warehouse.Plant_Latitude);
                    const lng = parseFloat(warehouse.Plant_Longitude);
                    if (!isValidLatLng(lat, lng)) return null;

                    return (
                        <AdvancedMarker
                            key={`warehouse-${index}`}
                            position={{ lat, lng }}
                            title={warehouse.Plant_Name}
                        >
                            <div className='p-1 rounded-full bg-blue-500 text-white'>
                                <Warehouse
                                    size={20}
                                    color='white'
                                    className='m-1'
                                />
                            </div>
                        </AdvancedMarker>
                    );
                })}
        </div>
    );
};

export default WarehouseMarker;
