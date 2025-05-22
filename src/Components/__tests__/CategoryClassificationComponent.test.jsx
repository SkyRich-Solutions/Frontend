import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import CategoryClassificationComponent, { getProcessedCategoryData } from '../CategoryClassificationComponent';

jest.mock('axios');

afterEach(() => {
  jest.clearAllMocks();
});

describe('getProcessedCategoryData - ZOMBIES', () => {
  test('Z - Zero data: returns empty array', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    const result = await getProcessedCategoryData();
    expect(result).toEqual([]);
  });

  test('O - One data item: returns correct item', async () => {
    const mockData = { data: { data: [{ Material: 'M1' }] } };
    axios.get.mockResolvedValueOnce(mockData);
    const result = await getProcessedCategoryData();
    expect(result).toEqual([{ Material: 'M1' }]);
  });

  test('M - Many data items: returns full list', async () => {
    const items = Array.from({ length: 5 }, (_, i) => ({ Material: `M${i}` }));
    axios.get.mockResolvedValueOnce({ data: { data: items } });
    const result = await getProcessedCategoryData();
    expect(result.length).toBe(5);
  });

  test('B - Bad fetch: throws error', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));
    await expect(getProcessedCategoryData()).rejects.toThrow('Network Error');
  });
});

describe('CategoryClassificationComponent - ZOMBIES', () => {
  const defaultProps = {
    type: 'table_MaterialCategoryClassificationsData',
    setRefreshKey: jest.fn(),
    editingUnlocked: false,
    setEditingUnlocked: jest.fn(),
    selectedRows: [],
    setSelectedRows: jest.fn(),
    selectedCategory: null,
    setSelectedCategory: jest.fn(),
    data: [{
      Material: '123', Plant: 'P1', Description: 'desc', MaterialCategory: 'Unclassified',
      PlantSpecificMaterialStatus: 'Z1', Serial_No_Profile: 'SN1', ReplacementPart: 'Yes',
      Auto_Classified: 1, NewlyDiscovered: true
    }],
    onSave: jest.fn()
  };

  test('Z - Zero items: renders empty fallback', () => {
    render(<CategoryClassificationComponent {...defaultProps} data={[]} />);
    expect(screen.queryByText('desc')).not.toBeInTheDocument();
  });

  test('O - One item: renders data correctly', () => {
    render(<CategoryClassificationComponent {...defaultProps} />);
    expect(screen.getByText('Material')).toBeInTheDocument();
    expect(screen.getByText('desc')).toBeInTheDocument();
  });

  test('M - Many items: count displays correctly', () => {
    const data = Array.from({ length: 10 }, (_, i) => ({ ...defaultProps.data[0], Material: `M${i}` }));
    render(<CategoryClassificationComponent {...defaultProps} data={data} type="count_Unclassified" />);
    expect(screen.getByText(`${data.length}`)).toBeInTheDocument();
  });

  test('B - Boundary: renders correctly with editing locked and no selection', () => {
    const { rerender } = render(<CategoryClassificationComponent {...defaultProps} type="table_UniqueMaterialCategories" />);
    expect(screen.getByText(/Please unlock editing first/i)).toBeInTheDocument();

    rerender(<CategoryClassificationComponent {...defaultProps} type="table_UniqueMaterialCategories" editingUnlocked />);
    expect(screen.getByText(/Please select some materials first/i)).toBeInTheDocument();
  });

  test('I - Interface: clicking row sets selected category', () => {
    const props = { ...defaultProps, editingUnlocked: true };
    render(<CategoryClassificationComponent {...props} />);
    fireEvent.click(screen.getByText('desc'));
    expect(props.setSelectedCategory).toHaveBeenCalledWith('Unclassified');
  });

  test('E - Error in save: handles axios post gracefully', async () => {
    axios.post.mockResolvedValueOnce({});
    const props = {
      ...defaultProps,
      editingUnlocked: true,
      selectedCategory: 'TestCategory',
      selectedRows: [{ Material: '123', Plant: 'P1' }],
      type: 'table_UniqueMaterialCategories'
    };
    render(<CategoryClassificationComponent {...props} />);
    const saveBtn = screen.getAllByText(/Save Category Assignment/i).find(el => el.tagName === 'BUTTON');
    fireEvent.click(saveBtn);
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
});
