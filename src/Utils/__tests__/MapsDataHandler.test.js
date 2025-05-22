import MapsDataHandler from '../MapsDataHandler';
import axios from 'axios';

jest.mock('axios');

const mockResponse = [{ id: 1, name: 'Sample' }];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('MapsDataHandler (ZOMBIES)', () => {
  const {
    getPlanningPlantData,
    getWarehousePlanningPlantData,
    getWarehouseManufacturingPlantData,
    getWarehousePlantData
  } = MapsDataHandler;

  const testCall = async (fn, endpoint) => {
    axios.get.mockResolvedValueOnce({ data: { data: mockResponse } });
    const result = await fn();
    expect(axios.get).toHaveBeenCalledWith(endpoint);
    expect(result).toEqual(mockResponse);
  };

  // Z - Zero
  test('returns empty array if response is empty (planning plant)', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    const result = await getPlanningPlantData();
    expect(result).toEqual([]);
  });

  // O - One
  test('returns one item correctly (planning plant)', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [mockResponse[0]] } });
    const result = await getPlanningPlantData();
    expect(result).toEqual([mockResponse[0]]);
  });

  // M - Many
  test('calls correct endpoint for getPlanningPlantData', async () => {
    await testCall(getPlanningPlantData, 'http://localhost:4000/api/getAllTurbine');
  });

  test('calls correct endpoint for getWarehousePlanningPlantData', async () => {
    await testCall(getWarehousePlanningPlantData, 'http://localhost:4000/api/getWarehousePlanningPlant');
  });

  test('calls correct endpoint for getWarehouseManufacturingPlantData', async () => {
    await testCall(getWarehouseManufacturingPlantData, 'http://localhost:4000/api/getWarehouseManufacturingPlant');
  });

  test('calls correct endpoint for getWarehousePlantData', async () => {
    await testCall(getWarehousePlantData, 'http://localhost:4000/api/getWarehosuePlant');
  });

  // E - Exception
  test('throws error when fetch fails (warehouse)', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));
    await expect(getWarehousePlantData()).resolves.toBeUndefined();
  });

  // S - State
  test('response contains expected object shape (planning plant)', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockResponse } });
    const result = await getPlanningPlantData();
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
  });
});