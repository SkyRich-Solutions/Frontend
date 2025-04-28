import axios from 'axios';

export const getPredictionMaterialData = async () => {
  try {
    const response = await axios.get(
      'http://localhost:4000/api/getPredictionMaterialData'
    );

    console.log('Prediction Material Data:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Prediction Material Data data:', error);
  }
};

export const getMaterialCategoryHealthScores = async () => {
  try {
    const response = await axios.get(
      'http://localhost:4000/api/getMaterialCategoryHealthScores'
    );

    console.log(' get Material Category Health Scores Data:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Material Category Health Scores Data data:', error);
  }
};

export const getMaterialCategoryPredictions = async () => {
  try {
    const response = await axios.get(
      'http://localhost:4000/api/getMaterialCategoryPredictions'
    );

    console.log(' get Material Category Health Scores Data:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Material Category Health Scores  data:', error);
  }
};


export const getMaterialCategoryScoreSummary = async () => {
  try {
    const response = await axios.get(
      'http://localhost:4000/api/getMaterialCategoryScoreSummary'
    );

    console.log(' get Material Category Score Summary', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Material Category Score Summary data:', error);
  }
};

export const getMaterialComponentHealthScores = async () => {
  try {
    const response = await axios.get(
      'http://localhost:4000/api/getMaterialComponentHealthScore'
    );

    console.log(' get Material Component Health Scores', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Material Component Health Scores data:', error);
  }
};

export const getMaterialComponentScoreSummary = async () => {
  try {
    const response = await axios.get(
      'http://localhost:4000/api/getMaterialComponentScoreSummary'
    );

    console.log(' get Material Component Health Scores', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Material Component Health Scores data:', error);
  }
};

export const getReplacementPredictions = async () => {
  try {
    const response = await axios.get(
      'http://localhost:4000/api/getReplacementPrediction'
    );

    console.log(' get Material Component Health Scores', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Material Component Health Scores data:', error);
  }
};

export const getReplacementPredictionGlobal = async () => {
  try {
    const response = await axios.get(
      'http://localhost:4000/api/getReplacementPredictionGlobal'
    );

    console.log(' get Material Component Health Scores', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Material Component Health Scores data:', error);
  }
};


export const getMaterialPredictions = async () => {
  try {
    const response = await axios.get(
      'http://localhost:4000/api/getMaterialPredictions'
    );

    console.log(' get Material Component Health Scores', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Material Component Health Scores data:', error);
  }
};

export const getMaintenanceForecasts = async () => {
  try {
    const response = await axios.get(
      'http://localhost:4000/api/getMaintenanceForecasts'
    );

    console.log(' get Material Component Health Scores', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Material Component Health Scores data:', error);
  }
};


export const getMaterialStatusTransitions = async () => {
  try {
    const response = await axios.get(
      'http://localhost:4000/api/getMaterialStatusTransitions'
    );

    console.log(' get Material Component Health Scores', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Material Component Health Scores data:', error);
  }
};

export const getMonteCarloDominance = async () => {
  try {
    const response = await axios.get(
      'http://localhost:4000/api/getMonteCarloDominance'
    );

    console.log(' get Material Component Health Scores', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Material Component Health Scores data:', error);
  }
};



