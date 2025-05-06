import React from 'react';
import { BarChart, PieChart, Pie, Bar, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, Cell, Label } from 'recharts';
import { ArrowLeft, ArrowRight, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';


import {getMaterialPredictions, getReplacementPredictions, getReplacementPredictionGlobal, getMaterialStatusTransitions, getMonteCarloDominance } from '../Utils/MaterialDashboardDataHandler';


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

const materialStatusMap = {
    Z0: "Blocked/to be deleted",
    Z1: "Ready to be engineered",
    Z2: "Ready to be Enriched",
    Z3: "Ready to be Planned",
    Z4: "Ready to be sold/purchased",
    Z5: "Ready to be sold/returned",
    Z6: "Internal Movement & Repairs",
    Z7: "Obsolete Stock Scrapping",
    Z8: "Inactive and Hibernated",
    Z9: "Ready for final deletion",
    ZI: "Ready for internal use",
    ZS: "Structure Material"
};

//-------------------------------------------------MaterialPredictions--------------------------------------------------//
const MaterialComponentPredictionsComponent = ({ type, searchQuery, selectedItem, onItemClick }) => {

    const [ReplacementPredictions, setReplacementPredictions] = useState([]);
    const [ReplacementPredictionGlobal, setReplacementPredictionGlobal] = useState([]);
    const [MaterialStatusTransitions, setMaterialStatusTransitions] = useState([]);
    const [MonteCarloDominance, setMonteCarloDominance] = useState([]);
    const [MaterialPredictions, setMaterialPredictions] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {

                const ReplacementPredictionsData = await getReplacementPredictions();
                const ReplacementPredictionGlobalData = await getReplacementPredictionGlobal();
                const MaterialStatusTransitionsData = await getMaterialStatusTransitions();
                const MonteCarloDominanceData = await getMonteCarloDominance();
                const MaterialPredictionsData = await getMaterialPredictions();


                setReplacementPredictions(ReplacementPredictionsData);
                setReplacementPredictionGlobal(ReplacementPredictionGlobalData);
                setMaterialStatusTransitions(MaterialStatusTransitionsData);
                setMonteCarloDominance(MonteCarloDominanceData);
                setMaterialPredictions(MaterialPredictionsData);

            } catch (error) {
                console.error('Error fetching material data:', error);
            }
        };
        fetchData();
    }, []);

            // Normalize search query
    const query = searchQuery.toLowerCase();

    // Example fields to search for each dataset — adjust based on actual data
    
    const filteredReplacementPredictions = ReplacementPredictions.filter(item =>
        [item.Material_Description, item.BayesianProbability].some(field =>
        field?.toString().toLowerCase().includes(query)
        )
    );
    
    const filteredReplacementPredictionGlobal = ReplacementPredictionGlobal.filter(item =>
        [item.MaterialCategory, item.MonteCarloProbability, item.BayesianProbability  ].some(field =>
        field?.toString().toLowerCase().includes(query)
        )
    );
    
    const filteredMaterialPredictions = MaterialPredictions.filter(item =>
        [item.Material_ID, item.Material_A9B_Number, item.MaterialCategory, item.Material_Description, item.Is_Batch_Managed, item.Future_Replacement_Probability, item.TotalReplacementCount, item.TotalUsageCount].some(field =>
        field?.toString().toLowerCase().includes(query)
        )
    );
    
    const filteredMaterialStatusTransitions = MaterialStatusTransitions.filter(item =>
        [item.PlantSpecificMaterialStatus, item.Description, item.Material, item.PrevStatus, item.Plant, item.TransitionCount, item.Direction].some(field =>
        field?.toString().toLowerCase().includes(query)
        )
    );
    
    const filteredMonteCarloDominance = MonteCarloDominance.filter(item =>
        [item.Description, item.DominanceCount, item.Percentage].some(field =>
        field?.toString().toLowerCase().includes(query)
        )
    );


    //Shared click handler for all charts
    const handleClick = (data) => {
        if (data && onItemClick) {
            const key = data.materialDescription || data.material || data.materialCategory;
            onItemClick(key);
        }
    };


if (type === 'bar_ReplacementPrediction') {
    const formattedData = filteredReplacementPredictions
        .map(item => ({
            materialDescription: item.Material_Description || 'Unknown',
            bayesianProbability: item.BayesianProbability || 0
        }))
        .sort((a, b) => b.bayesianProbability - a.bayesianProbability)
        .slice(0, 10);

        const CustomTooltipBar_ReplacementPrediction = ({ active, payload }) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                    <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                        <p><strong>Material Description:</strong> {data.materialDescription}</p>
                        <p><strong>Bayesian %:</strong> {data.bayesianProbability.toFixed(2)}%</p>
                    </div>
                );
            }
            return null;
        };

    return (
        <div className="w-full h-full relative">
                {/* Info Icon Tooltip */}
                <div className="absolute top-2 right-2 group cursor-pointer z-10">
                <span className="text-gray-500">ℹ️</span>
                <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">

                    <p><strong>Chart Info:</strong></p>
                    <p>
                    This chart shows the top 10 materials most likely to be replaced, based on Bayesian probabilities ranging from 0 to 1.
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p><strong>What is Bayesian Probability?</strong></p>
                    <p>
                    It's a statistical method that updates the probability of an event as more evidence becomes available. In this case, it estimates the likelihood of a material needing replacement based on past data.
                    </p>
                </div>
                </div>
            <div className='flex justify-center items-center w-full h-full'>
                <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }} onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}>
                        <XAxis dataKey='materialDescription'>
                            <Label value="Material Description" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                        </XAxis>
                        <YAxis domain={[0, 1]}>
                            <Label value="Probability (%)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />    
                        </YAxis>
                        <Tooltip content={<CustomTooltipBar_ReplacementPrediction />} />
                        <Bar dataKey='bayesianProbability'>
                            {formattedData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.materialDescription === selectedItem ? '#00ffff' : COLORS[index % COLORS.length]} // Highlight selected
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

    if (type === 'line_GlobalMonteCarloVsBayesian') {
        const categoryData = {};

        filteredReplacementPredictionGlobal.forEach(item => {
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

        const CustomTooltipLine_GlobalMonteCarloVsBayesian = ({ active, payload }) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                    <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                        <p><strong>Category:</strong> {data.materialCategory}</p>
                        <p><strong>Monte Carlo %:</strong> {data.monteCarlo.toFixed(2)}%</p>
                        <p><strong>Bayesian %:</strong> {data.bayesian.toFixed(2)}%</p>
                    </div>
                );
            }
            return null;
        };

        const CustomDot = ({ cx, cy, payload }) => {
            if (typeof cx !== 'number' || typeof cy !== 'number') return null;
        
            const isSelected = selectedItem === payload.materialCategory;
        
            return (
                <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 4 : 2}
                    stroke={isSelected ? '#00ffff' : '#444'}
                    strokeWidth={isSelected ? 3 : 1}
                    fill={isSelected ? '#00ffff' : '#00b0ad'}
                    style={isSelected ? { filter: 'drop-shadow(0 0 6px #00ffff)' } : {}}
                />
            );
        };
        
        const handleClick = (payload) => {
            if (!payload?.materialCategory) return;
            onItemClick(prev => (prev === payload.materialCategory ? null : payload.materialCategory));
        };

        return (
            <div className="w-full h-full relative">
                    {/* Info Icon Tooltip */}
                    <div className="absolute top-2 right-2 group cursor-pointer z-10">
                    <span className="text-gray-500">ℹ️</span>
                    <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">

                        <p><strong>Chart Info:</strong></p>
                        <p>
                            This chart shows the **average** Monte Carlo and Bayesian replacement probabilities for each material category, aggregated across all turbines.
                        </p>
                        <hr className="my-2 border-gray-300" />
                        <p><strong>Monte Carlo Probability:</strong></p>
                        <p>
                            Simulates many random scenarios to estimate the likelihood of replacement based on uncertainty and variation in the data.
                        </p>
                        <p className="mt-2"><strong>Bayesian Probability:</strong></p>
                        <p>
                            Updates the probability of replacement using historical data, adapting as new evidence is introduced.
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
                            <XAxis dataKey="materialCategory" angle={-30} textAnchor="end" interval={0}>
                                <Label value="Material Category" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Probability (%)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip content={<CustomTooltipLine_GlobalMonteCarloVsBayesian />} />
                            <Legend verticalAlign="top" align="center" layout="horizontal" />
                            <Line
                                type="monotone"
                                dataKey="monteCarlo"
                                name="Monte Carlo Probability"
                                stroke="#00b0ad"
                                strokeWidth={2}
                                onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                                dot={<CustomDot />}
                            />
                            <Line
                                type="monotone"
                                dataKey="bayesian"
                                name="Bayesian Probability"
                                stroke="#ff7f0e"
                                strokeWidth={2}
                                onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                                dot={<CustomDot />}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'line_MonteCarloVsBayesian') {
        const topMaterials = filteredReplacementPredictions
            .sort((a, b) => b.MonteCarloProbability - a.MonteCarloProbability)
            .slice(0, 10);

        const formattedData = topMaterials.map(item => ({
            material: item.Material_Description,
            monteCarlo: item.MonteCarloProbability * 100,
            bayesian: item.BayesianProbability * 100,
        }));

        const CustomTooltipLine_MonteCarloVsBayesian = ({ active, payload }) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                    <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                        <p><strong>Material:</strong> {data.material}</p>
                        <p><strong>Monte Carlo %:</strong> {data.monteCarlo.toFixed(2)}%</p>
                        <p><strong>Bayesian %:</strong> {data.bayesian.toFixed(2)}%</p>
                    </div>
                );
            }
            return null;
        };

        const CustomDot = ({ cx, cy, payload }) => {
            if (typeof cx !== 'number' || typeof cy !== 'number') return null;
        
            const isSelected = selectedItem === payload.material;
        
            return (
                <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 4 : 2}
                    stroke={isSelected ? '#00ffff' : '#444'}
                    strokeWidth={isSelected ? 3 : 1}
                    fill={isSelected ? '#00ffff' : '#00b0ad'}
                    style={isSelected ? { filter: 'drop-shadow(0 0 6px #00ffff)' } : {}}
                />
            );
        };
        
        const handleClick = (payload) => {
            if (!payload?.material) return;
            onItemClick(prev => (prev === payload.material ? null : payload.material));
        };
        return (
            <div className="w-full h-full relative">
                    {/* Info Icon Tooltip */}
                    <div className="absolute top-2 right-2 group cursor-pointer z-10">
                    <span className="text-gray-500">ℹ️</span>
                    <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">

                        <p><strong>Chart Info:</strong></p>
                        <p>
                            This chart compares Monte Carlo and Bayesian replacement probabilities for the top 10 materials with the highest replacement likelihood.
                        </p>
                        <hr className="my-2 border-gray-300" />
                        <p><strong>Monte Carlo Probability:</strong></p>
                        <p>
                            Simulates many random outcomes to estimate the likelihood of a material being replaced based on historical uncertainty and variation.
                        </p>
                        <p className="mt-2"><strong>Bayesian Probability:</strong></p>
                        <p>
                            Calculates the probability based on prior replacement data, updating the belief as more evidence becomes available.
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
                            <XAxis dataKey="material" angle={-45} textAnchor="end" interval={0}>
                                <Label value="Material Description" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Probability (%)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip content={<CustomTooltipLine_MonteCarloVsBayesian />} />
                            <Legend verticalAlign="top" align="center" layout="horizontal" />
                            <Line
                                type="monotone"
                                dataKey="monteCarlo"
                                name="Monte Carlo Probability"
                                stroke="#00b0ad"
                                strokeWidth={2}
                                onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                                dot={<CustomDot />}
                            />
                            <Line
                                type="monotone"
                                dataKey="bayesian"
                                name="Bayesian Probability"
                                stroke="#ff7f0e"
                                strokeWidth={2}
                                onClick={({ activePayload }) => handleClick(activePayload?.[0]?.payload)}
                                dot={<CustomDot />}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'pie_MaterialStatusTransitions') {
        const statusCounts = filteredMaterialStatusTransitions.reduce((acc, item) => {
            const status = item.PlantSpecificMaterialStatus || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
    
        const pieData = Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count,
        }));
    
        const RADIAN = Math.PI / 180;
        const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index, status }) => {
            const radius = outerRadius + 30;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
            return (
                <text
                    x={x}
                    y={y}
                    fill="#cccccc"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize="12"
                >
                    {`${status} (${(percent * 100).toFixed(0)}%)`}
                </text>
            );
        };
    
        const CustomTooltipPie_MaterialStatusTransitions = ({ active, payload }) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload;
                const statusLabel = materialStatusMap[data.status] || data.status;
                return (
                    <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                        <p><strong>Status:</strong> {statusLabel}</p>
                        <p><strong>Count:</strong> {data.count}</p>
                    </div>
                );
            }
            return null;
        };
        return (
            <div className="w-full h-full relative">
                {/* Info Icon Tooltip */}
                <div className="absolute top-2 right-2 group cursor-pointer z-10">
                    <span className="text-gray-500">ℹ️</span>
                    <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                        <p><strong>Chart Info:</strong></p>
                        <p>This pie chart visualizes how often materials transition into different plant-specific status categories.</p>
                        <hr className="my-2 border-gray-300" />
                        <p><strong>Status:</strong> Each slice represents a status like "Available", "Obsolete", or "Newly Discovered".</p>
                        <p className="mt-2"><strong>Count:</strong> Indicates how many materials are labeled with that status.</p>
                    </div>
                </div>
    
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="count"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            innerRadius="40%"
                            outerRadius="70%"
                            labelLine={true}
                            label={renderCustomizedLabel}
                            onClick={handleClick}
                        >
                            {pieData.map((entry, index) => {
                                const isSelected = selectedItem === entry.status;
                                const fillColor = isSelected ? '#00ffff' : COLORS[index % COLORS.length];
                                const opacity = selectedItem && !isSelected ? 0.3 : 1;
                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={fillColor}
                                        stroke={isSelected ? '#00ffff' : '#444'}
                                        strokeWidth={isSelected ? 2 : 0}
                                        opacity={opacity}
                                        style={isSelected ? { filter: 'drop-shadow(0 0 6px #00ffff)' } : {}}
                                    />
                                );
                            })}
                        </Pie>
                        <Tooltip content={<CustomTooltipPie_MaterialStatusTransitions />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }





    if (type === 'bubble_MonteCarloDominance') {
        const DESCRIPTION_KEY = 'description';
        const DOMINANCE_COUNT_KEY = 'dominanceCount';
        const PERCENTAGE_KEY = 'percentage';
    
        const topDominantMaterials = filteredMonteCarloDominance
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
                    <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                        <p><strong>Description:</strong> {data.description}</p>
                        <p><strong>Dominance %:</strong> {data.percentage.toFixed(2)}%</p>
                    </div>
                );
            }
            return null;
        };
    
        const CustomShape = ({ cx, cy, size, payload, index }) => {
            if (typeof cx !== 'number' || typeof cy !== 'number' || typeof size !== 'number') return null;
        
            const isSelected = selectedItem && payload.description === selectedItem;
            const radius = Math.sqrt(size);
            const fill = isSelected ? '#00ffff' : COLORS[index % COLORS.length];
            const opacity = selectedItem && !isSelected ? 0.2 : 1;
        
            return (
                <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? radius + 1 : radius}
                    fill={fill}
                    stroke={isSelected ? '#00ffff' : '#444'}
                    strokeWidth={isSelected ? 2 : 0}
                    opacity={opacity}
                    style={{
                        cursor: 'pointer',
                        filter: isSelected ? 'drop-shadow(0 0 6px #00ffff)' : 'none',
                        pointerEvents: 'auto'
                    }}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent chart-level clicks
                        handleClick(payload); // <-- This MUST set selectedItem state
                    }}
                />
            );
        };
        
    
        return (
            <div className="w-full h-full relative">
                {/* Info Icon */}
                <div className="absolute top-2 right-2 group cursor-pointer z-10">
                    <span className="text-gray-500">ℹ️</span>
                    <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                        <p><strong>Chart Info:</strong></p>
                        <p>This bubble chart displays the top 20 materials that most frequently dominate others in Monte Carlo simulations.</p>
                        <hr className="my-2 border-gray-300" />
                        <p><strong>Dominance Count:</strong> Number of times this material dominated others.</p>
                        <p className="mt-2"><strong>Dominance %:</strong> Proportion of simulations where it outperformed others.</p>
                    </div>
                </div>
    
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                            margin={{ top: 20, right: 30, bottom: 30, left: 20 }}
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
                            <Legend verticalAlign="top" align="center" layout="horizontal" />
                            <Scatter
                                    name="Top Dominant Materials"
                                    data={topDominantMaterials}
                                    shape={(props) => {
                                        const index = topDominantMaterials.findIndex(
                                            item => item.description === props.payload.description
                                        );
                                        return <CustomShape {...props} index={index} />;
                                    }}
                                />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }
 

    
    
        if (type === 'table_MaterialStatusTransitions') {
            return (
                <div className="w-full h-full relative">
                    {/* Info Icon Tooltip */}
                    <div className="absolute top-2 right-1 group cursor-pointer z-10">
                        <span className="text-gray-500">ℹ️</span>
                        <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                            <p><strong>Table Info:</strong></p>
                            <p>This table shows how individual materials have transitioned between statuses across different plants.</p>
                            <hr className="my-2 border-gray-300" />
                            <p><strong>Prev & Current Status:</strong></p>
                            <p>Indicates the change in status, such as from "Obsolete" to "Available".</p>
                            <p className="mt-2"><strong>Direction:</strong></p>
                            <p>Arrows reflect the direction of the transition.</p>
                        </div>
                    </div>
        
                    <table className="min-w-full table-auto text-sm text-gray-300">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-2 py-2 text-left w-20">Material</th>
                                <th className="px-2 py-2 text-left w-48">Description</th>
                                <th className="px-2 py-2 text-left w-28">Prev Status</th>
                                <th className="px-2 py-2 text-left w-24">Plant</th>
                                <th className="px-2 py-2 text-left w-32">Current Status</th>
                                <th className="px-2 py-2 text-left w-24">Transitions</th>
                                <th className="px-2 py-2 text-left w-24">Direction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMaterialStatusTransitions.map((item, index) => {
                                const isSelected = selectedItem &&
                                    (selectedItem === item.Description ||
                                    selectedItem === item.Material ||
                                    selectedItem === item.PlantSpecificMaterialStatus);
        
                                return (
                                    <tr
                                        key={index}
                                        className={`cursor-pointer ${isSelected ? 'bg-cyan-700 text-white' : index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`}
                                        onClick={() => onItemClick(isSelected ? null : (item.Description || item.Material || item.PlantSpecificMaterialStatus))}
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
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            );
        }
        
    
        if (type === 'table_MaterialPredictions') {
            return (
                <div className="w-full h-full relative">
                    {/* Info Icon Tooltip */}
                    <div className="absolute top-2 right-1 group cursor-pointer z-10">
                        <span className="text-gray-500">ℹ️</span>
                        <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                            <p><strong>Table Info:</strong></p>
                            <p>This table displays predictions and usage metrics for individual materials.</p>
                            <hr className="my-2 border-gray-300" />
                            <p><strong>Future Replacement Probability:</strong></p>
                            <p>The estimated likelihood that this material will need replacement.</p>
                        </div>
                    </div>
        
                    <table className="min-w-full table-auto text-sm text-gray-300">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-2 py-2 text-left w-24">A9B Number</th>
                                <th className="px-2 py-2 text-left w-48">Description</th>
                                <th className="px-2 py-2 text-left w-32">Category</th>
                                <th className="px-2 py-2 text-left w-40">Replacement Probability</th>
                                <th className="px-2 py-2 text-left w-24">Replacements</th>
                                <th className="px-2 py-2 text-left w-20">Usage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMaterialPredictions.map((item, index) => {
                                const isSelected = selectedItem &&
                                    (selectedItem === item.Material_Description ||
                                    selectedItem === item.Material_A9B_Number ||
                                    selectedItem === item.MaterialCategory);
        
                                return (
                                    <tr
                                        key={index}
                                        className={`cursor-pointer ${isSelected ? 'bg-cyan-700 text-white' : index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`}
                                        onClick={() => onItemClick(isSelected ? null : (item.Material_Description || item.Material_A9B_Number || item.MaterialCategory))}
                                    >
                                        <td className="px-4 py-2">{item.Material_A9B_Number}</td>
                                        <td className="px-4 py-2">{item.Material_Description}</td>
                                        <td className="px-4 py-2">{item.MaterialCategory}</td>
                                        <td className="px-4 py-2">{(item.Future_Replacement_Probability * 100).toFixed(2)}%</td>
                                        <td className="px-4 py-2">{item.TotalReplacementCount}</td>
                                        <td className="px-4 py-2">{item.TotalUsageCount}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            );
        }

        return null;
    };        

    export default MaterialComponentPredictionsComponent;