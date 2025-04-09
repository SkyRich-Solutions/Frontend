import React from 'react';
import Header from '../Components/Layout/Header';
import ChartComponent from '../Components/ChartComponent';

const Dashboard = () => {
    return (
        <div className='flex-1 overflow-auto z-1 h-auto space-y-4 '>
            <Header title='Dashboard' />

            <div className='grid grid-cols-3 gap-6 p-4'>
                {/* Top row with three different charts */}
                {[0, 1, 2].map((index) => (
                    <div
                        key={index}
                        className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 min-h-[20rem] flex items-center justify-center rounded-lg'
                    >
                        {/* Pass different chart types to each component */}
                        <ChartComponent
                            type={
                                index === 0
                                    ? 'bar'
                                    : index === 1
                                    ? 'line'
                                    : 'bar'
                            }
                        />
                    </div>
                ))}

                {/* Middle-left two different charts */}
                <div className='flex flex-col gap-6 col-span-1'>
                    {[3, 4].map((index) => (
                        <div
                            key={index}
                            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 min-h-[20rem] flex items-center justify-center rounded-lg'
                        >
                            {/* Change chart type based on the index */}
                            <ChartComponent
                                type={index === 3 ? 'line' : 'bar'}
                            />
                        </div>
                    ))}
                </div>

                {/* Large square chart on the right */}
                <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 flex items-center justify-center rounded-lg col-span-2 row-span-2 min-h-[30rem]'>
                    {/* Use a different chart type */}
                    <ChartComponent type='line' />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
