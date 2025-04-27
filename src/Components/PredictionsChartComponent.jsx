import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, PieChart, Pie, Bar, ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, Cell, Label } from 'recharts';
import { ArrowLeft, ArrowRight, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';





import { getMaterialCategoryHealthScores, getMaterialCategoryPredictions, getMaterialCategoryScoreSummary, getMaterialComponentHealthScores } from '../Utils/MaterialDashboardDataHandler';
import { getMaterialComponentScoreSummary, getReplacementPredictions, getReplacementPredictionGlobal } from '../Utils/MaterialDashboardDataHandler';
import { getTurbineModelHealthScores, getTurbineModelScoreSummary, getTurbinePlatformHealthScores, getTurbinePlatformScoreSummary } from '../Utils/TurbineDashboardDataHandler';

import {getMaterialPredictions, getMaintenanceForecasts , getMaterialStatusTransitions , getMonteCarloDominance} from '../Utils/MaterialDashboardDataHandler';







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

//-------------------------------------------------MaterialPredictions--------------------------------------------------//
const PredictionsChartComponent = ({ type, selectedItem, onItemClick }) => {
    const [MaterialCategoryHealthScores, setMaterialCategoryHealthScores] = useState([]);
    const [MaterialCategoryPredictions, setMaterialCategoryPredictions] = useState([]);
    const [MaterialCategoryScoreSummary, setMaterialCategoryScoreSummary] = useState([]);
    const [MaterialComponentHealthScores, setMaterialComponentHealthScores] = useState([]);
    const [MaterialComponentScoreSummary, setMaterialComponentScoreSummary] = useState([]);
    const [ReplacementPredictions, setReplacementPredictions] = useState([]);
    const [ReplacementPredictionGlobal, setReplacementPredictionGlobal] = useState([]);

    const [TurbineModelHealthScores, setTurbineModelHealthScores] = useState([]);
    const [TurbineModelScoreSummary, setTurbineModelScoreSummary] = useState([]);
    const [TurbinePlatformHealthScores, setTurbinePlatformHealthScores] = useState([]);
    const [TurbinePlatformScoreSummary, setTurbinePlatformScoreSummary] = useState([]);

    const[MaterialPredictions, setMaterialPredictions] = useState([]);
    const [MaintenanceForecasts, setMaintenanceForecasts] = useState([]);
    const [MaterialStatusTransitions, setMaterialStatusTransitions] = useState([]);
    const [MonteCarloDominance, setMonteCarloDominance] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const MaterialCategoryHealthScoresData = await getMaterialCategoryHealthScores();
                const MaterialCategoryPredictionsData = await getMaterialCategoryPredictions();
                const MaterialCategoryScoreSummaryData = await getMaterialCategoryScoreSummary();
                const MaterialComponentHealthScoresData = await getMaterialComponentHealthScores();
                const MaterialComponentScoreSummaryData = await getMaterialComponentScoreSummary();
                const ReplacementPredictionsData = await getReplacementPredictions();
                const ReplacementPredictionGlobalData = await getReplacementPredictionGlobal();

                const TurbineModelHealthScoresData = await getTurbineModelHealthScores();
                const TurbineModelScoreSummaryData = await getTurbineModelScoreSummary();
                const TurbinePlatformHealthScoresData = await getTurbinePlatformHealthScores();
                const TurbinePlatformScoreSummaryData = await getTurbinePlatformScoreSummary();

                const MaterialPredictionsData = await getMaterialPredictions();
                const MaintenanceForecastsData = await getMaintenanceForecasts();
                const MaterialStatusTransitionsData = await getMaterialStatusTransitions();
                const MonteCarloDominanceData = await getMonteCarloDominance();


                console.log('Fetched data in component:', MaterialCategoryHealthScoresData);
                setMaterialCategoryHealthScores(MaterialCategoryHealthScoresData);
                setMaterialCategoryPredictions(MaterialCategoryPredictionsData);
                setMaterialCategoryScoreSummary(MaterialCategoryScoreSummaryData);
                setMaterialComponentHealthScores(MaterialComponentHealthScoresData);
                setMaterialComponentScoreSummary(MaterialComponentScoreSummaryData);
                setReplacementPredictions(ReplacementPredictionsData);
                setReplacementPredictionGlobal(ReplacementPredictionGlobalData);


                setTurbineModelHealthScores(TurbineModelHealthScoresData);
                setTurbineModelScoreSummary(TurbineModelScoreSummaryData);
                setTurbinePlatformHealthScores(TurbinePlatformHealthScoresData);
                setTurbinePlatformScoreSummary(TurbinePlatformScoreSummaryData);

                setMaterialPredictions(MaterialPredictionsData);
                setMaintenanceForecasts(MaintenanceForecastsData);
                setMaterialStatusTransitions(MaterialStatusTransitionsData);
                setMonteCarloDominance(MonteCarloDominanceData);

            } catch (error) {
                console.error('Error fetching material data:', error);
            }
        };

        fetchData();
    }, []);
    //Shared click handler for all charts
    const handleClick = (data) => {
        if (data && onItemClick) {
            const key = data.materialDescription || data.material || data.materialCategory;
            onItemClick(key);
        }
    };

    if (type === 'bar_ReplacementPrediction') {
        const formattedData = ReplacementPredictions
            .map(item => ({
                materialDescription: item.Material_Description || 'Unknown',
                bayesianProbability: item.BayesianProbability || 0
            }))
            .sort((a, b) => b.bayesianProbability - a.bayesianProbability)
            .slice(0, 10);

        return (
            <div className='w-full h-full flex flex-col justify-between'>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }} onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}>
                            <XAxis dataKey='materialDescription'>
                                <Label value="Material Description" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis domain={[0, 1]}>
                                <Label value="Bayesian Probability" angle={-45} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip />
                            <Bar dataKey='bayesianProbability'>
                                {formattedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.materialDescription === selectedItem ? '#FFD700' : COLORS[index % COLORS.length]} // Highlight selected
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'line_MonteCarloVsBayesian') {
        const topMaterials = ReplacementPredictions
            .sort((a, b) => b.MonteCarloProbability - a.MonteCarloProbability)
            .slice(0, 10);

        const formattedData = topMaterials.map(item => ({
            material: item.Material_Description,
            monteCarlo: item.MonteCarloProbability * 100,
            bayesian: item.BayesianProbability * 100,
        }));

        return (
            <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                            onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                        >
                            <XAxis dataKey="material" angle={-45} textAnchor="end" interval={0}>
                                <Label value="Material Description" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Probability (%)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip />
                            <Legend verticalAlign="top" align="center" layout="horizontal" />
                            <Line
                                type="monotone"
                                dataKey="monteCarlo"
                                name="Monte Carlo Probability"
                                stroke={selectedItem ? "#00b0ad" : "#00b0ad"}
                                strokeWidth={selectedItem ? 4 : 2}
                                dot={{ r: 3 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="bayesian"
                                name="Bayesian Probability"
                                stroke={selectedItem ? "#ff7f0e" : "#ff7f0e"}
                                strokeWidth={selectedItem ? 4 : 2}
                                dot={{ r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'line_GlobalMonteCarloVsBayesian') {
        const categoryData = {};

        ReplacementPredictionGlobal.forEach(item => {
            const category = item.MaterialCategory || 'Unclassified';
            if (!categoryData[category]) {
                categoryData[category] = {
                    materialCategory: category,
                    monteCarlo: 0,
                    bayesian: 0,
                    count: 0
                };
            }
            categoryData[category].monteCarlo += item.MonteCarloProbability * 100;
            categoryData[category].bayesian += item.BayesianProbability * 100;
            categoryData[category].count += 1;
        });

        const formattedData = Object.values(categoryData).map(item => ({
            materialCategory: item.materialCategory,
            monteCarlo: item.monteCarlo / item.count,
            bayesian: item.bayesian / item.count,
        }));

        return (
            <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                            onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                        >
                            <XAxis dataKey="materialCategory" angle={-30} textAnchor="end" interval={0}>
                                <Label value="Material Category" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Probability (%)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip />
                            <Legend verticalAlign="top" align="center" layout="horizontal" />
                            <Line
                                type="monotone"
                                dataKey="monteCarlo"
                                name="Monte Carlo Probability"
                                stroke="#00b0ad"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="bayesian"
                                name="Bayesian Probability"
                                stroke="#ff7f0e"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'bubble_MonteCarloDominance') {
        const DESCRIPTION_KEY = 'description';
        const DOMINANCE_COUNT_KEY = 'dominanceCount';
        const PERCENTAGE_KEY = 'percentage';

        const topDominantMaterials = MonteCarloDominance
            .sort((a, b) => b.DominanceCount - a.DominanceCount)
            .slice(0, 20)
            .map((item) => ({
                [DESCRIPTION_KEY]: item.Description,
                [DOMINANCE_COUNT_KEY]: item.DominanceCount,
                [PERCENTAGE_KEY]: item.Percentage,
            }));

        const CustomTooltip = ({ active, payload }) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                    <div className="bg-gray p-2 rounded shadow text-sm border border-gray-200">
                        <p><strong>Description:</strong> {data.description}</p>
                        <p><strong>Dominance %:</strong> {data.percentage.toFixed(2)}%</p>
                    </div>
                );
            }
            return null;
        };

        return (
            <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}
                            onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                        >
                            <XAxis
                                type="number"
                                dataKey={DOMINANCE_COUNT_KEY}
                                name="Dominance Count"
                                label={{ value: "Dominance Count", position: 'insideBottom', offset: -5, style: { textAnchor: 'middle' } }}
                            />
                            <YAxis
                                type="number"
                                dataKey={PERCENTAGE_KEY}
                                name="Dominance Percentage"
                                label={{ value: "Dominance Percentage (%)", angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                            />
                            <ZAxis
                                type="number"
                                dataKey={DOMINANCE_COUNT_KEY}
                                range={[60, 400]}
                                name="Bubble Size"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Scatter
                                name="Top Dominant Materials"
                                data={topDominantMaterials}
                                fill="#8884d8"
                            >
                                {topDominantMaterials.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.description === selectedItem ? '#FFD700' : COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Scatter>
                            <Legend verticalAlign="top" align="center" layout="horizontal" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }


    if (type === 'pie_MaterialStatusTransitions') {
        const statusCounts = MaterialStatusTransitions.reduce((acc, item) => {
            const status = item.PlantSpecificMaterialStatus || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const pieData = Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count,
        }));

        return (
            <div className="w-full h-full flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="count"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius="70%"
                            fill="#8884d8"
                            onClick={(e) => handleClick(e)}
                            label={({ status, percent }) => `${status} (${(percent * 100).toFixed(0)}%)`}
                        >
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.status === selectedItem ? '#FFD700' : COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [`${value} Materials`, name]}
                            labelFormatter={(label) => `Status: ${label}`}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }


    if (type === 'table_MaterialStatusTransitions') {
        return (
            <div className="w-full h-full overflow-y-auto">
                <table className="min-w-full table-auto text-sm text-gray-300">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-4 py-2">Material</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Prev Status</th>
                            <th className="px-4 py-2">Plant</th>
                            <th className="px-4 py-2">Current Status</th>
                            <th className="px-4 py-2">Transitions</th>
                            <th className="px-4 py-2">Direction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MaterialStatusTransitions.map((item, index) => (
                            <tr
                                key={index}
                                className={`cursor-pointer ${(item.Description === selectedItem) ? 'bg-yellow-600' : (index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900')
                                    }`}
                                onClick={() => handleClick(item)}
                            >
                                <td className="px-4 py-2">{item.Material}</td>
                                <td className="px-4 py-2">{item.Description}</td>
                                <td className="px-4 py-2">{item.PrevStatus}</td>
                                <td className="px-4 py-2">{item.Plant}</td>
                                <td className="px-4 py-2">{item.PlantSpecificMaterialStatus}</td>
                                <td className="px-4 py-2">{item.TransitionCount}</td>
                                <td className="px-4 py-2 flex items-center justify-center">
                                    {item.Direction === 'left' && <ArrowLeft className="text-red-500" size={20} />}
                                    {item.Direction === 'right' && <ArrowRight className="text-green-500" size={20} />}
                                    {item.Direction === 'none' && <Minus className="text-blue-400" size={20} />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }


    if (type === 'table_MaterialPredictions') {
        return (
            <div className="w-full h-full overflow-y-auto">
                <table className="min-w-full table-auto text-sm text-gray-300">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-4 py-2">Material ID</th>
                            <th className="px-4 py-2">A9B Number</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Batch Managed</th>
                            <th className="px-4 py-2">Future Replacement Probability</th>
                            <th className="px-4 py-2">Total Replacements</th>
                            <th className="px-4 py-2">Total Usage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MaterialPredictions.map((item, index) => (
                            <tr
                                key={index}
                                className={`cursor-pointer ${(item.Material_Description === selectedItem) ? 'bg-yellow-600' : (index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900')
                                    }`}
                                onClick={() => handleClick(item)}
                            >
                                <td className="px-4 py-2">{item.Material_ID}</td>
                                <td className="px-4 py-2">{item.Material_A9B_Number}</td>
                                <td className="px-4 py-2">{item.MaterialCategory}</td>
                                <td className="px-4 py-2">{item.Material_Description}</td>
                                <td className="px-4 py-2">{item.Is_Batch_Managed ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-2">{(item.Future_Replacement_Probability * 100).toFixed(2)}%</td>
                                <td className="px-4 py-2">{item.TotalReplacementCount}</td>
                                <td className="px-4 py-2">{item.TotalUsageCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }


    if (type === 'bar_MaterialComponentScoreSummary') {
        const getColorByScore = (score) => {
            if (score < 50) return 'rgba(255, 99, 132, 0.8)';
            if (score < 70) return 'rgba(255, 159, 64, 0.8)';
            return 'rgba(75, 192, 75, 0.8)';
        };

        const formattedData = MaterialComponentScoreSummary
            .map(item => ({
                Material_ID: item.Material_ID,
                TotalComponentScore: item.TotalComponentScore || 0,
            }))
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

        return (
            <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                            onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                        >
                            <XAxis dataKey="Material_ID">
                                <Label value="Material ID" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis domain={[0, 100]}>
                                <Label value="Total Component Score" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip
                                formatter={(value) => [`${value}`, 'TotalComponentScore']}
                                labelFormatter={(label) => `Material ID: ${label}`}
                            />
                            <Bar dataKey="TotalComponentScore">
                                {formattedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={(entry.Material_ID === selectedItem) ? '#FFD700' : getColorByScore(entry.TotalComponentScore)}
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

        const formattedData = MaterialComponentHealthScores
            .map(item => ({
                Material_ID: item.Material_ID,
                HealthScore: item.HealthScore || 0,
            }))
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

        return (
            <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                            onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                        >
                            <XAxis dataKey="Material_ID">
                                <Label value="Material ID" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis domain={[0, 100]}>
                                <Label value="Total Component Score" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip
                                formatter={(value) => [`${value}`, 'HealthScore']}
                                labelFormatter={(label) => `Material ID: ${label}`}
                            />
                            <Bar dataKey="HealthScore">
                                {formattedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={(entry.Material_ID === selectedItem) ? '#FFD700' : getColorByScore(entry.HealthScore)}
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

        const formattedData = MaterialCategoryScoreSummary
            .map(item => ({
                Material_ID: item.Material_ID,
                TotalCategoryScore: item.TotalCategoryScore || 0,
            }))
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

        return (
            <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                            onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                        >
                            <XAxis dataKey="Material_ID">
                                <Label value="Material ID" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis domain={[0, 100]}>
                                <Label value="Total Category Score" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip
                                formatter={(value) => [`${value}`, 'TotalCategoryScore']}
                                labelFormatter={(label) => `Material ID: ${label}`}
                            />
                            <Bar dataKey="TotalCategoryScore">
                                {formattedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={(entry.Material_ID === selectedItem) ? '#FFD700' : getColorByScore(entry.TotalCategoryScore)}
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

        const formattedData = MaterialCategoryHealthScores
            .map(item => ({
                Material_ID: item.Material_ID,
                HealthScore: item.HealthScore || 0,
            }))
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

        return (
            <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                            onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                        >
                            <XAxis dataKey="Material_ID">
                                <Label value="Material ID" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis domain={[0, 100]}>
                                <Label value="Total Material Category Score" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip
                                formatter={(value) => [`${value}`, 'HealthScore']}
                                labelFormatter={(label) => `Material ID: ${label}`}
                            />
                            <Bar dataKey="HealthScore">
                                {formattedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={(entry.Material_ID === selectedItem) ? '#FFD700' : getColorByScore(entry.HealthScore)}
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
        const forecastData = Array.isArray(MaintenanceForecasts) ? MaintenanceForecasts : [];

        const formatDate = (dateStr) =>
            dateStr ? new Date(dateStr).toLocaleDateString('en-GB') : 'N/A'; // 'dd/mm/yyyy'

        return (
            <div className="w-full h-full overflow-y-auto">
                <table className="min-w-full table-auto text-sm text-gray-300">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-4 py-2">Forecast ID</th>
                            <th className="px-4 py-2">Material ID</th>
                            <th className="px-4 py-2">Plant ID</th>
                            <th className="px-4 py-2">Last Maintenance</th>
                            <th className="px-4 py-2">Average Interval (Days)</th>
                            <th className="px-4 py-2">Next Maintenance Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forecastData.length > 0 ? (
                            forecastData.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`cursor-pointer ${(item.Material_ID === selectedItem) ? 'bg-yellow-600' : (index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900')
                                        }`}
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
        const formattedData = Array.isArray(MaterialCategoryPredictions) ? MaterialCategoryPredictions : [];

        return (
            <div className="w-full h-full flex flex-col justify-between">
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
                            <Tooltip />
                            <Legend verticalAlign="top" align="center" layout="horizontal" />
                            <Line
                                type="monotone"
                                dataKey="BayesianProbability"
                                name="Bayesian Probability"
                                stroke="#00b0ad"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="MonteCarloEstimate"
                                name="Monte Carlo Estimate"
                                stroke="#ff7f0e"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }


    //-------------------------------------------------------------------Turbine Model Predictions--------------------------------------//
    if (type === 'bar_TurbineModelHealthScores') {
        const getColorByScore = (score) => {
            if (score < 50) return 'rgba(255, 99, 132, 0.8)';
            if (score < 70) return 'rgba(255, 159, 64, 0.8)';
            return 'rgba(75, 192, 75, 0.8)';
        };

        const formattedData = Array.isArray(TurbineModelHealthScores) ? TurbineModelHealthScores
            .map(item => ({
                TurbineModel: item.TurbineModel,
                HealthScore: item.HealthScore || 0,
            }))
            .sort(() => Math.random() - 0.5)
            .slice(0, 10) : [];

        return (
            <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                            onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                        >
                            <XAxis dataKey="TurbineModel" angle={-30} textAnchor="end" interval={0}>
                                <Label
                                    value="Turbine Model"
                                    offset={-5}
                                    position="insideBottom"
                                    style={{ textAnchor: 'middle' }}
                                />
                            </XAxis>
                            <YAxis domain={[0, 100]}>
                                <Label
                                    value="Health Score (%)"
                                    angle={-90}
                                    position="insideLeft"
                                    style={{ textAnchor: 'middle' }}
                                />
                            </YAxis>
                            <Tooltip
                                formatter={(value) => [`${value}%`, 'HealthScore']}
                                labelFormatter={(label) => `Turbine Model: ${label}`}
                            />
                            <Bar dataKey="HealthScore">
                                {formattedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={(entry.TurbineModel === selectedItem) ? '#FFD700' : getColorByScore(entry.HealthScore)}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'bar_TurbineModelScoreSummary') {
        const getColorByScore = (score) => {
            if (score < 50) return 'rgba(255, 99, 132, 0.8)';
            if (score < 70) return 'rgba(255, 159, 64, 0.8)';
            return 'rgba(75, 192, 75, 0.8)';
        };

        const formattedData = Array.isArray(TurbineModelScoreSummary) ? TurbineModelScoreSummary
            .map(item => ({
                TurbineModel: item.TurbineModel,
                TotalModelScore: item.TotalModelScore || 0,
            }))
            .sort(() => Math.random() - 0.5)
            .slice(0, 10) : [];

        return (
            <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                            onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                        >
                            <XAxis dataKey="TurbineModel" angle={-30} textAnchor="end" interval={0}>
                                <Label
                                    value="Turbine Model"
                                    offset={-5}
                                    position="insideBottom"
                                    style={{ textAnchor: 'middle' }}
                                />
                            </XAxis>
                            <YAxis domain={[0, 100]}>
                                <Label
                                    value="Health Score Summary (%)"
                                    angle={-90}
                                    position="insideLeft"
                                    style={{ textAnchor: 'middle' }}
                                />
                            </YAxis>
                            <Tooltip
                                formatter={(value) => [`${value}%`, 'HealthScore']}
                                labelFormatter={(label) => `Turbine Model: ${label}`}
                            />
                            <Bar dataKey="TotalModelScore">
                                {formattedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={(entry.TurbineModel === selectedItem) ? '#FFD700' : getColorByScore(entry.TotalModelScore)}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'radar_TurbineModelHealthScores_ByPlant') {
        const getColorByScore = (score) => {
            if (score < 50) return 'rgba(255, 99, 132, 0.8)';
            if (score < 70) return 'rgba(255, 159, 64, 0.8)';
            return 'rgba(75, 192, 75, 0.8)';
        };

        const modelGroups = {};

        TurbineModelHealthScores.forEach(item => {
            const model = item.TurbineModel || 'Unknown';
            const healthScore = item.HealthScore || 0;

            if (!modelGroups[model]) {
                modelGroups[model] = { model, totalHealthScore: 0, count: 0 };
            }
            modelGroups[model].totalHealthScore += healthScore;
            modelGroups[model].count += 1;
        });

        const formattedData = Object.values(modelGroups)
            .map(item => ({
                TurbineModel: item.model,
                AvgHealthScore: item.count > 0 ? item.totalHealthScore / item.count : 0,
            }))
            .sort((a, b) => b.AvgHealthScore - a.AvgHealthScore)
            .slice(0, 10);

        const overallAvg = formattedData.length > 0
            ? formattedData.reduce((sum, item) => sum + item.AvgHealthScore, 0) / formattedData.length
            : 0;

        const radarColor = getColorByScore(overallAvg);

        return (
            <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                            cx="50%" cy="50%" outerRadius="80%" data={formattedData}
                            onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                        >
                            <PolarGrid />
                            <PolarAngleAxis dataKey="TurbineModel" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Tooltip />
                            <Radar
                                name="Avg Health Score"
                                dataKey="AvgHealthScore"
                                stroke={radarColor}
                                fill={radarColor}
                                fillOpacity={0.6}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'bubble_PlatformHealthScores') {
        const PLATFORM_KEY = 'Platform';
        const PLANT_KEY = 'Plant';
        const HEALTH_SCORE_KEY = 'HealthScore';

        const formattedData = Array.isArray(TurbinePlatformHealthScores) ? TurbinePlatformHealthScores
            .map(item => ({
                [PLATFORM_KEY]: item.Platform || 'Unknown',
                [PLANT_KEY]: item.Plant || 'Unknown',
                [HEALTH_SCORE_KEY]: item.HealthScore || 0,
            }))
            .sort(() => Math.random() - 0.5)
            .slice(0, 10) : [];

        const CustomTooltip = ({ active, payload }) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                    <div className="bg-gray-800 p-2 rounded shadow text-sm border border-gray-600 text-gray-200">
                        <p><strong>Platform:</strong> {data.Platform}</p>
                        <p><strong>Plant:</strong> {data.Plant}</p>
                        <p><strong>Health Score:</strong> {data.HealthScore.toFixed(2)}%</p>
                    </div>
                );
            }
            return null;
        };

        return (
            <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}
                            onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                        >
                            <XAxis
                                type="category"
                                dataKey={PLATFORM_KEY}
                                name="Platform"
                                label={{ value: "Platform", position: 'insideBottom', offset: -5, style: { textAnchor: 'middle' } }}
                            />
                            <YAxis
                                type="category"
                                dataKey={PLANT_KEY}
                                name="Plant"
                                label={{ value: "Plant", angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                            />
                            <ZAxis
                                type="number"
                                dataKey={HEALTH_SCORE_KEY}
                                range={[60, 400]}
                                name="Health Score"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Scatter
                                name="Platform Health"
                                data={formattedData}
                                fill="#00b0ad"
                            />
                            <Legend verticalAlign="top" align="center" layout="horizontal" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'bar_TurbinePlatformScoreSummary') {
        const getColorByScore = (score) => {
            if (score < 50) return 'rgba(255, 99, 132, 0.8)';
            if (score < 70) return 'rgba(255, 159, 64, 0.8)';
            return 'rgba(75, 192, 75, 0.8)';
        };

        const formattedData = Array.isArray(TurbinePlatformScoreSummary) ? TurbinePlatformScoreSummary
            .map(item => ({
                Platform: item.Platform,
                TotalPlatformScore: item.TotalPlatformScore || 0,
            }))
            .sort(() => Math.random() - 0.5)
            .slice(0, 10) : [];

        return (
            <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                            onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                        >
                            <XAxis dataKey="Platform" angle={-30} textAnchor="end" interval={0}>
                                <Label
                                    value="Platform"
                                    offset={-5}
                                    position="insideBottom"
                                    style={{ textAnchor: 'middle' }}
                                />
                            </XAxis>
                            <YAxis domain={[0, 100]}>
                                <Label
                                    value="Total Platform Score (%)"
                                    angle={-90}
                                    position="insideLeft"
                                    style={{ textAnchor: 'middle' }}
                                />
                            </YAxis>
                            <Tooltip
                                formatter={(value) => [`${value}%`, 'TotalPlatformScore']}
                                labelFormatter={(label) => `Platform: ${label}`}
                            />
                            <Bar dataKey="TotalPlatformScore">
                                {formattedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={(entry.Platform === selectedItem) ? '#FFD700' : getColorByScore(entry.TotalPlatformScore)}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }
    if (type === 'line_TurbineModelHealthScores') {
        const formattedData = Array.isArray(TurbineModelHealthScores) ? TurbineModelHealthScores
            .map(item => ({
                TurbineModel: item.TurbineModel || 'Unknown',
                HealthScore: item.HealthScore || 0,
            }))
            .sort((a, b) => b.HealthScore - a.HealthScore)
            .slice(0, 10) : [];

        return (
            <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                            onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                        >
                            <XAxis dataKey="TurbineModel" angle={-45} textAnchor="end" interval={0}>
                                <Label value="Turbine Model" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis domain={[0, 100]}>
                                <Label value="Health Score (%)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip />
                            <Legend verticalAlign="top" align="center" layout="horizontal" />
                            <Line
                                type="monotone"
                                dataKey="HealthScore"
                                stroke="#00b0ad"
                                strokeWidth={2}
                                dot={(props) => {
                                    const { cx, cy, payload } = props;
                                    const isSelected = payload.TurbineModel === selectedItem;
                                    return (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={isSelected ? 6 : 3}
                                            fill={isSelected ? '#FFD700' : '#00b0ad'}
                                            stroke="#fff"
                                            strokeWidth={isSelected ? 2 : 1}
                                        />
                                    );
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }


    return null;
};

export default PredictionsChartComponent;

