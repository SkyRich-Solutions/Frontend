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
    const [MaintPlantData, setMaintPlantData] = useState([]);
    const [PlanningPlantData, setPlanningPlantData] = useState([]);
    const [SelectedTurbine, setSelectedTurbine] = useState(null);
    const [PlantData, setPlantData] = useState([]);

    const [Filters, setFilters] = useState({
        turbine: {
            showAll: true,
            showMaint: true,
            showPlanning: true
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
    
    // const handleFilterChange = (e, group) => {
    //     const { name, checked } = e.target;

    //     setFilters((prev) => {
    //         let newGroupFilters = {
    //             ...prev[group],
    //             [name]: checked
    //         };

    //         // If 'showAll' is checked or unchecked, update all the checkboxes
    //         if (name === 'showAll') {
    //             newGroupFilters = {
    //                 ...newGroupFilters,
    //                 showMaint: checked,
    //                 showPlanning: checked
    //             };
    //         }

    //         // Check if all individual checkboxes are checked (showMaint and showPlanning in this case)
    //         const allChecked =
    //             newGroupFilters.showMaint && newGroupFilters.showPlanning;

    //         // If all are checked, check 'showAll'
    //         if (allChecked) {
    //             newGroupFilters.showAll = true;
    //         }

    //         // If any checkbox is unchecked, uncheck 'showAll' if all are not selected
    //         const allUnchecked =
    //             !newGroupFilters.showMaint &&
    //             !newGroupFilters.showPlanning &&
    //             !newGroupFilters.showAll;

    //         if (allUnchecked) {
    //             newGroupFilters.showAll = false;
    //         }

    //         return {
    //             ...prev,
    //             [group]: newGroupFilters
    //         };
    //     });
    // };

    useEffect(() => {
        const fetchTurbineData = async () => {
            try {
                const planningData =
                    await MapsDataHandler.getPlanningPlantData();
                const maintData = await MapsDataHandler.getMaintPlantData();

                setPlanningPlantData(planningData);
                setMaintPlantData(maintData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const syncPlantData = async () => {
            try {
                const WarehouseData = await MapsDataHandler.getPlantData();
                setPlantData(WarehouseData);
                // console.log('Warehouse Data:', PlantData);
            } catch (error) {
                console.error('Error syncing plant data:', error);
            }
        };

        fetchTurbineData();
        syncPlantData();
    }, []);

    return (
        <div className='flex-1 overflow-auto z-1 h-auto space-y-4'>
            <Header title='Map' />
            <div className='flex w-full h-[90vh] ml-4'>
                {/* Map Section */}
                <div className='flex-1 relative'>
                    <APIProvider
                        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                    >
                        <Map
                            defaultCenter={position}
                            defaultZoom={3}
                            mapId={process.env.REACT_APP_GOOGLE_MAPS_ID}
                        >
                            <TurbineMarkers
                                filters={Filters.turbine}
                                allData={TurbineData}
                                maintData={MaintPlantData}
                                planningData={PlanningPlantData}
                                setSelectedTurbine={setSelectedTurbine}
                            />

                            <WarehouseMarker
                                plantData={PlantData}
                                filters={Filters.warehouse}
                            />
                        </Map>
                    </APIProvider>
                </div>

                {/* Filter and Detail Panel Section */}

                {/* Turbine Filtering */}
                <div className='flex flex-col space-y-4 p-4 w-[350px] bg-gray-900 text-white border-l border-gray-700 '>
                    <div className='bg-gray-800 bg-opacity-60 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex flex-wrap gap-4 items-center rounded-lg w-[300px]'>
                        <div className='flex justify-center w-full'>
                            <strong>Turbine</strong>
                        </div>

                        <FilterBox
                            title='All Turbines (Grey)'
                            group='turbine'
                            filterKey='showAll'
                            filters={Filters.turbine}
                            onChange={handleFilterChange}
                        />
                        <FilterBox
                            title='Maintenance Turbines (Red)'
                            filterKey='showMaint'
                            group='turbine'
                            filters={Filters.turbine}
                            onChange={handleFilterChange}
                        />
                        <FilterBox
                            title='Planning Turbines (Blue)'
                            filterKey='showPlanning'
                            group='turbine'
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
                            title='All Warehouse (Grey)'
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
