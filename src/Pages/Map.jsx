// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useState } from 'react';
// import { APIProvider, Map } from '@vis.gl/react-google-maps';
// import Header from '../Components/Layout/Header';
// import TurbineData from '../MockData/TurbineData.json';
// import MapsDataHandler from '../Utils/MapsDataHandler';
// import FilterBox from '../Components/ReUseable/FilterBox';
// import TurbineMarkers from '../Components/Maps/TurbineMarker';
// import TurbineDetailPanel from '../Components/Maps/TurbineDetailPanel';
// import WarehouseMarker from '../Components/Maps/WarehouseMarker';
// import ConnectionLine from '../Components/Maps/ConnectingLine';

// const Maps = () => {
//     const [PlantData, setPlantData] = useState([]);
//     const [linePath, setLinePath] = useState([]);

//     const [SelectedTurbine, setSelectedTurbine] = useState(null);

//     console.log('SelectedTurbine:', SelectedTurbine);

//     const [Filters, setFilters] = useState({
//         turbine: {
//             showAll: true
//         },
//         warehouse: {
//             showAll: true,
//             showMaint: true,
//             showPlanning: true
//         }
//     });

//     const position = { lat: 0, lng: 0 };

//     const handleFilterChange = (e, group) => {
//         const { name, checked } = e.target;
//         setFilters((prev) => ({
//             ...prev,
//             [group]: {
//                 ...prev[group],
//                 [name]: checked
//             }
//         }));
//     };



//     useEffect(() => {
//         if (!SelectedTurbine || !PlantData.maint) return;
    
//         // If user re-clicks the same turbine, toggle off the line
//         if (
//             linePath.length > 0 &&
//             linePath[0]?.lat === parseFloat(SelectedTurbine.TurbineLatitude) &&
//             linePath[0]?.lng === parseFloat(SelectedTurbine.TurbineLongitude)
//         ) {
//             setLinePath([]);
//             return;
//         }
    
//         try {
//             const turbineCoords = {
//                 lat: parseFloat(SelectedTurbine.TurbineLatitude),
//                 lng: parseFloat(SelectedTurbine.TurbineLongitude)
//             };
    
//             const path = [turbineCoords];
    
//             // Add maintenance location if filter is enabled
//             if (Filters.warehouse.showMaint) {
//                 const maintLocation = PlantData.maint.find(
//                     (item) => item.Plant_Name === SelectedTurbine.MaintPlant
//                 );
    
//                 if (maintLocation) {
//                     path.push({
//                         lat: parseFloat(maintLocation.Plant_Latitude),
//                         lng: parseFloat(maintLocation.Plant_Longitude)
//                     });
//                 }
//             }
    
//             // Add planning location if filter is enabled
//             if (Filters.warehouse.showPlanning) {
//                 const planningLocation = PlantData.maint.find(
//                     (item) => item.Plant_Name === SelectedTurbine.PlanningPlant
//                 );
    
//                 if (planningLocation) {
//                     path.push({
//                         lat: parseFloat(planningLocation.Plant_Latitude),
//                         lng: parseFloat(planningLocation.Plant_Longitude)
//                     });
//                 }
//             }
    
//             // Only show the path if there's more than one point (turbine + any plant)
//             if (path.length > 1) {
//                 setLinePath(path);
//             } else {
//                 setLinePath([]);
//             }
//         } catch (error) {
//             console.error('Error during plant lookup:', error);
//             setLinePath([]);
//         }
//     }, [SelectedTurbine, PlantData, Filters.warehouse]);
    


//     useEffect(() => {
//         const syncPlantData = async () => {
//             try {
//                 const [all, maint, planning] = await Promise.all([
//                     MapsDataHandler.getWarehousePlantData(),
//                     MapsDataHandler.getWarehouseManufacturingPlantData(),
//                     MapsDataHandler.getWarehousePlanningPlantData()
//                 ]);

//                 setPlantData({
//                     all: all || [],
//                     maint: maint || [],
//                     planning: planning || []
//                 });
//             } catch (error) {
//                 console.error('Error syncing plant data:', error);
//             }
//         };

//         syncPlantData();
//     }, []);

//     return (
//         <div className='flex-1 overflow-auto z-1 h-auto space-y-4'>
//             <Header title='Map' />
//             <div className='flex w-full h-[90vh] ml-4'>
//                 {/* Map Section */}
//                 <div className='flex-1 relative'>
//                     <APIProvider
//                         apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//                     >
//                         <Map
//                             defaultCenter={position}
//                             defaultZoom={3}
//                             mapId={process.env.REACT_APP_GOOGLE_MAPS_ID}
//                         >
//                             <TurbineMarkers
//                                 filters={Filters.turbine}
//                                 allData={TurbineData}
//                                 setSelectedTurbine={setSelectedTurbine}
//                             />

//                             <WarehouseMarker
//                                 plantData={PlantData}
//                                 filters={Filters.warehouse}
//                             />

//                             {linePath.length > 0 && (
//                                 <ConnectionLine path={linePath} />
//                             )}
//                         </Map>
//                     </APIProvider>
//                 </div>

//                 {/* Sidebar */}
//                 <div className='flex flex-col space-y-4 p-4 w-[350px] bg-gray-900 text-white border-l border-gray-700 '>
//                     {/* Turbine Filtering */}
//                     <div className='bg-gray-800 bg-opacity-60 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex flex-wrap gap-4 items-center rounded-lg w-[300px]'>
//                         <div className='flex justify-center w-full'>
//                             <strong>Turbine</strong>
//                         </div>
//                         <FilterBox
//                             title='All Turbines'
//                             group='turbine'
//                             filterKey='showAll'
//                             filters={Filters.turbine}
//                             onChange={handleFilterChange}
//                         />
//                     </div>

//                     {/* Warehouse Filtering */}
//                     <div className='bg-gray-800 bg-opacity-60 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex flex-wrap gap-4 items-center rounded-lg w-[300px]'>
//                         <div className='flex justify-center w-full'>
//                             <strong>Warehouse</strong>
//                         </div>

//                         <FilterBox
//                             title='Part Warehouse (Grey)'
//                             filterKey='showAll'
//                             group='warehouse'
//                             filters={Filters.warehouse}
//                             onChange={handleFilterChange}
//                         />
//                         <FilterBox
//                             title='Maintenance Warehouse (Red)'
//                             filterKey='showMaint'
//                             group='warehouse'
//                             filters={Filters.warehouse}
//                             onChange={handleFilterChange}
//                         />
//                         <FilterBox
//                             title='Planning Warehouse (Blue)'
//                             filterKey='showPlanning'
//                             group='warehouse'
//                             filters={Filters.warehouse}
//                             onChange={handleFilterChange}
//                         />
//                     </div>

//                     <TurbineDetailPanel selectedTurbine={SelectedTurbine} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Maps;


/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Header from '../Components/Layout/Header';
import TurbineData from '../MockData/TurbineData.json';
import MapsDataHandler from '../Utils/MapsDataHandler';
import FilterBox from '../Components/ReUseable/FilterBox';
import TurbineMarkers from '../Components/Maps/TurbineMarker';
import TurbineDetailPanel from '../Components/Maps/TurbineDetailPanel';
import WarehouseMarker from '../Components/Maps/WarehouseMarker';
import ConnectionLine from '../Components/Maps/ConnectingLine';

const Maps = () => {
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
        if (!SelectedTurbine || !PlantData.maint) {
            setLinePath([]);
            return;
        }

        try {
            const turbineCoords = {
                lat: parseFloat(SelectedTurbine.TurbineLatitude),
                lng: parseFloat(SelectedTurbine.TurbineLongitude)
            };

            const path = [turbineCoords];

            if (Filters.warehouse.showMaint) {
                const maintLocation = PlantData.maint.find(
                    (item) => item.Plant_Name === SelectedTurbine.MaintPlant
                );

                if (maintLocation) {
                    path.push({
                        lat: parseFloat(maintLocation.Plant_Latitude),
                        lng: parseFloat(maintLocation.Plant_Longitude)
                    });
                }
            }

            if (Filters.warehouse.showPlanning) {
                const planningLocation = PlantData.maint.find(
                    (item) => item.Plant_Name === SelectedTurbine.PlanningPlant
                );

                if (planningLocation) {
                    path.push({
                        lat: parseFloat(planningLocation.Plant_Latitude),
                        lng: parseFloat(planningLocation.Plant_Longitude)
                    });
                }
            }

            setLinePath(path.length > 1 ? path : []);
        } catch (error) {
            console.error('Error during plant lookup:', error);
            setLinePath([]);
        }
    }, [SelectedTurbine, PlantData, Filters.warehouse]);

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
                    <APIProvider
                        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
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

                            {linePath.length > 0 && (
                                <ConnectionLine path={linePath} />
                            )}
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
