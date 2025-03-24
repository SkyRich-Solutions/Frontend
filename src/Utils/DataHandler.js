import axios from 'axios';

export const DataHandler = () => {
    const getUnprocessedData = async () => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/fetch_UnprocessedData'
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
                'http://localhost:4000/api/fetch_ProcessedData'
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
        getProcessedData
    };
};

export default DataHandler;
