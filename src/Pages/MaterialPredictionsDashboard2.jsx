import React, { useState } from 'react';
import Header from '../Components/Layout/Header';
import PredictionsChartComponent from '../Components/PredictionsChartComponent';

const MaterialPredictionsDashboard2 = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className='flex-1 overflow-auto z-1 min-h-screen space-y-4'>
            <Header title='Material Predictions Dashboard 2' />

            <div className='grid grid-cols-3 gap-6 p-4'>
                {/* Top row with three different charts */}
                {[0, 1, 2].map((index) => (
                    <div
                        key={index}
                        className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-[20rem] flex items-center justify-center rounded-lg'
                    >
                        <PredictionsChartComponent
                            type={
                                index === 0
                                    ? 'bar_MaterialComponentScoreSummary'
                                    : index === 1
                                    ? 'bar_MaterialComponentHealthScores'
                                    : 'bar_MaterialCategoryScoreSummary'
                            }
                            selectedItem={selectedItem}
                            handleClick={handleItemClick}
                        />
                    </div>
                ))}

                {/* Middle-left two different charts */}
                <div className='flex flex-col gap-6 col-span-1'>
                    {[3, 4].map((index) => (
                        <div
                            key={index}
                            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-[18rem] flex items-center justify-center rounded-lg'
                        >
                            <PredictionsChartComponent
                                type={index === 3 ? 'bar_MaterialCategoryHealthScores' : 'line_MaterialCategoryPredictions'}
                                selectedItem={selectedItem}
                                handleClick={handleItemClick}
                            />
                        </div>
                    ))}
                </div>

                {/* Large square chart on the right */}
                <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 flex items-center justify-center rounded-lg col-span-2 row-span-2 h-[38rem]'>
                    <PredictionsChartComponent
                        type='table_MaintenanceForecasts'
                        selectedItem={selectedItem}
                        handleClick={handleItemClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default MaterialPredictionsDashboard2;
