// import React, { useEffect, useState } from 'react';
import React from 'react';
import Header from '../Components/Layout/Header';
import PieChart from '../Components/ReUseable/PieChart';
// import axios from 'axios';

const MainPage = () => {
    // const [Violation, setViolation] = useState();

    // useEffect(() => {
    //     const fetchViolation = async () => {
    //         try {
    //             const response = await axios.get(
    //                 'http://localhost:4000/api/violations'
    //             );
    //             console.log('Last Upload Violation:', response.data.data);
    //             setViolation(response.data.data);
    //         } catch (error) {
    //             console.error('Error fetching last upload violation:', error);
    //         }
    //     };

    //     fetchViolation();
    // });

    return (
        <div className='flex-1 overflow-auto z-1 h-auto space-y-4'>
            <Header title='Overview' />

            <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 min-h-[20rem]'>
                <div className='bg-gray-900 p-8 rounded-xl shadow-xl text h-screen'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-100'>
                            Welcome to the Dashboard
                        </h2>
                        <p className='text-gray-400 mt-2'>
                            Here you can find all the information you need.
                        </p>
                        <div className='mt-4 '>
                            <div className='flex flex-row justify-start items-center w-[600px] h-[300px] '>
                                <PieChart
                                    text={'Last Material Violation'}
                                    // violation={10}
                                />
                                <PieChart
                                    text={'Last Turbine Violation'}
                                    // violation={10}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
