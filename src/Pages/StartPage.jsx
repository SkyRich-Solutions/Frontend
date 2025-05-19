import React, { useEffect, useState } from 'react';
import Header from '../Components/Layout/Header';
import { getMaterialComponentHealthScores } from '../Utils/MaterialDashboardDataHandler';
import { getTurbineModelHealthScores } from '../Utils/TurbineDashboardDataHandler';

const StartPage = () => {
    const [materialData, setMaterialData] = useState([]);
    const [turbineData, setTurbineData] = useState([]);
    const [filterStatus, setFilterStatus] = useState("Critical"); // Default to "Critical"

    useEffect(() => {
        const fetchData = async () => {
            try {
                const materialScores = await getMaterialComponentHealthScores();
                setMaterialData(materialScores);

                const turbineScores = await getTurbineModelHealthScores();
                setTurbineData(turbineScores);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    // Filter based on HealthScore and selected status filter
    const filteredMaterialData = materialData.filter((item) => {
        const healthScore = item.HealthScore;
        if (filterStatus === "Critical") return healthScore < 50;
        if (filterStatus === "Medium") return healthScore >= 50 && healthScore < 70;
        return true; // Only Critical and Medium should be considered
    });

    const filteredTurbineData = turbineData.filter((item) => {
        const healthScore = item.HealthScore;
        if (filterStatus === "Critical") return healthScore < 50;
        if (filterStatus === "Medium") return healthScore >= 50 && healthScore < 70;
        return true; // Only Critical and Medium should be considered
    });

    // Sort filtered data
    const sortedMaterialData = [...filteredMaterialData].sort((a, b) => a.HealthScore - b.HealthScore);
    const sortedTurbineData = [...filteredTurbineData].sort((a, b) => a.HealthScore - b.HealthScore);

    const getHealthScoreColor = (score) => {
        if (score < 50) return 'rgba(255, 99, 132, 0.8)'; // Critical
        if (score < 70) return 'rgba(255, 159, 64, 0.8)'; // Medium
        return 'rgba(75, 192, 75, 0.8)'; // Good (but it's not used anymore)
    };

    const getHealthScoreLabel = (score) => {
        if (score < 50) return 'Critical';
        if (score < 70) return 'Medium';
        return 'Good'; // This will not be used with the new filter options
    };

    // Mapping of default key names to custom header names
    const headerMapping = {
        Material_ID: 'Material',
        ModelHealthScore_ID: 'Model',
        // Add other key mappings as needed
    };

    // Function to get the custom header name
    const getCustomHeaderName = (key) => {
        return headerMapping[key] || key; // Fallback to original key if no custom name exists
    };

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-950 pb-4 overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 bg-gray-900 bg-opacity-90 z-10 relative">
                <Header title="Warnings" />
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 flex-grow">
                <div className="flex justify-between items-center pb-4">
                    <div>
                        <label className="text-white mr-2">Filter by Status:</label>
                        <select
                            className="bg-gray-700 text-white px-4 py-2 rounded"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="Critical">Critical</option>
                            <option value="Medium">Medium</option>
                        </select>
                    </div>
                </div>

                <div className="flex w-full gap-4">
                    {/* Material Data Table */}
                    <div className="w-1/2">
                        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
                            <table className="table-auto text-sm w-full">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="text-white font-bold px-4 py-2 whitespace-nowrap">Status</th>
                                        {materialData && materialData.length > 0 &&
                                            Object.keys(materialData[0] || {}).map((key) => (
                                                // Exclude 'ComponentHealthScore_ID' column from rendering
                                                key !== "ComponentHealthScore_ID" && (
                                                    <th
                                                        key={key}
                                                        className="text-white font-bold px-4 py-2 whitespace-nowrap"
                                                    >
                                                        {getCustomHeaderName(key)} {/* Use custom name here */}
                                                    </th>
                                                )
                                            ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedMaterialData.length > 0 ? (
                                        sortedMaterialData.map((item, index) => (
                                            <tr key={index} className="text-center">
                                                <td
                                                    className="text-white font-bold py-2"
                                                    style={{
                                                        backgroundColor: getHealthScoreColor(item.HealthScore),
                                                    }}
                                                >
                                                    {getHealthScoreLabel(item.HealthScore)}
                                                </td>
                                                {Object.entries(item).map(([key, value], i) => (
                                                    key !== "ComponentHealthScore_ID" && ( // Exclude Component ID column
                                                        <td
                                                            key={i}
                                                            className={`px-4 py-2 whitespace-nowrap ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`}
                                                        >
                                                            {value}
                                                        </td>
                                                    )
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={Object.keys(materialData[0] || {}).length}
                                                className="text-center text-gray-400 py-10"
                                            >
                                                No data available with HealthScore 50.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Turbine Data Table */}
                    <div className="w-1/2">
                        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
                            <table className="table-auto text-sm w-full">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="text-white font-bold px-4 py-2 whitespace-nowrap">Status</th>
                                        {turbineData && turbineData.length > 0 &&
                                            Object.keys(turbineData[0] || {}).map((key) => (
                                                key !== "ComponentHealthScore_ID" && ( // Exclude 'ComponentHealthScore_ID' column
                                                    <th
                                                        key={key}
                                                        className="text-white font-bold px-4 py-2 whitespace-nowrap"
                                                    >
                                                        {getCustomHeaderName(key)}
                                                    </th>
                                                )
                                            ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedTurbineData.length > 0 ? (
                                        sortedTurbineData.map((item, index) => (
                                            <tr key={index} className="text-center">
                                                <td
                                                    className="text-white font-bold py-2"
                                                    style={{
                                                        backgroundColor: getHealthScoreColor(item.HealthScore),
                                                    }}
                                                >
                                                    {getHealthScoreLabel(item.HealthScore)}
                                                </td>
                                                {Object.entries(item).map(([key, value], i) => (
                                                    key !== "ComponentHealthScore_ID" && ( // Exclude Component ID column
                                                        <td
                                                            key={i}
                                                            className={`px-4 py-2 whitespace-nowrap ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`}
                                                        >
                                                            {value}
                                                        </td>
                                                    )
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={Object.keys(turbineData[0] || {}).length}
                                                className="text-center text-gray-400 py-10"
                                            >
                                                No data available with HealthScore 50.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartPage;
