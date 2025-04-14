import React from 'react';
import Checkbox from '../ReUseable/ChechBox';

const FilterBox = ({ filters, onChange }) => {
    return (
        <div className='bg-gray-800 bg-opacity-60 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex flex-wrap gap-4 items-center justify-start rounded-lg w-[300px]'>
            <label className='flex gap-2 items-center'>
                <Checkbox
                    name='showAll'
                    checked={filters.showAll}
                    onChange={onChange}
                />
                Show All (Gray)
            </label>
            <label className='flex gap-2 items-center'>
                <Checkbox
                    name='showMaint'
                    checked={filters.showMaint}
                    onChange={onChange}
                />
                Show Maintenance (Red)
            </label>
            <label className='flex gap-2 items-center'>
                <Checkbox
                    name='showPlanning'
                    checked={filters.showPlanning}
                    onChange={onChange}
                />
                Show Planning (Blue)
            </label>
        </div>
    );
};

export default FilterBox;
