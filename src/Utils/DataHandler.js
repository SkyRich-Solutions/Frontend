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

    return {
        getUnprocessedData,
        getProcessedData,
        getUnprocessedDataTurbineData,
        getProcessedDataTurbineData
    };
};

export default DataHandler;
