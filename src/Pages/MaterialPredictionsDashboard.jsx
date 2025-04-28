import React, { useState } from 'react';
import Header from '../Components/Layout/Header';
import PredictionsChartComponent from '../Components/PredictionsChartComponent';

const MaterialPredictionsDashboard = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className='flex-1 overflow-auto z-1 min-h-screen space-y-4'>
            <Header title='Material Predictions Dashboard' />

            <div className='grid grid-cols-3 gap-6 p-4'>
                {[0, 1, 2].map((index) => (
                    <div
                        key={index}
                        className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-[20rem] flex items-center justify-center rounded-lg'
                    >
                        <PredictionsChartComponent
                            type={index === 0
                                ? 'bar_ReplacementPrediction'
                                : index === 1
                                ? 'line_GlobalMonteCarloVsBayesian'
                                : 'line_MonteCarloVsBayesian'
                            }
                            selectedItem={selectedItem}
                            onItemClick={handleItemClick}
                        />
                    </div>
                ))}

                <div className='flex flex-col gap-6 col-span-1'>
                    {[3, 4].map((index) => (
                        <div
                            key={index}
                            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-[18rem] flex items-center justify-center rounded-lg'
                        >
                            <PredictionsChartComponent
                                type={index === 3
                                    ? 'pie_MaterialStatusTransitions'
                                    : 'bubble_MonteCarloDominance'
                                }
                                selectedItem={selectedItem}
                                onItemClick={handleItemClick}
                            />
                        </div>
                    ))}
                </div>

                <div className='flex flex-col gap-6 col-span-2'>
                    <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-[18rem] flex items-center justify-center rounded-lg'>
                        <PredictionsChartComponent
                            type='table_MaterialStatusTransitions'
                            selectedItem={selectedItem}
                            onItemClick={handleItemClick}
                        />
                    </div>

                    <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-[18rem] flex items-center justify-center rounded-lg overflow-auto'>
                        <PredictionsChartComponent
                            type='table_MaterialPredictions'
                            selectedItem={selectedItem}
                            onItemClick={handleItemClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialPredictionsDashboard;
