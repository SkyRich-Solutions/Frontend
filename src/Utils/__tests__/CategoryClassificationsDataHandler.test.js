import axios from 'axios';
import { CategoryClassificationsDataHandler } from '../../Utils/CategoryClassificationsDataHandler';

jest.mock('axios');

describe('CategoryClassificationsDataHandler', () => {
  const mockData = [{ category: 'X', value: 100 }];

  // Z - Zero: Handle empty data response
  test('returns empty array if response has no data', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });

    const { getProcessedCategoryData } = CategoryClassificationsDataHandler();
    const result = await getProcessedCategoryData();

    expect(result).toEqual([]);
  });

  // O - One: Returns single item in response
  test('returns single item correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [mockData[0]] } });

    const { getProcessedCategoryData } = CategoryClassificationsDataHandler();
    const result = await getProcessedCategoryData();

    expect(result).toEqual([mockData[0]]);
  });

  // M - Many: Returns multiple items
  test('returns multiple items from API', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockData } });

    const { getProcessedCategoryData } = CategoryClassificationsDataHandler();
    const result = await getProcessedCategoryData();

    expect(result).toEqual(mockData);
  });

  // B - Boundary: Handles undefined response
  test('throws if response data is undefined', async () => {
    axios.get.mockResolvedValueOnce({ data: undefined });

    const { getProcessedCategoryData } = CategoryClassificationsDataHandler();
    await expect(getProcessedCategoryData()).rejects.toThrow();
  });

  // I - Interface: Calls correct API endpoint
  test('calls correct API endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockData } });

    const { getProcessedCategoryData } = CategoryClassificationsDataHandler();
    await getProcessedCategoryData();

    expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/fetch_ProcessedMaterialData');
  });

  // E - Exception: Handles API error
  test('throws error on API failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    const { getProcessedCategoryData } = CategoryClassificationsDataHandler();
    await expect(getProcessedCategoryData()).rejects.toThrow('Network error');
  });

  // S - State: Response contains known category
  test('includes known category in result', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockData } });

    const { getProcessedCategoryData } = CategoryClassificationsDataHandler();
    const result = await getProcessedCategoryData();

    expect(result[0].category).toBe('X');
  });
});
