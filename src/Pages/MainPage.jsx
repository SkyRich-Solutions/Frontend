// import React, { useEffect, useState } from 'react';
// import Header from '../Components/Layout/Header';
// import PieChart from '../Components/ReUseable/PieChart';
// import DataHandler from '../Utils/DataHandler';

// const MainPage = () => {
//     const {
//         getMaterialViolation,
//         getMaterialViolat0,
//         getTurbinelViolation,
//         getTurbineViolation0,
//         getMaterialClassified,
//         getMaterialUnclassified,
//         getMaterialUnknownPlant,
//         getMaterialKnownPlant,
//     } = DataHandler();

//     const [materialChartData, setMaterialChartData] = useState(null);
//     const [turbineChartData, setTurbineChartData] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Material chart
//                 const materialViolationsData = await getMaterialViolation(); // [{ total_violations: 11 }]
//                 const safeMaterialData = await getMaterialViolat0();         // [{ total_violations: 3 }]

//                 const materialViolations = materialViolationsData[0]?.total_violations || 0;
//                 const materialSafe = safeMaterialData[0]?.total_violations || 0;
//                 const materialTotal = materialViolations + materialSafe;

//                 // Turbine chart
//                 const turbineViolationsData = await getTurbinelViolation(); // [{ total_violations: 7 }]
//                 const safeTurbineData = await getTurbineViolation0();       // [{ total_violations: 5 }]

//                 const turbineViolations = turbineViolationsData[0]?.total_violations || 0;
//                 const turbineSafe = safeTurbineData[0]?.total_violations || 0;
//                 const turbineTotal = turbineViolations + turbineSafe;

//                 const buildPieChart = (violations, safe, total) => ({
//                     labels: ['Violations', 'Safe'],
//                     datasets: [
//                         {
//                             label: 'Violation Breakdown',
//                             data: [violations, safe],
//                             backgroundColor: [
//                                 'rgba(255, 99, 132, 0.6)', // Violations - Red
//                                 'rgba(75, 192, 75, 0.6)',  // Safe - Green
//                             ],
//                             borderColor: [
//                                 'rgba(255, 99, 132, 1)',
//                                 'rgba(75, 192, 75, 1)',
//                             ],
//                             borderWidth: 1
//                         }
//                     ]
//                 });

//                 setMaterialChartData(buildPieChart(materialViolations, materialSafe, materialTotal));
//                 setTurbineChartData(buildPieChart(turbineViolations, turbineSafe, turbineTotal));
//             } catch (error) {
//                 console.error('Error loading chart data:', error);
//             }
//         };

//         fetchData();
//     }, []);

//     return (
//         <div className='flex-1 overflow-auto z-1 h-auto space-y-4'>
//             <Header title='Overview' />

//             <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 min-h-[20rem]'>
//                 <div className='bg-gray-900 p-8 rounded-xl shadow-xl text h-screen'>
//                     <div>
//                         <h2 className='text-2xl font-bold text-gray-100'>
//                             Welcome to the Dashboard
//                         </h2>
//                         <p className='text-gray-400 mt-2'>
//                             Here you can view the status of material and turbine violations.
//                             The charts below provide a breakdown of violations and safe statuses.
//                         </p>
//                         <div className='mt-4'>
//                             <div className='flex flex-row justify-between items-center w-full h-[300px] gap-4'>
//                                 <PieChart
//                                     text='Material Replacement Part Violations Breakdown'
//                                     chartData={materialChartData}
//                                 />
//                                 <PieChart
//                                     text='Turbine Maintainance/Planning Plant Violations Breakdown'
//                                     chartData={turbineChartData}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MainPage;

import React, { useEffect, useState } from 'react';
import Header from '../Components/Layout/Header';
import PieChart from '../Components/ReUseable/PieChart';
import DataHandler from '../Utils/DataHandler';

const MainPage = () => {
    const {
        getMaterialViolation,
        getMaterialViolat0,
        getTurbinelViolation,
        getTurbineViolation0,
        getMaterialClassified,
        getMaterialUnclassified,
        getMaterialUnknownPlant,
        getMaterialKnownPlant,
    } = DataHandler();

    const [materialChartData, setMaterialChartData] = useState(null);
    const [turbineChartData, setTurbineChartData] = useState(null);
    const [classificationChartData, setClassificationChartData] = useState(null);
    const [plantChartData, setPlantChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Material chart
                const materialViolationsData = await getMaterialViolation();
                const safeMaterialData = await getMaterialViolat0();
                const materialViolations = materialViolationsData[0]?.total_violations || 0;
                const materialSafe = safeMaterialData[0]?.total_violations || 0;

                // Turbine chart
                const turbineViolationsData = await getTurbinelViolation();
                const safeTurbineData = await getTurbineViolation0();
                const turbineViolations = turbineViolationsData[0]?.total_violations || 0;
                const turbineSafe = safeTurbineData[0]?.total_violations || 0;

                // Classification chart
                const classifiedData = await getMaterialClassified();
                const unclassifiedData = await getMaterialUnclassified();
                const classified = classifiedData[0]?.total_violations || 0;
                const unclassified = unclassifiedData[0]?.total_violations || 0;

                // Plant chart
                const knownPlantData = await getMaterialKnownPlant();
                const unknownPlantData = await getMaterialUnknownPlant();
                const known = knownPlantData[0]?.total_violations || 0;
                const unknown = unknownPlantData[0]?.total_violations || 0;

                const buildPieChart = (label1, label2, value1, value2, color1, color2) => ({
                    labels: [label1, label2],
                    datasets: [
                        {
                            label: 'Breakdown',
                            data: [value1, value2],
                            backgroundColor: [color1, color2],
                            borderColor: [
                                color1.replace('0.6', '1'),
                                color2.replace('0.6', '1'),
                            ],
                            borderWidth: 1
                        }
                    ]
                });

                setMaterialChartData(buildPieChart('Violations', 'Safe', materialViolations, materialSafe, 'rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 75, 0.6)'));
                setTurbineChartData(buildPieChart('Violations', 'Safe', turbineViolations, turbineSafe, 'rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 75, 0.6)'));
                setClassificationChartData(buildPieChart('Classified', 'Unclassified', classified, unclassified, 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'));
                setPlantChartData(buildPieChart('Known Plant', 'Unknown Plant', known, unknown, 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'));

            } catch (error) {
                console.error('Error loading chart data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='flex-1 overflow-auto z-1 h-auto space-y-4'>
            <Header title='Overview' />
            <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 min-h-[20rem]'>
                <div className='bg-gray-900 p-8 rounded-xl shadow-xl text h-auto space-y-10'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-100'>
                            Welcome to the Dashboard
                        </h2>
                        <p className='text-gray-400 mt-2'>
                            Here's a breakdown of material and turbine violations.
                        </p>
                    </div>

                    <div className='flex flex-row justify-between gap-6 flex-wrap'>
    {/* Material Column */}
    <div className='w-[48%] grid grid-cols-2 gap-4'>
        <div className='h-[300px]'>
            <PieChart
                text='Material Violations'
                chartData={materialChartData}
            />
        </div>
        <div className='h-[300px]'>
            <PieChart
                text='Material Classification'
                chartData={classificationChartData}
            />
        </div>
        <div className='h-[300px]'>
            <PieChart
                text='Material Plant Info'
                chartData={plantChartData}
            />
        </div>
        <div className='h-[300px]'>
            {/* Optional fourth Material chart, or leave empty */}
        </div>
    </div>

    {/* Turbine Column */}
    <div className='w-[48%] grid grid-cols-2 gap-4'>
        <div className='h-[300px]'>
            <PieChart
                text='Turbine Violations'
                chartData={turbineChartData}
            />
        </div>
        <div className='h-[300px]'>
            {/* Optional second Turbine chart */}
        </div>
        <div className='h-[300px]'>
            {/* Optional third Turbine chart */}
        </div>
        <div className='h-[300px]'>
            {/* Optional fourth Turbine chart */}
        </div>
    </div>
</div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;

