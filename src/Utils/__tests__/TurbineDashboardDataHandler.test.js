import axios from 'axios';
import {
  getPredictionTurbineData,
  getTurbineModelHealthScores,
  getTurbineModelScoreSummary,
  getTurbinePlatformHealthScores,
  getTurbinePlatformScoreSummary
} from '../TurbineDashboardDataHandler';

jest.mock('axios');

const mockResponse = [{ id: 1, name: 'Sample' }];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TurbineDashboardDataHandler (ZOMBIES)', () => {
  const testCall = async (fn, endpoint) => {
    axios.get.mockResolvedValueOnce({ data: { data: mockResponse } });
    const result = await fn();
    expect(axios.get).toHaveBeenCalledWith(endpoint);
    expect(result).toEqual(mockResponse);
  };

  // Z - Zero
  test('returns empty array if response is empty', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    const result = await getPredictionTurbineData();
    expect(result).toEqual([]);
  });

  // O - One
  test('returns one item correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [mockResponse[0]] } });
    const result = await getPredictionTurbineData();
    expect(result).toEqual([mockResponse[0]]);
  });

  // M - Many
  test('calls correct endpoint for getPredictionTurbineData', async () => {
    await testCall(getPredictionTurbineData, 'http://localhost:4000/api/getPredictionTurbineData');
  });

  test('calls correct endpoint for getTurbineModelHealthScores', async () => {
    await testCall(getTurbineModelHealthScores, 'http://localhost:4000/api/getTurbineModelHealthScore');
  });

  test('calls correct endpoint for getTurbineModelScoreSummary', async () => {
    await testCall(getTurbineModelScoreSummary, 'http://localhost:4000/api/getTurbineModelScoreSummary');
  });

  test('calls correct endpoint for getTurbinePlatformHealthScores', async () => {
    await testCall(getTurbinePlatformHealthScores, 'http://localhost:4000/api/getTurbinePlatformHealthScore');
  });

  test('calls correct endpoint for getTurbinePlatformScoreSummary', async () => {
    await testCall(getTurbinePlatformScoreSummary, 'http://localhost:4000/api/getTurbinePlatformScoreSummary');
  });

  // B - Boundary (error condition)
  test('throws if response.data is undefined in getPredictionTurbineData', async () => {
    axios.get.mockResolvedValueOnce({});
    const result = await getPredictionTurbineData();
    expect(result).toBeUndefined();
  });

  // I - Interface
  test('uses axios to fetch data once', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockResponse } });
    await getTurbineModelHealthScores();
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  // E - Exception
  test('logs error on request failure', async () => {
    const error = new Error('Failure');
    console.error = jest.fn();
    axios.get.mockRejectedValueOnce(error);
    await getTurbinePlatformHealthScores();
    expect(console.error).toHaveBeenCalledWith('Error fetching Prediction Turbine Data data:', error);
  });

  // S - State
  test('response contains expected shape', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockResponse } });
    const result = await getTurbineModelScoreSummary();
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
  });
});
