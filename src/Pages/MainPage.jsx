
import React, { useEffect, useState } from 'react';
import Header from '../Components/Layout/Header';
import PieChart from '../Components/ReUseable/PieChart';
import DataHandler from '../Utils/DataHandler';

const MainPage = () => {
    const {
        getMaterialReplacementPartsViolations,
        getMaterialCompliantReplacementParts,
        getMaterialUnclassified,
        getMaterialClassified,
        getMaterialUnknownPlant,
        getMaterialKnownPlant,
        getTurbineUnknownMaintPlantViolation,
        getTurbineKnownMaintPlant,
        getTurbineKnownPlanningPlant,
        getTurbineUnknownPlanningPlantViolation,
        getTurbineUnKnownLocation,
        getTurbineKnownLocation
    } = DataHandler();

    const [materialChartData, setMaterialChartData] = useState(null);
    const [turbineChartData, setTurbineChartData] = useState(null);
    const [classificationChartData, setClassificationChartData] =
        useState(null);
    const [plantChartData, setPlantChartData] = useState(null);
    const [PlanningPlant, setPlanningPlant] = useState(null);
    const [Location, setLocation] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                //-----------------------Material-----------------------//

                //Replacement parts chart
                const NonCompliantMaterialData =
                    await getMaterialReplacementPartsViolations();
                const CompliantMaterialData =
                    await getMaterialCompliantReplacementParts();
                const materialViolations =
                    NonCompliantMaterialData[0]?.total_violations || 0;
                const materialSafe =
                    CompliantMaterialData[0]?.total_violations || 0;

                // Classification chart
                const CompliantData = await getMaterialClassified();
                const NonCompliantData = await getMaterialUnclassified();
                const classified = CompliantData[0]?.total_violations || 0;
                const unclassified = NonCompliantData[0]?.total_violations || 0;

                // Plant ID's chart
                const CompliantPlantData = await getMaterialKnownPlant();
                const NonCompliantPlantData = await getMaterialUnknownPlant();
                const known = CompliantPlantData[0]?.total_violations || 0;
                const unknown = NonCompliantPlantData[0]?.total_violations || 0;

                //----------------------Turbine-----------------------//

                // Turbine chart
                const NonCompliantTurbineData =
                    await getTurbineUnknownMaintPlantViolation();
                const CompliantTurbineData = await getTurbineKnownMaintPlant();
                const turbineViolations =
                    NonCompliantTurbineData[0]?.total_violations || 0;
                const turbineSafe =
                    CompliantTurbineData[0]?.total_violations || 0;

                // Planning Plant chart
                const CompliantPlanningPlant =
                    await getTurbineKnownPlanningPlant();
                const NonCompliantPlanningPlant =
                    await getTurbineUnknownPlanningPlantViolation();
                const PlanningPlant =
                    CompliantPlanningPlant[0]?.total_violations || 0;
                const PlanningPlantViolation =
                    NonCompliantPlanningPlant[0]?.total_violations || 0;

                //Location chart
                const CompliantLocationData = await getTurbineKnownLocation();
                const NonCompliantLocationData =
                    await getTurbineUnKnownLocation();
                const KnownLocation =
                    CompliantLocationData[0]?.total_violations || 0;
                const UnknownLocation =
                    NonCompliantLocationData[0]?.total_violations || 0;

                const buildPieChart = (
                    label1,
                    label2,
                    value1,
                    value2,
                    color1,
                    color2
                ) => ({
                    labels: [label1, label2],
                    datasets: [
                        {
                            label: 'Items',
                            data: [value1, value2],
                            backgroundColor: [color1, color2],
                            borderColor: [
                                color1.replace('0.6', '1'),
                                color2.replace('0.6', '1')
                            ],
                            borderWidth: 1
                        }
                    ]
                });

                setMaterialChartData(
                    buildPieChart(
                        'Non',
                        'Compliant',
                        materialViolations,
                        materialSafe,
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(75, 192, 75, 0.6)'
                    )
                );
                setTurbineChartData(
                    buildPieChart(
                        'Non-Compliant',
                        'Compliant',
                        turbineViolations,
                        turbineSafe,
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(75, 192, 75, 0.6)'
                    )
                );
                setClassificationChartData(
                    buildPieChart(
                        'Non-Compliant',
                        'Compliant',
                        unclassified,
                        classified,
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)'
                    )
                );
                setPlantChartData(
                    buildPieChart(
                        'Non-Compliant',
                        'Compliant',
                        unknown,
                        known,
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    )
                );
                setPlanningPlant(
                    buildPieChart(
                        'Non-Compliant',
                        'Compliant',
                        PlanningPlantViolation,
                        PlanningPlant,
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)'
                    )
                );
                setLocation(
                    buildPieChart(
                        'Non-Compliant',
                        'Compliant',
                        UnknownLocation,
                        KnownLocation,
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    )
                );
            } catch (error) {
                console.error('Error loading chart data:', error);
            }
        };

        fetchData();

        // eslint-disable-next-line
    }, []);

    return (
        <div className='flex-1 overflow-auto z-1 h-auto space-y-4'>
            <Header title='Overview' />
            <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 min-h-[20rem]'>
                <div className='bg-gray-900 p-8 rounded-xl shadow-xl text h-auto space-y-10'>
                    <div className='flex flex-row justify-center space-x-[49%]'>
                        <h2 className='text-2xl font-bold text-gray-100'>
                            Material
                        </h2>
                        <h2 className='text-2xl font-bold text-gray-100'>
                            Turbine
                        </h2>
                    </div>

                    <div className='flex flex-row justify-between flex-wrap'>
                        {/* Material Column */}
                        <div className='w-[50%] grid grid-cols-2 gap-4 border-r-2 border-gray-700'>
                            <div className='h-[300px]'>
                                <PieChart
                                    text='Replacement Parts'
                                    chartData={materialChartData}
                                />
                            </div>
                            <div className='h-[300px]'>
                                <PieChart
                                    text='Material Classifications'
                                    chartData={classificationChartData}
                                />
                            </div>
                            <div className='h-[300px]'>
                                <PieChart
                                    text={`Material Plant ID's`}
                                    chartData={plantChartData}
                                />
                            </div>
                            <div className='h-[300px]'>
                                {/* Optional fourth Material chart, or leave empty */}
                            </div>
                        </div>

                        {/* Turbine Column */}
                        <div className='w-[50%] grid grid-cols-2 gap-4 border-l-2 border-gray-700'>
                            <div className='h-[300px]'>
                                <PieChart
                                    text='Maintaince Plant'
                                    chartData={turbineChartData}
                                />
                            </div>
                            <div className='h-[300px]'>
                                <PieChart
                                    text='Planning Plant'
                                    chartData={PlanningPlant}
                                />
                            </div>
                            <div className='h-[300px]'>
                                <PieChart
                                    text='Location'
                                    chartData={Location}
                                />
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
