import React, { useEffect, useState, useMemo } from 'react';
import Header from '../Components/Layout/Header';
import PieChart from '../Components/ReUseable/PieChart';
import DataHandler from '../Utils/DataHandler';

const DataOverviewOfComplianceDashboard = () => {
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
    } = useMemo(() => DataHandler(), []);

    const [materialChartData, setMaterialChartData] = useState(null);
    const [turbineChartData, setTurbineChartData] = useState(null);
    const [classificationChartData, setClassificationChartData] = useState(null);
    const [plantChartData, setPlantChartData] = useState(null);
    const [PlanningPlant, setPlanningPlant] = useState(null);
    const [Location, setLocation] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Material Data
                const NonCompliantMaterialData = await getMaterialReplacementPartsViolations();
                const CompliantMaterialData = await getMaterialCompliantReplacementParts();
                const materialViolations = NonCompliantMaterialData[0]?.total_violations || 0;
                const materialSafe = CompliantMaterialData[0]?.total_violations || 0;

                const CompliantData = await getMaterialClassified();
                const NonCompliantData = await getMaterialUnclassified();
                const classified = CompliantData[0]?.total_violations || 0;
                const unclassified = NonCompliantData[0]?.total_violations || 0;

                const CompliantPlantData = await getMaterialKnownPlant();
                const NonCompliantPlantData = await getMaterialUnknownPlant();
                const known = CompliantPlantData[0]?.total_violations || 0;
                const unknown = NonCompliantPlantData[0]?.total_violations || 0;

                // Turbine Data
                const NonCompliantTurbineData = await getTurbineUnknownMaintPlantViolation();
                const CompliantTurbineData = await getTurbineKnownMaintPlant();
                const turbineViolations = NonCompliantTurbineData[0]?.total_violations || 0;
                const turbineSafe = CompliantTurbineData[0]?.total_violations || 0;

                const CompliantPlanningPlant = await getTurbineKnownPlanningPlant();
                const NonCompliantPlanningPlant = await getTurbineUnknownPlanningPlantViolation();
                const planningCompliant = CompliantPlanningPlant[0]?.total_violations || 0;
                const planningViolations = NonCompliantPlanningPlant[0]?.total_violations || 0;

                const CompliantLocationData = await getTurbineKnownLocation();
                const NonCompliantLocationData = await getTurbineUnKnownLocation();
                const knownLocation = CompliantLocationData[0]?.total_violations || 0;
                const unknownLocation = NonCompliantLocationData[0]?.total_violations || 0;

                const buildPieChart = (label1, label2, value1, value2, color1, color2) => ({
                    labels: [label1, label2],
                    datasets: [
                        {
                            label: 'Items',
                            data: [value1, value2],
                            backgroundColor: [color1, color2],
                            borderColor: [color1.replace('0.6', '1'), color2.replace('0.6', '1')],
                            borderWidth: 1
                        }
                    ]
                });

                // Set charts
                setMaterialChartData(buildPieChart('Non-Compliant', 'Compliant', materialViolations, materialSafe, 'rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 75, 0.6)'));
                setTurbineChartData(buildPieChart('Non-Compliant', 'Compliant', turbineViolations, turbineSafe, 'rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 75, 0.6)'));
                setClassificationChartData(buildPieChart('Unclassified', 'Classified', unclassified, classified, 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'));
                setPlantChartData(buildPieChart('Unknown Plant', 'Known Plant', unknown, known, 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'));
                setPlanningPlant(buildPieChart('Planning Plant Violation', 'Planning Plant', planningViolations, planningCompliant, 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'));
                setLocation(buildPieChart('Unknown Location', 'Known Location', unknownLocation, knownLocation, 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'));
            } catch (error) {
                console.error('Error loading chart data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-950 pb-4 overflow-hidden">
    {/* Header Section */}
    <div className="flex justify-between items-center px-6 py-4 bg-gray-900 bg-opacity-90 z-10 relative">
        <Header title="Overview of Compliance" />
    </div>

    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 min-h-[20rem]">
        <div className="bg-gray-900 p-8 rounded-xl shadow-xl h-auto space-y-10">
            <div className="flex flex-row justify-center space-x-[49%]">
                <h2 className="text-2xl font-bold text-gray-100">Material</h2>
                <h2 className="text-2xl font-bold text-gray-100">Turbine</h2>
            </div>

            <div className="flex flex-row justify-between flex-wrap">
                {/* Material Charts */}
                <div className="w-[50%] grid grid-cols-2 gap-4 border-r-2 border-gray-700 pr-4">
                    {[materialChartData, classificationChartData, plantChartData].map((data, idx) => (
                        <div key={idx} className="h-[350px] w-full flex items-center justify-center">
                            <PieChart
                                text={["Replacement Parts", "Material Classifications", "Material Plant ID's"][idx]}
                                chartData={data}
                            />
                        </div>
                    ))}
                    <div className="h-[350px] w-full flex items-center justify-center">{/* Optional fourth chart slot */}</div>
                </div>

                {/* Turbine Charts */}
                <div className="w-[50%] grid grid-cols-2 gap-4 border-l-2 border-gray-700 pl-4">
                    {[turbineChartData, PlanningPlant, Location].map((data, idx) => (
                        <div key={idx} className="h-[350px] w-full flex items-center justify-center">
                            <PieChart
                                text={["Maintenance Plant", "Planning Plant", "Location"][idx]}
                                chartData={data}
                            />
                        </div>
                    ))}
                    <div className="h-[350px] w-full flex items-center justify-center">{/* Optional fourth chart slot */}</div>
                </div>
            </div>
        </div>
    </div>
</div>

    );
};

export default DataOverviewOfComplianceDashboard;
