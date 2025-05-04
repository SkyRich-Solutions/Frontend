import axios from 'axios';

export const CategoryClassificationsDataHandler = () => {

const getProcessedCategoryData = async () => {
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

return {
    getProcessedCategoryData
};
};
export default CategoryClassificationsDataHandler;
