// import React from 'react';
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     Tooltip,
//     ResponsiveContainer,
//     Legend,
//     LineChart,
//     Line
// } from 'recharts';
// import TurbineData from '../MockData/TurbineData.json';

// const ChartComponent = ({ type }) => {
//     // Ensure that the JSON data has the correct format
//     const formattedData = TurbineData.map((turbine) => ({
//         model: turbine.TurbineModel,
//         nominal_power: parseFloat(
//             turbine.NominalPower.replace(' KW', '').replace(',', '.')
//         )
//     }));

//     if (type === 'bar') {
//         return (
//             <div className='w-full h-full p-4  shadow-md rounded-lg overflow-hidden'>
//                 <div className='flex justify-center items-center w-full h-full'>
//                     <ResponsiveContainer width='100%' height='100%'>
//                         <BarChart
//                             data={formattedData}
//                             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                         >
//                             <XAxis dataKey='model' />
//                             <YAxis />
//                             <Tooltip />
//                             <Bar dataKey='nominal_power' fill='#00b0ad' />
//                             <Legend />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>
//         );
//     }

//     if (type === 'line') {
//         return (
//             <div className='w-full h-full p-4 shadow-md rounded-lg overflow-hidden'>
//                 <div className='flex justify-center items-center w-full h-full'>
//                     <ResponsiveContainer width='100%' height='100%'>
//                         <LineChart
//                             data={formattedData}
//                             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                         >
//                             <XAxis dataKey='model' />
//                             <YAxis />
//                             <Tooltip />
//                             <Line
//                                 type='monotone'
//                                 dataKey='nominal_power'
//                                 stroke='#00b0ad'
//                                 // stroke='#5a4673'
//                             />
//                             <Legend />
//                         </LineChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>
//         );
//     }

//     return null;
// };

// export default ChartComponent;

import React from 'react';
import {Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, PieChart, Pie, Bar, ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, Cell, Label } from 'recharts';
import MaterialData from '../MockData/MaterialData.json';
import TurbineData from '../MockData/TurbineData.json';

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

const ChartComponent = ({ type }) => {
    // Count occurrences of each PlantSpecificMaterialStatus
    const statusCounts = MaterialData.reduce((acc, item) => {
        const status = item.PlantSpecificMaterialStatus || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const formattedData = Object.entries(statusCounts).map(([status, statusCount]) => ({
        status,
        statusCount
    }));

    if (type === 'bar_PlantSpecificMaterialStatus') {
        return (
            <div className='w-full h-full flex flex-col justify-between'>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                            <XAxis dataKey='status'>
                                <Label value="Material Status" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Material Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip />
                            <Bar dataKey='statusCount'>
                                {formattedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'bar_MaterialByPlant') {
        const plantCounts = MaterialData.reduce((acc, item) => {
            const plant = item.Plant || 'Unknown';
            acc[plant] = (acc[plant] || 0) + 1;
            return acc;
        }, {});

        const formattedData = Object.entries(plantCounts)
            .map(([plant, count]) => ({ plant, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);

        return (
            <div className='w-full h-full flex flex-col justify-between'>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                            <XAxis dataKey='plant'>
                                <Label value="Plant Name" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Material Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip />
                            <Bar dataKey='count'>
                                {formattedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'bar_MaterialCount') {
        const materialCounts = MaterialData.reduce((acc, item) => {
            const material = item.Material?.toString() || 'Unknown';
            acc[material] = (acc[material] || 0) + 1;
            return acc;
        }, {});

        const formattedData = Object.entries(materialCounts)
            .map(([material, count]) => ({ material, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);

        return (
            <div className='w-full h-full flex flex-col justify-between'>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                            <XAxis dataKey='material'>
                                <Label value="Material ID" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Value Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip />
                            <Bar dataKey='count'>
                                {formattedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'line') {
        return (
            <div className='w-full h-full flex flex-col justify-between'>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                            <XAxis dataKey='status'>
                                <Label value="Material Status" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Material Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip />
                            <Line
                                type='monotone'
                                dataKey='statusCount'
                                stroke='#00b0ad'
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'line_MaterialCategoryCount') {
        const grouped = {};

        MaterialData.forEach(item => {
            const category = item.MaterialCategory || 'Unclassified';
            const material = item.Material?.toString() || 'Unknown';

            if (!grouped[material]) {
                grouped[material] = { material, total: 0 };
            }
            grouped[material][category] = (grouped[material][category] || 0) + 1;
            grouped[material].total += 1;
        });

        const sortedMaterials = Object.values(grouped)
            .sort((a, b) => b.total - a.total)
            .slice(0, 15);

        const formattedData = sortedMaterials.map(({ total, ...rest }) => rest);

        const uniqueCategories = new Set();
        MaterialData.forEach(item => {
            uniqueCategories.add(item.MaterialCategory || 'Unclassified');
        });
        const categoriesArray = Array.from(uniqueCategories);

        return (
            <div className='w-full h-full flex flex-col justify-between'>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                            <XAxis dataKey='material'>
                                <Label value="Material" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Material Category Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip />
                            {categoriesArray.map((category, index) => (
                                <Line
                                    key={category}
                                    type="monotone"
                                    dataKey={category}
                                    stroke={COLORS[index % COLORS.length]}
                                    strokeWidth={2}
                                    dot={{ r: 2 }}
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
        const materialCounts = MaterialData.reduce((acc, item) => {
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
    
        return (
            <div className='w-full h-full flex flex-col justify-between'>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                            <XAxis dataKey='material'>
                                <Label value="Material" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Replacement Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke={COLORS[0]}
                                strokeWidth={2}
                                dot={{ r: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (type === 'line_ReplacementPartsByPlant') {
        const grouped = {};
    
        MaterialData.forEach(item => {
            const plant = item.Plant || 'Unknown';
            const replacementPart = item.ReplacementPart || 'None';
    
            if (!grouped[plant]) {
                grouped[plant] = { plant, total: 0 };
            }
            grouped[plant][replacementPart] = (grouped[plant][replacementPart] || 0) + 1;
            grouped[plant].total += 1;
        });
    
        const sortedPlants = Object.values(grouped)
            .sort((a, b) => b.total - a.total)
            .slice(0, 15);
    
        const formattedData = sortedPlants.map(({ total, ...rest }) => rest);
    
        const uniqueReplacementParts = new Set();
        MaterialData.forEach(item => {
            uniqueReplacementParts.add(item.ReplacementPart || 'None');
        });
        const replacementPartsArray = Array.from(uniqueReplacementParts);
    
        return (
            <div className='w-full h-full flex flex-col justify-between'>
                <div className='flex justify-center items-center w-full h-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                            <XAxis dataKey='plant'>
                                <Label value="Plant" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                            </XAxis>
                            <YAxis>
                                <Label value="Replacement Parts Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip />
                            {replacementPartsArray.map((replacementPart, index) => (
                                <Line
                                    key={replacementPart}
                                    type="monotone"
                                    dataKey={replacementPart}
                                    stroke={COLORS[index % COLORS.length]}
                                    strokeWidth={2}
                                    dot={{ r: 2 }}
                                    connectNulls
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }
    
 //--------------------------------------------------------Tubine Dashboard------------------------------------------------
 
 if (type === 'bar_FunctionalLocByRegion') {
    // Count FunctionalLocs by Region
    const regionCounts = TurbineData.reduce((acc, item) => {
        const region = item.Region || 'Unknown';
        acc[region] = (acc[region] || 0) + 1;
        return acc;
    }, {});

    // Format and sort to get top 15 regions
    const formattedData = Object.entries(regionCounts)
        .map(([region, regionCount]) => ({ region, regionCount }))
        .sort((a, b) => b.regionCount - a.regionCount)
        .slice(0, 15); // <-- Top 15 only

    return (
        <div className='w-full h-full flex flex-col justify-between'>
            <div className='flex justify-center items-center w-full h-full'>
                <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                        <XAxis dataKey='region'>
                            <Label
                                value="Region"
                                offset={-5}
                                position="insideBottom"
                                style={{ textAnchor: 'middle' }}
                            />
                        </XAxis>
                        <YAxis>
                            <Label
                                value="Turbine Count"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: 'middle' }}
                            />
                        </YAxis>
                        <Tooltip />
                        <Bar dataKey='regionCount'>
                            {formattedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

if (type === 'donut_TurbineCountByManufacturer') {
    // Count turbines by OriginalEqManufact
    const manufacturerCounts = TurbineData.reduce((acc, item) => {
        const manufacturer = item.OriginalEqManufact || 'Unknown';
        acc[manufacturer] = (acc[manufacturer] || 0) + 1;
        return acc;
    }, {});

    const formattedData = Object.entries(manufacturerCounts)
        .map(([manufacturer, count]) => ({ manufacturer, count }))
        .sort((a, b) => b.count - a.count) // Optional: largest first
        .slice(0, 15); // Top 15 manufacturers

    return (
        <div className='w-full h-full flex flex-col justify-between'>
            <div className='flex justify-center items-center w-full h-full'>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={formattedData}
                            dataKey="count"
                            nameKey="manufacturer"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={50} // This makes it a donut instead of full pie
                            paddingAngle={5}
                        >
                            {formattedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

if (type === 'scatter_TurbinePowerVsHubHeight') {
    // Preprocess: extract and clean Power and HubHeight
    const scatterData = TurbineData.map(item => {
        const nominalPowerStr = item.NominalPower || '';
        const hubHeightStr = item.HubHeight || '';

        // Try parsing power (e.g., "2.625 KW") and hub height (e.g., "80,00 m")
        const nominalPower = parseFloat(nominalPowerStr.replace(' KW', '').replace(',', '.'));
        const hubHeight = parseFloat(hubHeightStr.replace(' m', '').replace(',', '.'));

        return {
            turbine: item.FunctionalLoc || 'Unknown',
            nominalPower,
            hubHeight
        };
    }).filter(item => !isNaN(item.nominalPower) && !isNaN(item.hubHeight)); // Filter valid entries

    // Sort by nominalPower (or any metric you prefer) and pick top 15
    const topScatterData = scatterData
        .sort((a, b) => b.nominalPower - a.nominalPower)
        .slice(0, 15);

    return (
        <div className='w-full h-full flex flex-col justify-between'>
            <div className='flex justify-center items-center w-full h-full'>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                    >
                        <CartesianGrid />
                        <XAxis type="number" dataKey="nominalPower" name="Nominal Power (KW)">
                            <Label
                                value="Nominal Power (KW)"
                                offset={-5}
                                position="insideBottom"
                                style={{ textAnchor: 'middle' }}
                            />
                        </XAxis>
                        <YAxis type="number" dataKey="hubHeight" name="Hub Height (m)">
                            <Label
                                value="Hub Height (m)"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: 'middle' }}
                            />
                        </YAxis>
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter
                            name="Turbines"
                            data={topScatterData}
                            fill="#00b0ad"
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

if (type === 'bubble_TurbinePowerByRegion') {
    // Step 1: Group by Region
    const regionAggregation = TurbineData.reduce((acc, item) => {
        const region = item.Region || 'Unknown';
        const nominalPowerStr = item.NominalPower || '';
        const nominalPower = parseFloat(nominalPowerStr.replace(' KW', '').replace(',', '.'));

        if (!isNaN(nominalPower)) {
            if (!acc[region]) {
                acc[region] = { region, totalPower: 0, count: 0 };
            }
            acc[region].totalPower += nominalPower;
            acc[region].count += 1;
        }

        return acc;
    }, {});

    // Step 2: Prepare final data
    const formattedData = Object.values(regionAggregation).map(regionData => ({
        region: regionData.region,
        averagePower: regionData.totalPower / regionData.count,
        count: regionData.count,
    }));

    // Optional: take top 15 regions by count
    const topFormattedData = formattedData
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

    return (
        <div className='w-full h-full flex flex-col justify-between'>
            <div className='flex justify-center items-center w-full h-full'>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                        <CartesianGrid />
                        <XAxis
                            type="category"
                            dataKey="region"
                            name="Region"
                            interval={0} // Show all labels
                            angle={-15}
                            textAnchor="end"
                        >
                            <Label value="Region" offset={-10} position="insideBottom" style={{ textAnchor: 'middle' }} />
                        </XAxis>
                        <YAxis
                            type="number"
                            dataKey="averagePower"
                            name="Average Nominal Power (KW)"
                        >
                            <Label value="Avg Nominal Power (KW)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                        </YAxis>
                        <ZAxis
                            type="number"
                            dataKey="count"
                            range={[100, 500]} // Controls bubble size (you can tweak)
                            name="Turbine Count"
                        />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter
                            name="Turbines by Region"
                            data={topFormattedData}
                            fill={COLORS[0]}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

if (type === 'radar_MaintPlant_PlanningPlant_ByPlatform') {
    const platformGroups = {};

    TurbineData.forEach(item => {
        const platform = item.Platform || 'Unknown';
        const maintPlant = item.MaintPlant || 'Unknown';
        const planningPlant = item.PlanningPlant || 'Unknown';

        if (!platformGroups[platform]) {
            platformGroups[platform] = { platform, MaintPlantCount: 0, PlanningPlantCount: 0 };
        }

        if (maintPlant) platformGroups[platform].MaintPlantCount += 1;
        if (planningPlant) platformGroups[platform].PlanningPlantCount += 1;
    });

    const formattedData = Object.values(platformGroups)
        .sort((a, b) => b.MaintPlantCount - a.MaintPlantCount)
        .slice(0, 15); // Top 15

    return (
        <div className="w-full h-full flex flex-col justify-between">
            <div className="flex justify-center items-center w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="platform" />
                        <PolarRadiusAxis />
                        <Tooltip />
                        <Legend />
                        <Radar name="MaintPlant" dataKey="MaintPlantCount" stroke="#00b0ad" fill="#00b0ad" fillOpacity={0.6} />
                        <Radar name="PlanningPlant" dataKey="PlanningPlantCount" stroke="#ff7f0e" fill="#ff7f0e" fillOpacity={0.6} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

if (type === 'line_CumulativeTurbineCount_ByPlatform') {
    // Step 1: Group turbine counts by Platform
    const platformCounts = TurbineData.reduce((acc, item) => {
        const platform = item.Platform || 'Unknown';
        acc[platform] = (acc[platform] || 0) + 1;
        return acc;
    }, {});

    // Step 2: Sort platforms alphabetically or by count (choose)
    const sortedPlatforms = Object.entries(platformCounts)
        .sort((a, b) => a[0].localeCompare(b[0])); // Sort alphabetically

    // Step 3: Create cumulative count
    let cumulativeSum = 0;
    const formattedData = sortedPlatforms.map(([platform, count]) => {
        cumulativeSum += count;
        return { platform, cumulativeCount: cumulativeSum };
    });

    return (
        <div className="w-full h-full flex flex-col justify-between">
            <div className="flex justify-center items-center w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="platform">
                            <Label value="Platform" offset={-5} position="insideBottom" style={{ textAnchor: 'middle' }} />
                        </XAxis>
                        <YAxis>
                            <Label value="Cumulative Turbine Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                        </YAxis>
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="cumulativeCount"
                            stroke="#00b0ad"
                            strokeWidth={3}
                            dot={{ r: 2 }}
                            connectNulls={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
    
    return null;
};

export default ChartComponent;

