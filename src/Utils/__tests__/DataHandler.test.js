import DataHandler from '../DataHandler';
import axios from 'axios';

jest.mock('axios');

const mockResponse = [{ id: 1, name: 'Sample' }];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('DataHandler (ZOMBIES)', () => {
  const {
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
  } = DataHandler();

  const testCall = async (fn, endpoint) => {
    axios.get.mockResolvedValueOnce({ data: { data: mockResponse } });
    const result = await fn();
    expect(axios.get).toHaveBeenCalledWith(endpoint);
    expect(result).toEqual(mockResponse);
  };

  // Z - Zero
  test('returns empty array if response is empty', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    const result = await getUnprocessedData();
    expect(result).toEqual([]);
  });

  // O - One
  test('returns one item correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [mockResponse[0]] } });
    const result = await getUnprocessedData();
    expect(result).toEqual([mockResponse[0]]);
  });

  // M - Many
  test('calls correct endpoint for getUnprocessedData', async () => {
    await testCall(getUnprocessedData, 'http://localhost:4000/api/fetch_UnprocessedMaterialData');
  });

  test('calls correct endpoint for getProcessedData', async () => {
    await testCall(getProcessedData, 'http://localhost:4000/api/fetch_ProcessedMaterialData');
  });

  test('calls correct endpoint for getUnprocessedDataTurbineData', async () => {
    await testCall(getUnprocessedDataTurbineData, 'http://localhost:4000/api/fetch_UnprocessedTurbineData');
  });

  test('calls correct endpoint for getProcessedDataTurbineData', async () => {
    await testCall(getProcessedDataTurbineData, 'http://localhost:4000/api/fetch_ProcessedTurbineData');
  });

  test('calls correct endpoint for getMaterialReplacementPartsViolations', async () => {
    await testCall(getMaterialReplacementPartsViolations, 'http://localhost:4000/api/getMaterialReplacementPartsViolations');
  });

  test('calls correct endpoint for getMaterialCompliantReplacementParts', async () => {
    await testCall(getMaterialCompliantReplacementParts, 'http://localhost:4000/api/getMaterialCompliantReplacementParts');
  });

  test('calls correct endpoint for getMaterialUnclassified', async () => {
    await testCall(getMaterialUnclassified, 'http://localhost:4000/api/getMaterialUnclassified');
  });

  test('calls correct endpoint for getMaterialClassified', async () => {
    await testCall(getMaterialClassified, 'http://localhost:4000/api/getMaterialClassified');
  });

  test('calls correct endpoint for getMaterialUnknownPlant', async () => {
    await testCall(getMaterialUnknownPlant, 'http://localhost:4000/api/getMaterialUnknownPlant');
  });

  test('calls correct endpoint for getMaterialKnownPlant', async () => {
    await testCall(getMaterialKnownPlant, 'http://localhost:4000/api/getMaterialKnownPlant');
  });

  test('calls correct endpoint for getTurbineUnknownPlanningPlantViolation', async () => {
    await testCall(getTurbineUnknownPlanningPlantViolation, 'http://localhost:4000/api/getTurbineUnknownPlanningPlantViolation');
  });

  test('calls correct endpoint for getTurbineUnknownMaintPlantViolation', async () => {
    await testCall(getTurbineUnknownMaintPlantViolation, 'http://localhost:4000/api/getTurbineUnknownMaintPlantViolation');
  });

  test('calls correct endpoint for getTurbineKnownMaintPlant', async () => {
    await testCall(getTurbineKnownMaintPlant, 'http://localhost:4000/api/getTurbineKnownMaintPlant');
  });

  test('calls correct endpoint for getTurbineKnownPlanningPlant', async () => {
    axios.get.mockResolvedValueOnce({ data: mockResponse }); // special case
    const result = await getTurbineKnownPlanningPlant();
    expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/getTurbineKnownPlanningPlant');
    expect(result).toEqual(mockResponse);
  });

  test('calls correct endpoint for getTurbineUnKnownLocation', async () => {
    await testCall(getTurbineUnKnownLocation, 'http://localhost:4000/api/getTurbineUnknownLocation');
  });

  test('calls correct endpoint for getTurbineKnownLocation', async () => {
    await testCall(getTurbineKnownLocation, 'http://localhost:4000/api/getTurbineKnownLocation');
  });

  // B - Boundary
  test('throws if response.data is undefined in getProcessedData', async () => {
    axios.get.mockResolvedValueOnce({});
    await expect(getProcessedData()).rejects.toThrow();
  });

  // I - Interface
  test('uses axios to fetch data', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockResponse } });
    await getMaterialUnclassified();
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  // E - Exception
  test('throws error when fetch fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed'));
    await expect(getProcessedData()).rejects.toThrow('Failed');
  });

  // S - State
  test('response contains expected object shape', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockResponse } });
    const result = await getProcessedData();
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
  });
});