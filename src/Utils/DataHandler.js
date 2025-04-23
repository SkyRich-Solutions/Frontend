import axios from 'axios';

export const DataHandler = () => {
    const getUnprocessedData = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/fetch_UnprocessedMaterialData'
            );

            console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching unprocessed data:', error);
        }
    };

    const getProcessedData = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/fetch_ProcessedMaterialData'
            );

            console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching unprocessed data:', error);
            throw error;
        }
    };

    const getUnprocessedDataTurbineData = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/fetch_UnprocessedTurbineData'
            );

            console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching unprocessed data:', error);
        }
    };

    const getProcessedDataTurbineData = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/fetch_ProcessedTurbineData'
            );

            console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching unprocessed data:', error);
            throw error;
        }
    };

    const getMaterialReplacementPartsViolations = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getMaterialReplacementPartsViolations'
            );

            // console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error(
                'Error fetching Material Replacement Parts Violations :',
                error
            );
            throw error;
        }
    };

    const getMaterialCompliantReplacementParts = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getMaterialCompliantReplacementParts'
            );

            // console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error(
                'Error Fetching Material Compliant Replacement Parts : ',
                error
            );
            throw error;
        }
    };

    const getMaterialUnclassified = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getMaterialUnclassified'
            );

            // console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error Fetching Material Unclassified : ', error);
            throw error;
        }
    };

    const getMaterialClassified = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getMaterialClassified'
            );

            // console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error Fetching Material Unclassified : ', error);
            throw error;
        }
    };

    const getMaterialUnknownPlant = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getMaterialUnknownPlant'
            );

            // console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error Fetching Material Unknown Plant : ', error);
            throw error;
        }
    };

    const getMaterialKnownPlant = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getMaterialKnownPlant'
            );

            // console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error Fetching Material Known Plant : ', error);
            throw error;
        }
    };

    const getTurbineUnknownPlanningPlantViolation = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getTurbineUnknownPlanningPlantViolation'
            );

            // console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error(
                'Error Fetching Turbine Unknown Planning Plant Violation : ',
                error
            );
            throw error;
        }
    };

    const getTurbineUnknownMaintPlantViolation = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getTurbineUnknownMaintPlantViolation'
            );

            // console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error(
                'Error Fetching Turbine Unknown Maint Plant Violation : ',
                error
            );
            throw error;
        }
    };

    const getTurbineKnownMaintPlant = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getTurbineKnownMaintPlant'
            );

            // console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error Fetching Turbine Known Maint Plant : ', error);
            throw error;
        }
    };

    const getTurbineKnownPlanningPlant = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getTurbineKnownPlanningPlant'
            );

            // console.log('Turbine KnownPlanningPlant:', response.data);
            return response.data;
        } catch (error) {
            console.error(
                'Error Fetching Turbine Known Planning Plant : ',
                error
            );
            throw error;
        }
    };
    const getTurbineUnKnownLocation = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getTurbineUnknownLocation'
            );

            // console.log('Turbine Known Location :', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error Fetching Turbine Unknown Location : ', error);
            throw error;
        }
    };

    const getTurbineKnownLocation = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getTurbineKnownLocation'
            );

            // console.log('Turbine KnownPlanningPlant:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error Fetching Turbine Known Location : ', error);
            throw error;
        }
    };

    return {
        getUnprocessedData,
        getProcessedData,
        getUnprocessedDataTurbineData,
        getProcessedDataTurbineData,
        getMaterialReplacementPartsViolations,
        getMaterialCompliantReplacementParts,
        getMaterialUnclassified,
        getMaterialClassified,
        getMaterialUnknownPlant,
        getMaterialKnownPlant,
        getTurbineUnknownPlanningPlantViolation,
        getTurbineUnknownMaintPlantViolation,
        getTurbineKnownMaintPlant,
        getTurbineKnownPlanningPlant,
        getTurbineUnKnownLocation,
        getTurbineKnownLocation
    };
};

export default DataHandler;
