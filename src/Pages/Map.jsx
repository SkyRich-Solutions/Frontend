import React from 'react';
import Header from '../Components/Header';
import Maps from '../Components/Maps';

const Map = () => {
    return (
        <div className='flex-1 overflow-auto z-1 h-auto space-y-4'>
            <Header title='Map' />
            <Maps />
        </div>
    );
};

export default Map;
