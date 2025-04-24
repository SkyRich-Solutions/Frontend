// src/Utils/__tests__/MapsDataHandler.test.js
import axios from 'axios';
import MapsDataHandler from '../MapsDataHandler';

jest.mock('axios');

describe('MapsDataHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlanningPlantData', () => {
    it('returns data on success', async () => {
      const mockData = [{ id: 1, name: 'Plant A' }];
      axios.get.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await MapsDataHandler.getPlanningPlantData();
      expect(result).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/getAllTurbine');
    });

    it('logs error on failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      axios.get.mockRejectedValueOnce(new Error('Network Error'));

      await MapsDataHandler.getPlanningPlantData();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error fetching Planning Plant data:'), expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('getWarehousePlanningPlantData', () => {
    it('returns data on success', async () => {
      const mockData = [{ id: 2, name: 'Warehouse A' }];
      axios.get.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await MapsDataHandler.getWarehousePlanningPlantData();
      expect(result).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/getWarehousePlanningPlant');
    });

    it('logs error on failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      axios.get.mockRejectedValueOnce(new Error('Network Error'));

      await MapsDataHandler.getWarehousePlanningPlantData();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error fetching Warehouse Planning Plant data:'), expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('getWarehouseManufacturingPlantData', () => {
    it('returns data on success', async () => {
      const mockData = [{ id: 3, name: 'Manufacturing A' }];
      axios.get.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await MapsDataHandler.getWarehouseManufacturingPlantData();
      expect(result).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/getWarehouseManufacturingPlant');
    });

    it('logs error on failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      axios.get.mockRejectedValueOnce(new Error('Network Error'));

      await MapsDataHandler.getWarehouseManufacturingPlantData();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error fetching Warehouse Planning Plant data:'), expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('getWarehousePlantData', () => {
    it('returns data on success', async () => {
      const mockData = [{ id: 4, name: 'Warehouse Plant A' }];
      axios.get.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await MapsDataHandler.getWarehousePlantData();
      expect(result).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/getWarehosuePlant');
    });

    it('logs error on failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      axios.get.mockRejectedValueOnce(new Error('Network Error'));

      await MapsDataHandler.getWarehousePlantData();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error fetching Warehouse Planning Plant data:'), expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});
