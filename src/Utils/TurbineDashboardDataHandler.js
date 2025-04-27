import axios from 'axios';

export const getPredictionTurbineData = async () => {
  try {
    const response = await axios.get(
      'http://localhost:4000/api/getPredictionTurbineData'
    );

    console.log('Prediction Turbine Data:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Prediction Turbine Data data:', error);
  }
};

export const getTurbineModelHealthScores = async () => {
    try {
      const response = await axios.get(
        'http://localhost:4000/api/getTurbineModelHealthScore'
      );
  
      console.log('Prediction Turbine Data:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Prediction Turbine Data data:', error);
    }
  };

  export const getTurbineModelScoreSummary = async () => {
    try {
      const response = await axios.get(
        'http://localhost:4000/api/getTurbineModelScoreSummary'

      );
  
      console.log('Prediction Turbine Data:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Prediction Turbine Data data:', error);
    }
  };


  export const getTurbinePlatformHealthScores = async () => {
    try {
      const response = await axios.get(
        'http://localhost:4000/api/getTurbinePlatformHealthScore'

      );
  
      console.log('Prediction Turbine Data:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Prediction Turbine Data data:', error);
    }
  };

  export const getTurbinePlatformScoreSummary = async () => {
    try {
      const response = await axios.get(
        'http://localhost:4000/api/getTurbinePlatformScoreSummary'

      );
  
      console.log('Prediction Turbine Data:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Prediction Turbine Data data:', error);
    }
  };