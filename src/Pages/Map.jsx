import React, { useEffect, useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Header from '../Components/Layout/Header';
import TurbineData from '../MockData/TurbineData.json';
import MapsDataHandler from '../Utils/MapsDataHandler';
import FilterBox from '../Components/ReUseable/FilterBox';
import TurbineMarkers from '../Components/Maps/TurbineMarker';
import TurbineDetailPanel from '../Components/Maps/TurbineDetailPanel';

const Maps = () => {
    const [MaintPlantData, setMaintPlantData] = useState([]);
    const [PlanningPlantData, setPlanningPlantData] = useState([]);
    const [SelectedTurbine, setSelectedTurbine] = useState(null);
    const [Filters, setFilters] = useState({
        showAll: true,
        showMaint: true,
        showPlanning: true
    });

    const position = { lat: 0, lng: 0 };

    const handleFilterChange = (e) => {
        const { name, checked } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: checked
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
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

        fetchData();
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
                                filters={Filters}
                                allData={TurbineData}
                                maintData={MaintPlantData}
                                planningData={PlanningPlantData}
                                setSelectedTurbine={setSelectedTurbine}
                            />
                        </Map>
                    </APIProvider>
                </div>

                {/* Filter and Detail Panel Section */}
                <div className='flex flex-col space-y-4 p-4 w-[350px] bg-gray-900 text-white border-l border-gray-700 '>
                    <FilterBox
                        filters={Filters}
                        onChange={handleFilterChange}
                    />
                    <TurbineDetailPanel selectedTurbine={SelectedTurbine} />
                </div>
            </div>
        </div>
    );
};

export default Maps;
