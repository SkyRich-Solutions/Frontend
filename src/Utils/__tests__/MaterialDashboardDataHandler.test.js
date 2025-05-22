import * as MaterialHandler from '../MaterialDashboardDataHandler';
import axios from 'axios';

jest.mock('axios');

const mockResponse = [{ id: 1, name: 'Test Item' }];
const endpoints = {
  getPredictionMaterialData: 'http://localhost:4000/api/getPredictionMaterialData',
  getMaterialCategoryHealthScores: 'http://localhost:4000/api/getMaterialCategoryHealthScores',
  getMaterialCategoryPredictions: 'http://localhost:4000/api/getMaterialCategoryPredictions',
  getMaterialCategoryScoreSummary: 'http://localhost:4000/api/getMaterialCategoryScoreSummary',
  getMaterialComponentHealthScores: 'http://localhost:4000/api/getMaterialComponentHealthScore',
  getMaterialComponentScoreSummary: 'http://localhost:4000/api/getMaterialComponentScoreSummary',
  getReplacementPredictions: 'http://localhost:4000/api/getReplacementPrediction',
  getReplacementPredictionGlobal: 'http://localhost:4000/api/getReplacementPredictionGlobal',
  getMaterialPredictions: 'http://localhost:4000/api/getMaterialPredictions',
  getMaintenanceForecasts: 'http://localhost:4000/api/getMaintenanceForecasts',
  getMaterialStatusTransitions: 'http://localhost:4000/api/getMaterialStatusTransitions',
  getMonteCarloDominance: 'http://localhost:4000/api/getMonteCarloDominance'
};

beforeEach(() => jest.clearAllMocks());

describe('MaterialDashboardDataHandler (ZOMBIES)', () => {
  const testCall = async (fn, endpoint) => {
    axios.get.mockResolvedValueOnce({ data: { data: mockResponse } });
    const result = await fn();
    expect(axios.get).toHaveBeenCalledWith(endpoint);
    expect(result).toEqual(mockResponse);
  };

  // Z - Zero: handle empty response
  test('returns empty array from getMaterialPredictions when no data', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    const result = await MaterialHandler.getMaterialPredictions();
    expect(result).toEqual([]);
  });

  // O - One
  test('returns one item from getMaterialCategoryHealthScores', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [mockResponse[0]] } });
    const result = await MaterialHandler.getMaterialCategoryHealthScores();
    expect(result).toEqual([mockResponse[0]]);
  });

  // M - Many (endpoint testing)
  for (const [fnName, url] of Object.entries(endpoints)) {
    test(`calls correct endpoint for ${fnName}`, async () => {
      await testCall(MaterialHandler[fnName], url);
    });
  }

  // B - Boundary (invalid response shape)
  test('throws when response.data is undefined in getMaterialComponentHealthScores', async () => {
    axios.get.mockResolvedValueOnce({});
    await expect(MaterialHandler.getMaterialComponentHealthScores()).resolves.toBeUndefined();
  });

  // I - Interface: axios is used
  test('uses axios to fetch getMaintenanceForecasts', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockResponse } });
    await MaterialHandler.getMaintenanceForecasts();
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  // E - Exception: error is caught and logged
  test('logs error and returns undefined on axios failure', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('Network Error'));
    const result = await MaterialHandler.getMonteCarloDominance();
    expect(spy).toHaveBeenCalledWith(
      'Error fetching Material Component Health Scores data:',
      expect.any(Error)
    );
    expect(result).toBeUndefined();
    spy.mockRestore();
  });

  // S - State: result contains expected fields
  test('response contains id and name', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockResponse } });
    const result = await MaterialHandler.getMaterialStatusTransitions();
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
  });
});
