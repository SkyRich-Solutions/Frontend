

import React from 'react';
import {BarChart, Bar, XAxis, YAxis,Tooltip, ResponsiveContainer,LineChart, Line, Cell, Label } from 'recharts';

import { getPredictionMaterialData } from '../Utils/MaterialDashboardDataHandler';
import { useEffect , useState} from 'react';

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


const MaterialComponentOverviewComponent = ({ type, searchQuery = '', selectedItem, handleClick }) => {
    const [MaterialData, setMaterialData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const materialData = await getPredictionMaterialData();
                setMaterialData(materialData);
            } catch (error) {
                console.error('Error fetching material data:', error);
            }
        };

        fetchData();
    }, []);

    // Normalize search query
    const query = searchQuery.toLowerCase();

    // Apply search filter to material data (search across multiple fields)
    const filteredMaterialData = MaterialData.filter((item) =>
        [item.Material, item.MaterialCategory, item.Plant, item.PlantSpecificMaterialStatus]
            .some(field => field?.toString().toLowerCase().includes(query))
    );

    const CustomDot = ({ cx, cy, payload, dataKey }) => {
        const value = payload[dataKey];
        const highlight = value === selectedItem || payload.plant === selectedItem || payload.material === selectedItem;
        return (
            <circle
                cx={cx}
                cy={cy}
                r={4}
                stroke={highlight ? '#facc15' : '#00b0ad'}
                strokeWidth={2}
                fill={highlight ? '#facc15' : '#00b0ad'}
            />
        );
    };
    

    if (type === 'bar_PlantSpecificMaterialStatus') {

         // Count occurrences of each PlantSpecificMaterialStatus
    const statusCounts = (filteredMaterialData ?? []).reduce((acc, item) => {
        const status = item.PlantSpecificMaterialStatus || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const formattedData = Object.entries(statusCounts).map(([status, statusCount]) => ({
        status,
        statusCount
    }));

    const CustomTooltipBarPlantSpecificMaterialStatus = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                    <p><strong>Status:</strong> {data.status}</p>
                    <p><strong>Count:</strong> {data.statusCount}</p>
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
                        This bar chart shows how many materials are assigned to each plant-specific status category.
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p><strong>Material Status:</strong></p>
                    <p>
                        Each bar represents a status label (e.g., "Available", "Obsolete", "Pending") used to classify materials in different plants.
                    </p>
                    <p className="mt-2"><strong>Count:</strong></p>
                    <p>
                        Indicates the number of materials currently associated with each status.
                    </p>
                    </div>
                </div>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                            <XAxis dataKey='status'>
                                <Label value="Material Status" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Material Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip content={<CustomTooltipBarPlantSpecificMaterialStatus />} /> 
                            <Bar
                            dataKey='statusCount'
                            isAnimationActive={false}
                            onClick={(data, index) => handleClick(data.status)} 
                            >
                                {formattedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            selectedItem === entry.status
                                                ? 'rgba(0, 200, 255, 0.9)' // Highlight color
                                                : COLORS[index % COLORS.length]
                                        }
                                        stroke={selectedItem === entry.status ? '#00f0ff' : 'none'}
                                        strokeWidth={selectedItem === entry.status ? 2 : 0}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'bar_MaterialByPlant') {
        const plantCounts = (filteredMaterialData ?? []).reduce((acc, item) => {
            const plant = item.Plant || 'Unknown';
            acc[plant] = (acc[plant] || 0) + 1;
            return acc;
        }, {});

        const formattedData = Object.entries(plantCounts)
            .map(([plant, count]) => ({ plant, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);

            const CustomTooltipBarMaterialByPlant = ({ active, payload }) => {
                if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                        <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                            <p><strong>Plant Name:</strong> {data.plant}</p>
                            <p><strong>Material Count:</strong> {data.count}</p>
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
                        This bar chart displays the distribution of materials across different plants.
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p><strong>Plant Name:</strong></p>
                    <p>
                        Each bar corresponds to a specific plant location where materials are managed or stored.
                    </p>
                    <p className="mt-2"><strong>Material Count:</strong></p>
                    <p>
                        Represents the number of materials associated with that particular plant.
                    </p>
                    </div>
                </div>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                            <XAxis dataKey='plant'>
                                <Label value="Plant Name" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Material Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip content={<CustomTooltipBarMaterialByPlant />} />      
                            <Bar
                                dataKey='count'
                                isAnimationActive={false}
                                onClick={(data, index) => handleClick(data.plant)}
                                >
                                    {formattedData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                selectedItem === entry.plant
                                                    ? 'rgba(0, 200, 255, 0.9)' // highlight color
                                                    : COLORS[index % COLORS.length]
                                            }
                                            stroke={selectedItem === entry.plant ? '#00f0ff' : 'none'}
                                            strokeWidth={selectedItem === entry.plant ? 2 : 0}
                                        />
                                    ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'bar_MaterialCount') {
        const materialCounts = (filteredMaterialData ?? []).reduce((acc, item) => {
            const material = item.Material?.toString() || 'Unknown';
            acc[material] = (acc[material] || 0) + 1;
            return acc;
        }, {});

        const formattedData = Object.entries(materialCounts)
            .map(([material, count]) => ({ material, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);

            const CustomTooltipBarMaterialCount = ({ active, payload }) => {
                if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                        <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                            <p><strong>Material:</strong> {data.material}</p>
                            <p><strong>Material Count:</strong> {data.count}</p>
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
                        This bar chart displays the frequency of each material based on how often it appears in the dataset.
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p><strong>Material ID:</strong></p>
                    <p>
                        Each bar represents a specific material identifier found in the records.
                    </p>
                    <p className="mt-2"><strong>Material Count:</strong></p>
                    <p>
                        Indicates how many times that material appears across all entries. Useful for identifying commonly used or duplicated materials.
                    </p>
                    </div>
                </div>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                            <XAxis dataKey='material'>
                                <Label value="Material ID" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Value Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip content={<CustomTooltipBarMaterialCount />} /> 
                            <Bar
                                dataKey='count'
                                isAnimationActive={false}
                                onClick={(data, index) => handleClick(data.material)} 
                                >
                                    {formattedData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                selectedItem === entry.material
                                                    ? 'rgba(0, 200, 255, 0.9)' // Highlight color
                                                    : COLORS[index % COLORS.length]
                                            }
                                            stroke={selectedItem === entry.material ? '#00f0ff' : 'none'}
                                            strokeWidth={selectedItem === entry.material ? 2 : 0}
                                        />
                                    ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'line_MaterialCategoryCount') {
        const grouped = {};
    
        if (Array.isArray(filteredMaterialData)) {
            filteredMaterialData.forEach(item => {
                const category = item.MaterialCategory || 'Unclassified';
                const material = item.Material?.toString() || 'Unknown';
    
                if (!grouped[material]) {
                    grouped[material] = { material, total: 0 };
                }
                grouped[material][category] = (grouped[material][category] || 0) + 1;
                grouped[material].total += 1;
            });
        }
    
        const sortedMaterials = Object.values(grouped)
            .sort((a, b) => b.total - a.total)
            .slice(0, 15);
    
        const formattedData = sortedMaterials.map(({ total, ...rest }) => rest);
    
        const uniqueCategories = new Set();
        filteredMaterialData.forEach(item => {
            uniqueCategories.add(item.MaterialCategory || 'Unclassified');
        });
    
        const categoriesArray = Array.from(uniqueCategories).filter(category =>
            formattedData.some(row => typeof row[category] === 'number' && row[category] > 0)
        );
    
        const CustomTooltipLineMaterialCategoryCount = ({ active, payload, label }) => {
            if (active && payload && payload.length) {
                const { name: category, value } = payload[0];
                return (
                    <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                        <p><strong>Material:</strong> {label}</p>
                        <p><strong>Category:</strong> {category}</p>
                        <p><strong>Count:</strong> {value}</p>
                    </div>
                );
            }
            return null;
        };
    
        const CustomDot = ({ cx, cy, payload, value }) => {
            if (typeof value !== 'number' || isNaN(value)) return null;
        
            return (
                <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    stroke={selectedItem === payload.material ? '#facc15' : '#00b0ad'}
                    strokeWidth={2}
                    fill={selectedItem === payload.material ? '#facc15' : '#00b0ad'}
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
                        <p>This line chart shows how each material is distributed across different material categories.</p>
                        <hr className="my-2 border-gray-300" />
                        <p><strong>Material ID:</strong></p>
                        <p>Each point along the x-axis represents a specific material identifier.</p>
                        <p className="mt-2"><strong>Category Count:</strong></p>
                        <p>The y-axis shows how many times the material appears under each category. Multiple category lines let you compare category distribution across top materials.</p>
                    </div>
                </div>
    
                <div className="flex justify-center items-center w-full h-full">
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                            onClick={(e) => {
                                if (e?.activeLabel) {
                                    handleClick(e.activeLabel);
                                }
                            }}
                        >
                            <XAxis dataKey='material'>
                                <Label value="Material" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Material Category Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip content={<CustomTooltipLineMaterialCategoryCount />} />
                            {categoriesArray.map((category, index) => (
                                <Line
                                key={category}
                                type="monotone"
                                dataKey={category}
                                stroke={
                                    selectedItem &&
                                    formattedData.some(row => row.material === selectedItem && row[category])
                                    ? 'rgba(0, 255, 255, 0.9)'
                                    : COLORS[index % COLORS.length]
                                }
                                strokeWidth={
                                    selectedItem &&
                                    formattedData.some(row => row.material === selectedItem && row[category])
                                    ? 3
                                    : 2
                                }
                                dot={
                                    selectedItem &&
                                    formattedData.some(row => row.material === selectedItem && row[category])
                                    ? <CustomDot />
                                    : false
                                }
                                connectNulls={true}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }    
    

    if (type === 'line_TopMaterialByReplacementParts') {
        const materialCounts = (filteredMaterialData ?? []).reduce((acc, item) => {
            if (item.ReplacementPart === 'B') {
                const material = item.Material?.toString() || 'Unknown';
                acc[material] = (acc[material] || 0) + 1;
            }
            return acc;
        }, {});
    
        const formattedData = Object.entries(materialCounts)
            .map(([material, count]) => ({ material, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);
    
        const CustomTooltipLineTopMaterialByReplacementParts = ({ active, payload, label }) => {
            if (active && payload && payload.length) {
                const { value } = payload[0];
                return (
                    <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                        <p><strong>Material:</strong> {label}</p>
                        <p><strong>Replacement Count:</strong> {value}</p>
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
                            This line chart highlights the top 15 materials that are most frequently marked as replacement parts.
                        </p>
                        <hr className="my-2 border-gray-300" />
                        <p><strong>Material:</strong></p>
                        <p>
                            Each point on the x-axis represents a specific material identifier that has been flagged for replacement.
                        </p>
                        <p className="mt-2"><strong>Replacement Count:</strong></p>
                        <p>
                            The y-axis shows how many times each material has been labeled as a replacement part (ReplacementPart = "B").
                        </p>
                    </div>
                </div>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                            onClick={(e) => {
                                if (e && e.activeLabel) {
                                    handleClick(e.activeLabel); // Select material
                                }
                            }}
                        >
                            <XAxis dataKey='material'>
                                <Label value="Material" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Replacement Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip content={<CustomTooltipLineTopMaterialByReplacementParts />} />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke={
                                    selectedItem && formattedData.some(row => row.material === selectedItem)
                                        ? 'rgba(0, 255, 255, 0.9)'
                                        : COLORS[0]
                                }
                                strokeWidth={
                                    selectedItem && formattedData.some(row => row.material === selectedItem)
                                        ? 3
                                        : 2
                                }
                                dot={(props) => <CustomDot {...props} dataKey="material" />}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }
    
    if (type === 'line_ReplacementPartsByPlant') {
        const grouped = {};
    
        if (Array.isArray(filteredMaterialData)) {
            filteredMaterialData.forEach(item => {
                if (item.ReplacementPart === 'B') {
                    const plant = item.Plant || 'Unknown';
                    if (!grouped[plant]) {
                        grouped[plant] = { plant, count: 0 };
                    }
                    grouped[plant].count += 1;
                }
            });
        }
    
        const formattedData = Object.values(grouped)
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);
    
        const CustomTooltipLineReplacementPartsByPlant = ({ active, payload, label }) => {
            if (active && payload && payload.length) {
                const { value } = payload[0];
                return (
                    <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                        <p><strong>Plant:</strong> {label}</p>
                        <p><strong>Replacement Count:</strong> {value}</p>
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
                            This line chart displays the top 15 plants based on how frequently they report materials as replacement parts.
                        </p>
                        <hr className="my-2 border-gray-300" />
                        <p><strong>Plant:</strong></p>
                        <p>
                            Each point on the x-axis represents a specific plant location.
                        </p>
                        <p className="mt-2"><strong>Replacement Count:</strong></p>
                        <p>
                            The y-axis indicates how many materials have been labeled as replacement parts (ReplacementPart = "B") at each plant.
                        </p>
                    </div>
                </div>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                            onClick={(e) => {
                                if (e && e.activeLabel) {
                                    handleClick(e.activeLabel); // Select plant
                                }
                            }}
                        >
                            <XAxis dataKey='plant'>
                                <Label
                                    value="Plant"
                                    offset={-5}
                                    position="insideBottom"
                                    style={{ textAnchor: 'middle' }}
                                />
                            </XAxis>
                            <YAxis>
                                <Label
                                    value="Replacement Parts Count (B)"
                                    angle={-90}
                                    position="insideLeft"
                                    style={{ textAnchor: 'middle' }}
                                />
                            </YAxis>
                            <Tooltip content={<CustomTooltipLineReplacementPartsByPlant />} />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke={
                                    selectedItem && formattedData.some(d => d.plant === selectedItem)
                                        ? 'rgba(0, 255, 255, 0.9)'
                                        : COLORS[1]
                                }
                                strokeWidth={
                                    selectedItem && formattedData.some(d => d.plant === selectedItem)
                                        ? 3
                                        : 2
                                }
                                dot={(props) => <CustomDot {...props} dataKey="plant" />}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }
    
    
    return null;
};

export default MaterialComponentOverviewComponent;

