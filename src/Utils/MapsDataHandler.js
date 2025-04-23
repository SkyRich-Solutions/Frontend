import axios from 'axios';

const getPlanningPlantData = async () => {
    try {
        const response = await axios.get(
            'http://localhost:4000/api/PlanningPlant'
        );
        console.log('Planning Plant Data:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching Planning Plant data:', error);
    }
};

const getMaintPlantData = async () => {
    try {
        const response = await axios.get(
            'http://localhost:4000/api/MaintPlant'
        );
        console.log('Maint Plant Data:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching Maint Plant data:', error);
    }
};

const getPlanningAndMaintPlantData = async () => {
    try {
        const response = await axios.get(
            'http://localhost:4000/api/MainAndPlanningPlant'
        );
        console.log('Planning + Maint Plant Data:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching combined data:', error);
    }
};

const MapsDataHandler = {
    getPlanningPlantData,
    getMaintPlantData,
    getPlanningAndMaintPlantData
};

export default MapsDataHandler;
