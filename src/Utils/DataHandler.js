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

    const getMaterialViolation = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/violations'
            );

            console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching unprocessed data:', error);
            throw error;
        }
    };


    const getMaterialViolat0 = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getViolation0'
            );

            console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching unprocessed data:', error);
            throw error;
        }
    };

    const getTurbinelViolation = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getTurbineViolation'
            );

            console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching unprocessed data:', error);
            throw error;
        }
    };

    const getTurbineViolation0 = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getTurbineViolation0'
            );

            console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching unprocessed data:', error);
            throw error;
        }
    };

    const getMaterialClassified = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getMaterialClassifiedPlant'
            );

            console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching unprocessed data:', error);
            throw error;
        }
    };
    const getMaterialUnclassified = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getMaterialUnclassifiedPlant'
            );

            console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching unprocessed data:', error);
            throw error;
        }
    };
    const getMaterialUnknownPlant = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getMaterialUnknownPlant'
            );

            console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching unprocessed data:', error);
            throw error;
        }
    };
    const getMaterialKnownPlant = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/getMaterialKnownPlant'
            );

            console.log('Unprocessed Data:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching unprocessed data:', error);
            throw error;
        }
    };



    return {
        getUnprocessedData,
        getProcessedData,
        getUnprocessedDataTurbineData,
        getProcessedDataTurbineData,
        getMaterialViolation,
        getMaterialViolat0,
        getTurbinelViolation,
        getTurbineViolation0,
        getMaterialClassified,
        getMaterialUnclassified,
        getMaterialUnknownPlant,
        getMaterialKnownPlant,
    };
};

export default DataHandler;
