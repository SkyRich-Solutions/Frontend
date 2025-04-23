import React from 'react';

const TurbineDetailPanel = ({ selectedTurbine }) => {
    return (
        <div className='w-[300px] h-[500px] bg-gray-900 text-white border-l border-gray-700 flex flex-col justify-start'>
            <div className='bg-gray-800 bg-opacity-60 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex flex-col gap-4 rounded-lg overflow-auto max-h-full'>
                <h2 className='text-xl font-bold mb-4'>Turbine Details</h2>
                {selectedTurbine ? (
                    <div className='space-y-2'>
                        {Object.entries(selectedTurbine).map(([key, value]) => (
                            <p key={key}>
                                <strong>{key}:</strong> {value?.toString()}
                            </p>
                        ))}
                    </div>
                ) : (
                    <p>Select a pin to see details here.</p>
                )}
            </div>
        </div>
    );
};

export default TurbineDetailPanel;
