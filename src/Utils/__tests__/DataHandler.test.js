import axios from 'axios';
import DataHandler from '../DataHandler'


jest.mock('axios');

describe('DataHandler', () => {
  const mockMaterialData = [{ id: 1, name: 'Material A' }];
  const mockTurbineData = [{ id: 101, name: 'Turbine A' }];
  const handler = DataHandler();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches unprocessed material data', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockMaterialData } });

    const result = await handler.getUnprocessedData();
    expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/fetch_UnprocessedMaterialData');
    expect(result).toEqual(mockMaterialData);
  });

  it('fetches processed material data', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockMaterialData } });

    const result = await handler.getProcessedData();
    expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/fetch_ProcessedMaterialData');
    expect(result).toEqual(mockMaterialData);
  });

  it('fetches unprocessed turbine data', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockTurbineData } });

    const result = await handler.getUnprocessedDataTurbineData();
    expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/fetch_UnprocessedTurbineData');
    expect(result).toEqual(mockTurbineData);
  });

  it('fetches processed turbine data', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockTurbineData } });

    const result = await handler.getProcessedDataTurbineData();
    expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/fetch_ProcessedTurbineData');
    expect(result).toEqual(mockTurbineData);
  });

  it('logs error and returns undefined on unprocessed material fetch failure', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    const result = await handler.getUnprocessedData();
    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error fetching unprocessed data:'), expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('throws error on processed turbine fetch failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Server error'));

    await expect(handler.getProcessedDataTurbineData()).rejects.toThrow('Server error');
  });
});
