import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, Cell, Label } from 'recharts';
import { useState, useEffect } from 'react';

import { getMaterialCategoryHealthScores, getMaterialCategoryPredictions, getMaterialCategoryScoreSummary, getMaterialComponentHealthScores } from '../Utils/MaterialDashboardDataHandler';
import { getMaterialComponentScoreSummary} from '../Utils/MaterialDashboardDataHandler';
import {getMaintenanceForecasts} from '../Utils/MaterialDashboardDataHandler';


const COLORS = [
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(75, 192, 75, 0.6)',
    'rgba(0, 128, 128, 0.6)',
    'rgba(255, 140, 0, 0.6)',
    'rgba(106, 90, 205, 0.6)',
    'rgba(199, 21, 133, 0.6)',
    'rgba(100, 149, 237, 0.6)',
    'rgba(0, 206, 209, 0.6)',
    'rgba(46, 139, 87, 0.6)',
    'rgba(220, 20, 60, 0.6)',
    'rgba(244, 164, 96, 0.6)',
];

const isSelected = (entry, selectedItem) =>
    String(entry.Material_ID) === String(selectedItem) ||
    String(entry.Category) === String(selectedItem) ||
    String(entry.Material) === String(selectedItem) ||
    String(entry.material) === String(selectedItem) ||
    String(entry.Platform) === String(selectedItem) ||
    String(entry.Plant) === String(selectedItem) ||
    String(entry.Plant_ID) === String(selectedItem);


//-------------------------------------------------MaterialPredictions--------------------------------------------------//
const MaterialComponentHealthScoresComponent = ({ type, searchQuery, selectedItem, onItemClick }) => {
    const [MaterialCategoryHealthScores, setMaterialCategoryHealthScores] = useState([]);
    const [MaterialCategoryPredictions, setMaterialCategoryPredictions] = useState([]);
    const [MaterialCategoryScoreSummary, setMaterialCategoryScoreSummary] = useState([]);
    const [MaterialComponentHealthScores, setMaterialComponentHealthScores] = useState([]);
    const [MaterialComponentScoreSummary, setMaterialComponentScoreSummary] = useState([]);
    const [MaintenanceForecasts, setMaintenanceForecasts] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const MaterialCategoryHealthScoresData = await getMaterialCategoryHealthScores();
                const MaterialCategoryPredictionsData = await getMaterialCategoryPredictions();
                const MaterialCategoryScoreSummaryData = await getMaterialCategoryScoreSummary();
                const MaterialComponentHealthScoresData = await getMaterialComponentHealthScores();
                const MaterialComponentScoreSummaryData = await getMaterialComponentScoreSummary();
                const MaintenanceForecastsData = await getMaintenanceForecasts();


                setMaterialCategoryHealthScores(MaterialCategoryHealthScoresData);
                setMaterialCategoryPredictions(MaterialCategoryPredictionsData);
                setMaterialCategoryScoreSummary(MaterialCategoryScoreSummaryData);
                setMaterialComponentHealthScores(MaterialComponentHealthScoresData);
                setMaterialComponentScoreSummary(MaterialComponentScoreSummaryData);
                setMaintenanceForecasts(MaintenanceForecastsData);

            } catch (error) {
                console.error('Error fetching material data:', error);
            }
        };
        fetchData();
    }, []);

            // Normalize search query
    const query = searchQuery.toLowerCase();

    // Example fields to search for each dataset — adjust based on actual data

    const filteredMaterialCategoryHealthScores = MaterialCategoryHealthScores.filter(item =>
        [item.Material_ID, item.HealthScore].some(field =>
        field?.toString().toLowerCase().includes(query)
        )
    );
    
    const filteredMaterialCategoryPredictions = MaterialCategoryPredictions.filter(item =>
        [item.BayesianProbability, item.MonteCarloEstimate, item.Category].some(field =>
        field?.toString().toLowerCase().includes(query)
        )
    );
    
    const filteredMaterialCategoryScoreSummary = MaterialCategoryScoreSummary.filter(item =>
        [item.Material_ID, item.TotalCategoryScore].some(field =>
        field?.toString().toLowerCase().includes(query)
        )
    );
    
    const filteredMaterialComponentHealthScores = MaterialComponentHealthScores.filter(item =>
        [item.Material_ID, item.HealthScore].some(field =>
        field?.toString().toLowerCase().includes(query)
        )
    );
    
    const filteredMaterialComponentScoreSummary = MaterialComponentScoreSummary.filter(item =>
        [item.Material_ID, item.TotalComponentScore].some(field =>
        field?.toString().toLowerCase().includes(query)
        )
    );
    
    const filteredMaintenanceForecasts = MaintenanceForecasts.filter(item =>
        [item.Material_ID, item.Plant_ID, item.Forecast_ID, item.LastMaintenance, item.AverageIntervalDays, item.NextEstimatedMaintenanceDate].some(field =>
        field?.toString().toLowerCase().includes(query)
        )
    );


    //Shared click handler for all charts
    const handleClick = (data) => {
        if (data && onItemClick) {
            const key =
                data.Material_ID ??
                data.Category ??
                data.Material ??
                data.Platform ??
                data.material ??
                null;
    
            // Toggle selection
            if (key === selectedItem) {
                onItemClick(null); // deselect
            } else {
                onItemClick(key);
            }
        }
    };
    

    if (type === 'bar_MaterialComponentScoreSummary') {
        const getColorByScore = (score) => {
            if (score < 50) return 'rgba(255, 99, 132, 0.8)';
            if (score < 70) return 'rgba(255, 159, 64, 0.8)';
            return 'rgba(75, 192, 75, 0.8)';
        };

        const rawData = filteredMaterialComponentScoreSummary.map(item => ({
            Material_ID: item.Material_ID,
            TotalComponentScore: item.TotalComponentScore || 0
        }));
        
        // Shuffle the array but ensure selectedItem stays included
        const shuffled = [...rawData].sort(() => Math.random() - 0.5);

            // Ensure selected item is included
            let topItems = shuffled.slice(0, 10);

            const alreadyIncluded = topItems.some(item => String(item.Material_ID) === String(selectedItem));
            if (!alreadyIncluded && selectedItem) {
                const selectedEntry = rawData.find(item => String(item.Material_ID) === String(selectedItem));
                if (selectedEntry) {
                    // Replace the last item with the selected one to ensure it's visible
                    topItems[topItems.length - 1] = selectedEntry;
                }
            }

            const formattedData = topItems;

        const CustomTooltipBarMaterialComponentScoreSummary = ({ active, payload }) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                    <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                        <p><strong>Material ID:</strong> {data.Material_ID}</p>
                        <p><strong>Component Score:</strong> {data.TotalComponentScore}</p>
                    </div>
                );
            }
            return null;
        };

        return (
            <div className="w-full h-full relative">
            {/* Info Icon Tooltip */}
                <div className="absolute top-2 right-1 group cursor-pointer z-10">
                <span className="text-gray-500">ℹ️</span>
                <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                    <p><strong>Chart Info:</strong></p>
                    <p>
                        This chart shows the Total Component Score for a sample of materials, helping identify which materials score higher in component health or reliability.
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p><strong>Total Component Score:</strong></p>
                    <p>
                        A score between 0 and 100 representing the overall condition or health of a material based on internal component analysis. Higher scores indicate better health or lower risk.
                    </p>
                    </div>
                </div>
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                        >
                            <XAxis dataKey="Material_ID">
                                <Label value="Material ID" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis domain={[0, 100]}>
                                <Label value="Total Component Score" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                        <Tooltip content={<CustomTooltipBarMaterialComponentScoreSummary />} />
                        <Bar dataKey="TotalComponentScore">
                                {formattedData.map((entry, index) => (
                                    <Cell
                                    key={`cell-${index}`}
                                    fill={isSelected(entry, selectedItem) ? '#00ffff' : getColorByScore(entry.TotalComponentScore)}
                                    onClick={() => handleClick(entry)}
                                    style={{ cursor: 'pointer' }}
                                    />
                                ))}
                                </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'bar_MaterialComponentHealthScores') {
        const getColorByScore = (score) => {
            if (score < 50) return 'rgba(255, 99, 132, 0.8)';
            if (score < 70) return 'rgba(255, 159, 64, 0.8)';
            return 'rgba(75, 192, 75, 0.8)';
        };

        const rawData = filteredMaterialComponentHealthScores.map(item => ({
            Material_ID: item.Material_ID,
            HealthScore: item.HealthScore || 0
        }));
        
        // Shuffle the array but ensure selectedItem stays included
        const shuffled = [...rawData].sort(() => Math.random() - 0.5);

            // Ensure selected item is included
            let topItems = shuffled.slice(0, 10);

            const alreadyIncluded = topItems.some(item => String(item.Material_ID) === String(selectedItem));
            if (!alreadyIncluded && selectedItem) {
                const selectedEntry = rawData.find(item => String(item.Material_ID) === String(selectedItem));
                if (selectedEntry) {
                    // Replace the last item with the selected one to ensure it's visible
                    topItems[topItems.length - 1] = selectedEntry;
                }
            }

            const formattedData = topItems;

            const CustomTooltipBarMaterialComponentHealthScores = ({ active, payload }) => {
                if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                        <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                            <p><strong>Material ID:</strong> {data.Material_ID}</p>
                            <p><strong>Component Summary Score:</strong> {data.HealthScore}</p>
                        </div>
                    );
                }
                return null;
            };

        return (
            <div className="w-full h-full relative">
            {/* Info Icon Tooltip */}
                <div className="absolute top-2 right-1 group cursor-pointer z-10">
                <span className="text-gray-500">ℹ️</span>
                    <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                        <p><strong>Chart Info:</strong></p>
                        <p>
                            This chart displays the Health Score of selected materials based on the performance and reliability of their components.
                        </p>
                        <hr className="my-2 border-gray-300" />
                        <p><strong>Component Health Score:</strong></p>
                        <p>
                            A score from 0 to 100 representing the overall health of a material. Lower scores may indicate issues or a higher chance of failure, while higher scores suggest the component is in good condition.
                        </p>
                    </div>
                </div>
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                        >
                            <XAxis dataKey="Material_ID">
                                <Label value="Material ID" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis domain={[0, 100]}>
                                <Label value="Summary Component Score" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip content={<CustomTooltipBarMaterialComponentHealthScores />} />
                            <Bar dataKey="HealthScore">
                                {formattedData.map((entry, index) => (
                                    <Cell
                                    key={`cell-${index}`}
                                    fill={isSelected(entry, selectedItem) ? '#00ffff' : getColorByScore(entry.HealthScore)}
                                    onClick={() => handleClick(entry)}
                                    style={{ cursor: 'pointer' }}
                                    />
                                ))}
                                </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'bar_MaterialCategoryScoreSummary') {
        const getColorByScore = (score) => {
            if (score < 50) return 'rgba(255, 99, 132, 0.8)';
            if (score < 70) return 'rgba(255, 159, 64, 0.8)';
            return 'rgba(75, 192, 75, 0.8)';
        };

        const rawData = filteredMaterialCategoryScoreSummary.map(item => ({
            Category: item.Category,
            TotalCategoryScore: item.TotalCategoryScore || 0
        }));
        
        // Shuffle the array but ensure selectedItem stays included
        const shuffled = [...rawData].sort(() => Math.random() - 0.5);

        // Ensure selected item is included
        let topItems = shuffled.slice(0, 10);
        
        const alreadyIncluded = topItems.some(item => String(item.Material_ID) === String(selectedItem));
        if (!alreadyIncluded && selectedItem) {
            const selectedEntry = rawData.find(item => String(item.Material_ID) === String(selectedItem));
            if (selectedEntry) {
                // Replace the last item with the selected one to ensure it's visible
                topItems[topItems.length - 1] = selectedEntry;
            }
        }
        
        const formattedData = topItems;

            const CustomTooltipBarMaterialCategoryScoreSummary = ({ active, payload }) => {
                if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                        <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                            <p><strong>Category:</strong> {data.Category}</p>
                            <p><strong>Total Category Score:</strong> {data.TotalCategoryScore}</p>
                        </div>
                    );
                }
                return null;
            };

        return (
            <div className="w-full h-full relative">
            {/* Info Icon Tooltip */}
                <div className="absolute top-2 right-1 group cursor-pointer z-10">
                <span className="text-gray-500">ℹ️</span>
                    <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                        <p><strong>Chart Info:</strong></p>
                        <p>
                            This chart shows the Total Category Score for selected materials, which summarizes how each material performs across various categorized metrics.
                        </p>
                        <hr className="my-2 border-gray-300" />
                        <p><strong>Total Category Score:</strong></p>
                        <p>
                            A score from 0 to 100 based on aggregated category-level performance. It helps identify which materials are strong performers across all relevant classification groups.
                        </p>
                    </div>
                </div>
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                        >
                            <XAxis dataKey="Category">
                                <Label value="Category" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis domain={[0, 100]}>
                                <Label value="Total Category Score" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip content={<CustomTooltipBarMaterialCategoryScoreSummary />} />
                            <Bar dataKey="TotalCategoryScore">
                                {formattedData.map((entry, index) => (
                                    <Cell
                                    key={`cell-${index}`}
                                    fill={isSelected(entry, selectedItem) ? '#00ffff' : getColorByScore(entry.TotalCategoryScore)}
                                    onClick={() => handleClick(entry)}
                                    style={{ cursor: 'pointer' }}
                                    />
                                ))}
                                </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'bar_MaterialCategoryHealthScores') {
        const getColorByScore = (score) => {
            if (score < 50) return 'rgba(255, 99, 132, 0.8)';
            if (score < 70) return 'rgba(255, 159, 64, 0.8)';
            return 'rgba(75, 192, 75, 0.8)';
        };
    
        const rawData = Object.values(
            filteredMaterialCategoryHealthScores.reduce((acc, item) => {
                const key = item.Category;
                if (!acc[key]) {
                    acc[key] = {
                        Category: key,
                        HealthScore: item.HealthScore || 0
                    };
                }
                return acc;
            }, {})
        );
    
        // Conditionally filter for selected item or show a shuffled sample
        const formattedData = selectedItem
            ? rawData.filter(item => String(item.Category) === String(selectedItem))
            : [...rawData].sort(() => Math.random() - 0.5).slice(0, 10);
    
        const CustomTooltipBarMaterialCategoryHealthScores = ({ active, payload }) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                    <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                        <p><strong>Category:</strong> {data.Category}</p>
                        <p><strong>Total Category Score:</strong> {data.HealthScore}</p>
                    </div>
                );
            }
            return null;
        };
    
        return (
            <div className="w-full h-full relative">
                {/* Info Icon Tooltip */}
                <div className="absolute top-2 right-1 group cursor-pointer z-10">
                    <span className="text-gray-500">ℹ️</span>
                    <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                        <p><strong>Chart Info:</strong></p>
                        <p>
                            This chart visualizes the Category Health Score for selected materials, reflecting their reliability and usage trends within their classification group.
                        </p>
                        <hr className="my-2 border-gray-300" />
                        <p><strong>Category Health Score:</strong></p>
                        <p>
                            A score from 0 to 100 that combines replacement frequency, usage rate, and performance within a material category. Higher scores suggest better overall health and lower maintenance risk.
                        </p>
                    </div>
                </div>
    
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                        >
                            <XAxis dataKey="Category">
                                <Label value="Category" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis domain={[0, 100]}>
                                <Label value="Total Material Category Score" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip content={<CustomTooltipBarMaterialCategoryHealthScores />} />
                            <Bar dataKey="HealthScore">
                                {formattedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={isSelected(entry, selectedItem) ? '#00ffff' : getColorByScore(entry.HealthScore)}
                                        onClick={() => handleClick(entry)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }
    
    if (type === 'table_MaintenanceForecasts') {
        const forecastData = Array.isArray(filteredMaintenanceForecasts) ? filteredMaintenanceForecasts : [];

        const formatDate = (dateStr) =>
            dateStr ? new Date(dateStr).toLocaleDateString('en-GB') : 'N/A'; // 'dd/mm/yyyy'

        return (
            <div className="w-full h-full relative">
            {/* Info Icon Tooltip */}
                <div className="absolute top-2 right-1 group cursor-pointer z-10">
                <span className="text-gray-500">ℹ️</span>
                    <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                    <p><strong>Table Info:</strong></p>
                    <p>
                        This table provides maintenance forecast details for materials across different plants based on historical usage and replacement intervals.
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p><strong>Average Interval (Days):</strong></p>
                    <p>
                        The average number of days between past maintenance events. If no history exists, a default of 365+ days is assumed.
                    </p>
                    <p className="mt-2"><strong>Next Maintenance Date:</strong></p>
                    <p>
                        The predicted date for the next maintenance based on the last recorded event and the average interval.
                    </p>
                    </div>
                </div>
                <table className="min-w-full table-auto text-sm text-gray-300">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-left">Forecast ID</th>
                            <th className="px-4 py-2 text-left">Material ID</th>
                            <th className="px-4 py-2 text-left">Plant ID</th>
                            <th className="px-4 py-2 text-left">Last Maintenance</th>
                            <th className="px-4 py-2 text-left">Average Interval (Days)</th>
                            <th className="px-4 py-2 text-left">Next Maintenance Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forecastData.length > 0 ? (
                            forecastData.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`cursor-pointer ${String(item.Material_ID) === String(selectedItem) ? 'bg-cyan-800 text-white' : index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`}

                                    onClick={() => handleClick(item)}
                                >
                                    <td className="px-4 py-2">{item.Forecast_ID}</td>
                                    <td className="px-4 py-2">{item.Material_ID}</td>
                                    <td className="px-4 py-2">{item.Plant_ID}</td>
                                    <td className="px-4 py-2">{formatDate(item.LastMaintenance)}</td>
                                    <td className="px-4 py-2">{item.AverageIntervalDays ?? 'N/A'}</td>
                                    <td className="px-4 py-2">{formatDate(item.NextEstimatedMaintenanceDate)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-gray-400 py-10">
                                    No maintenance forecasts available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }


    if (type === 'line_MaterialCategoryPredictions') {
        const formattedData = Array.isArray(filteredMaterialCategoryPredictions) ? filteredMaterialCategoryPredictions : [];

        const CustomTooltipBarMaterialCategoryHealthScores = ({ active, payload }) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                    <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                        <p><strong>Material ID:</strong> {data.Material_ID}</p>
                        <p><strong>Total Category Score:</strong> {data.HealthScore}</p>
                    </div>
                );
            }
            return null;
        };

        const CustomDot = ({ cx, cy, payload }) => {
            if (typeof cx !== 'number' || typeof cy !== 'number') return null;
        
            const isSelected = selectedItem === payload.Category;
            return (
                <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 2 : 2}
                    strokeWidth={isSelected ? 3 : 1}
                    stroke={isSelected ? '#00ffff' : '#444'}
                    fill={isSelected ? '#00ffff' : '#00b0ad'}

                />
            );
        };

        return (
            <div className="w-full h-full relative">
            {/* Info Icon Tooltip */}
                <div className="absolute top-2 right-1 group cursor-pointer z-10">
                <span className="text-gray-500">ℹ️</span>
                    <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                    <p><strong>Chart Info:</strong></p>
                    <p>
                        This chart visualizes the predicted likelihood of replacement across different material categories using two distinct statistical methods.
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p><strong>Bayesian Probability:</strong></p>
                    <p>
                        Continuously updates the likelihood of replacement as more historical data becomes available.
                    </p>
                    <p className="mt-2"><strong>Monte Carlo Estimate:</strong></p>
                    <p>
                        Uses random simulations to estimate the chance of replacement based on variability in past patterns.
                    </p>
                    </div>
                </div>
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                            onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                        >
                            <XAxis
                                dataKey="Category"
                                angle={-30}
                                textAnchor="end"
                                interval={0}
                            >
                                <Label
                                    value="Material Category"
                                    offset={-5}
                                    position="insideBottom"
                                    style={{ textAnchor: 'middle' }}
                                />
                            </XAxis>
                            <YAxis domain={[0, 1]}>
                                <Label
                                    value="Probability"
                                    angle={-90}
                                    position="insideLeft"
                                    style={{ textAnchor: 'middle' }}
                                />
                            </YAxis>
                            <Tooltip content={<CustomTooltipBarMaterialCategoryHealthScores />} />
                            <Legend verticalAlign="top" align="center" layout="horizontal" />
                            <Line
                                type="monotone"
                                dataKey="BayesianProbability"
                                name="Bayesian Probability"
                                stroke="#00b0ad"
                                strokeWidth={2}
                                dot={<CustomDot />}
                            />
                            <Line
                                type="monotone"
                                dataKey="MonteCarloEstimate"
                                name="Monte Carlo Estimate"
                                stroke="#ff7f0e"
                                strokeWidth={2}
                                dot={<CustomDot />}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

        
    return null;
};

export default MaterialComponentHealthScoresComponent;