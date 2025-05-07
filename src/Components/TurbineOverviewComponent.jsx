import React from 'react';
import {Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, PieChart, Pie, Bar, ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, Cell, Label } from 'recharts';

import { getPredictionTurbineData } from '../Utils/TurbineDashboardDataHandler';
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


const TurbineOverviewComponent = ({ type, searchQuery = '', selectedItem, onItemClick }) => {

    const [TurbineData, setTurbineData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const turbineData = await getPredictionTurbineData();
                setTurbineData(turbineData);
            } catch (error) {
                console.error('Error fetching turbine data:', error);
            }
        };

        fetchData();
    }, []);

    // Normalize search query
    const query = searchQuery.toLowerCase();


   // Apply search filter to turbine data (search across multiple fields)
    const filteredTurbineData = TurbineData.filter((item) =>
        [item.FunctionalLoc, item.Region, item.Platform, item.MaintPlant, item.PlanningPlant, item.OriginalEqManufact]
            .some(field => field?.toString().toLowerCase().includes(query))
    );

 if (type === 'bar_FunctionalLocByRegion') {
    const regionCounts = (filteredTurbineData ?? []).reduce((acc, item) => {
        const region = item.Region || 'Unknown';
        acc[region] = (acc[region] || 0) + 1;
        return acc;
    }, {});

    const formattedData = Object.entries(regionCounts)
        .map(([region, regionCount]) => ({ region, regionCount }))
        .sort((a, b) => b.regionCount - a.regionCount)
        .slice(0, 15);

    const CustomTooltipBarFunctionalLocByRegion = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                    <p><strong>Region:</strong> {data.region}</p>
                    <p><strong>Functional Location Count:</strong> {data.regionCount}</p>
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
                        This bar chart shows the number of turbine functional locations grouped by region, highlighting the regions with the highest turbine deployment.
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p><strong>Region:</strong></p>
                    <p>Each bar represents a region where turbines are deployed.</p>
                    <p className="mt-2"><strong>Turbine Count:</strong></p>
                    <p>Indicates how many functional turbine locations are recorded within each region.</p>
                </div>
            </div>
            <div className="flex justify-center items-center w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={formattedData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                        onClick={(e) => {
                            if (e && e.activeLabel) {
                                onItemClick(e.activeLabel);
                            }
                        }}
                    >
                        <XAxis dataKey="region">
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
                        <Tooltip content={<CustomTooltipBarFunctionalLocByRegion />} />
                        <Bar
  dataKey="regionCount"
  isAnimationActive={false}
  onMouseEnter={() => {}}
  onMouseLeave={() => {}}
>
  {formattedData.map((entry, index) => (
    <Cell
    key={`cell-${index}`}
    fill={selectedItem === entry.region ? 'rgba(0, 255, 255, 0.9)' : COLORS[index % COLORS.length]}
    stroke={selectedItem === entry.region ? '#00f0ff' : 'none'}
    strokeWidth={selectedItem === entry.region ? 2 : 0}
    onMouseEnter={(e) => { e.target.style.filter = 'none'; }}
    onMouseLeave={(e) => { e.target.style.filter = 'none'; }}
    style={{
      filter: 'none',
      boxShadow: 'none',
      outline: 'none',
      transition: 'none',
    }}
  />
  ))}
</Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}



if (type === 'scatter_TurbinePowerVsHubHeight') {
    const scatterData = filteredTurbineData.map(item => {
        const nominalPowerStr = item.NominalPower || '';
        const hubHeightStr = item.HubHeight || '';

        const nominalPower = parseFloat(nominalPowerStr.replace(' KW', '').replace(',', '.'));
        const hubHeight = parseFloat(hubHeightStr.replace(' m', '').replace(',', '.'));

        return {
            turbine: item.FunctionalLoc || 'Unknown',
            nominalPower,
            hubHeight
        };
    }).filter(item => !isNaN(item.nominalPower) && !isNaN(item.hubHeight));

    const topScatterData = scatterData
        .sort((a, b) => b.nominalPower - a.nominalPower)
        .slice(0, 15);

    const CustomTooltipScatterTurbinePowerVsHubHeight = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                    <p><strong>Turbine:</strong> {data.turbine}</p>
                    <p><strong>Nominal Power:</strong> {data.nominalPower} kW</p>
                    <p><strong>Hub Height:</strong> {data.hubHeight} m</p>
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
                        This scatter chart visualizes the relationship between nominal power output and hub height for selected turbines.
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p><strong>Nominal Power (kW):</strong></p>
                    <p>
                        Represents the maximum rated power of a turbine under standard conditions.
                    </p>
                    <p className="mt-2"><strong>Hub Height (m):</strong></p>
                    <p>
                        Indicates the vertical distance from the base to the center of the rotor.
                    </p>
                </div>
            </div>
            <div className='flex justify-center items-center w-full h-full'>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                        onClick={(e) => {
                            if (e && e.activePayload?.[0]?.payload?.turbine) {
                                onItemClick(e.activePayload[0].payload.turbine);
                            }
                        }}
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
                        <Tooltip content={<CustomTooltipScatterTurbinePowerVsHubHeight />} />
                        <Scatter name="Turbines" data={topScatterData}>
                            {topScatterData.map((entry, index) => {
                                const isSelected = selectedItem === entry.turbine;
                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={isSelected ? '#00ffff' : '#00b0ad'}
                                        stroke={isSelected ? '#00ffff' : '#333'}
                                        strokeWidth={isSelected ? 2 : 0}
                                        opacity={selectedItem && !isSelected ? 0.3 : 1}
                                        style={{
                                            filter: isSelected ? 'drop-shadow(0 0 6px #00ffff)' : 'none',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => onItemClick(isSelected ? null : entry.turbine)}
                                    />
                                );
                            })}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

if (type === 'donut_TurbineCountByManufacturer') {
    const manufacturerCounts = (filteredTurbineData ?? []).reduce((acc, item) => {
        const manufacturer = item.OriginalEqManufact || 'Unknown';
        acc[manufacturer] = (acc[manufacturer] || 0) + 1;
        return acc;
    }, {});

    const formattedData = Object.entries(manufacturerCounts)
        .map(([manufacturer, count]) => ({ manufacturer, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

    const CustomTooltipDonutTurbineCountByManufacturer = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                    <p><strong>Manufacturer:</strong> {data.manufacturer}</p>
                    <p><strong>Turbine Count:</strong> {data.count}</p>
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
                        This donut chart displays the distribution of turbines by their original equipment manufacturer (OEM), highlighting the most common suppliers in the fleet.
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p><strong>Manufacturer:</strong></p>
                    <p>
                        Each slice represents a specific turbine manufacturer (e.g., Siemens, Vestas, GE).
                    </p>
                    <p className="mt-2"><strong>Turbine Count:</strong></p>
                    <p>
                        The size of each slice corresponds to the number of turbines attributed to that manufacturer.
                    </p>
                </div>
            </div>
            <div className="flex justify-center items-center w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart
                        onClick={(e) => {
                            if (e && e.activeLabel) {
                                onItemClick(e.activeLabel);
                            }
                        }}
                    >
                        <Pie
                            data={formattedData}
                            dataKey="count"
                            nameKey="manufacturer"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={50}
                            paddingAngle={5}
                        >
                            {formattedData.map((entry, index) => {
                                const isSelected = selectedItem === entry.manufacturer;
                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={isSelected ? 'rgba(0, 255, 255, 0.9)' : COLORS[index % COLORS.length]}
                                        stroke={isSelected ? '#00ffff' : '#333'}
                                        strokeWidth={isSelected ? 2 : 0}
                                        opacity={selectedItem && !isSelected ? 0.3 : 1}
                                        style={isSelected ? { filter: 'drop-shadow(0 0 6px #00ffff)' } : {}}
                                        onClick={() => onItemClick(isSelected ? null : entry.manufacturer)}
                                    />
                                );
                            })}
                        </Pie>
                        <Tooltip content={<CustomTooltipDonutTurbineCountByManufacturer />} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

if (type === 'radar_MaintPlant_PlanningPlant_ByPlatform') {
    const platformGroups = {};

    (filteredTurbineData ?? []).forEach(item => {
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
        .slice(0, 15);

    const CustomTooltipRadarMaintPlantPlanningPlantByPlatform = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                    <p><strong>Platform:</strong> {label}</p>
                    {payload.map((entry, index) => (
                        <p key={index}>
                            <strong>{entry.name}:</strong> {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const handleClickRadar = (platform) => {
        onItemClick(prev => (prev === platform ? null : platform));
    };

    return (
        <div className="w-full h-full relative">
            {/* Info Icon Tooltip */}
            <div className="absolute top-2 right-1 group cursor-pointer z-10">
                <span className="text-gray-500">ℹ️</span>
                <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                    <p><strong>Chart Info:</strong></p>
                    <p>
                        This radar chart compares the number of MaintPlant and PlanningPlant assignments across different turbine platforms.
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p><strong>MaintPlant Count:</strong></p>
                    <p>
                        Shows how many turbines of a given platform are assigned to a maintenance plant.
                    </p>
                    <p className="mt-2"><strong>PlanningPlant Count:</strong></p>
                    <p>
                        Indicates how many turbines of the same platform are linked to a planning plant.
                    </p>
                </div>
            </div>

            <div className="flex justify-center items-center w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={formattedData}
                        onClick={(e) => {
                            if (e?.activeLabel) {
                                handleClickRadar(e.activeLabel);
                            }
                        }}
                    >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="platform" />
                        <PolarRadiusAxis />
                        <Tooltip content={<CustomTooltipRadarMaintPlantPlanningPlantByPlatform />} />
                        <Legend />
                        <Radar
                            name="MaintPlant"
                            dataKey="MaintPlantCount"
                            stroke="#00b0ad"
                            fill="#00b0ad"
                            fillOpacity={selectedItem ? 0.2 : 0.6}
                            />
                            <Radar
                            name="PlanningPlant"
                            dataKey="PlanningPlantCount"
                            stroke="#ff7f0e"
                            fill="#ff7f0e"
                            fillOpacity={selectedItem ? 0.2 : 0.6}
                            />
                            <Radar
                            name={`Selected: ${selectedItem}`}
                            dataKey="MaintPlantCount"
                            data={formattedData.filter(d => d.platform === selectedItem)}
                            stroke="#00ffff"
                            fill="#00ffff"
                            fillOpacity={0.9}
                            />
                            <Radar
                            dataKey="PlanningPlantCount"
                            data={formattedData.filter(d => d.platform === selectedItem)}
                            stroke="#facc15"
                            fill="#facc15"
                            fillOpacity={0.9}
                            />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}


if (type === 'line_CumulativeTurbineCount_ByPlatform') {
    const platformCounts = (filteredTurbineData ?? []).reduce((acc, item) => {
        const platform = item.Platform || 'Unknown';
        acc[platform] = (acc[platform] || 0) + 1;
        return acc;
    }, {});

    const sortedPlatforms = Object.entries(platformCounts)
        .sort((a, b) => a[0].localeCompare(b[0]));

    let cumulativeSum = 0;
    const formattedData = sortedPlatforms.map(([platform, count]) => {
        cumulativeSum += count;
        return { platform, cumulativeCount: cumulativeSum };
    });

    const CustomTooltipLineCumulativeTurbineCountByPlatform = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                    <p><strong>Platform:</strong> {label}</p>
                    <p><strong>Cumulative Turbine Count:</strong> {data.cumulativeCount}</p>
                </div>
            );
        }
        return null;
    };

    const CustomDot = ({ cx, cy, payload }) => (
        <circle
            cx={cx}
            cy={cy}
            r={4}
            stroke={payload.platform === selectedItem ? '#facc15' : '#00b0ad'}
            strokeWidth={2}
            fill={payload.platform === selectedItem ? '#facc15' : '#00b0ad'}
        />
    );

    return (
        <div className="w-full h-full relative">
            {/* Info Icon Tooltip */}
            <div className="absolute top-2 right-1 group cursor-pointer z-10">
                <span className="text-gray-500">ℹ️</span>
                <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                    <p><strong>Chart Info:</strong></p>
                    <p>
                        This line chart displays the cumulative count of turbines grouped by platform, helping visualize the growth or distribution trend across different platforms.
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p><strong>Platform:</strong></p>
                    <p>
                        Represents a specific turbine platform (e.g., SWT-3.6, SG-2.1, etc.).
                    </p>
                    <p className="mt-2"><strong>Cumulative Turbine Count:</strong></p>
                    <p>
                        Shows the running total of turbines as platforms are sorted alphabetically. Useful for understanding platform-level contributions to the fleet size.
                    </p>
                </div>
            </div>

            <div className="flex justify-center items-center w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={formattedData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                        onClick={(e) => {
                            if (e?.activeLabel) {
                                onItemClick(e.activeLabel);
                            }
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="platform">
                            <Label
                                value="Platform"
                                offset={-5}
                                position="insideBottom"
                                style={{ textAnchor: 'middle' }}
                            />
                        </XAxis>
                        <YAxis>
                            <Label
                                value="Cumulative Turbine Count"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: 'middle' }}
                            />
                        </YAxis>
                        <Tooltip content={<CustomTooltipLineCumulativeTurbineCountByPlatform />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="cumulativeCount"
                            stroke="#00b0ad"
                            strokeWidth={3}
                            dot={<CustomDot />}
                            connectNulls={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}



if (type === 'bubble_TurbinePowerByRegion') {
    const regionAggregation = (filteredTurbineData ?? []).reduce((acc, item) => {
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

    const formattedData = Object.values(regionAggregation).map(regionData => ({
        region: regionData.region,
        averagePower: regionData.totalPower / regionData.count,
        count: regionData.count,
    }));

    const topFormattedData = formattedData
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

    // Inject color into data points
    const coloredData = topFormattedData.map((entry, index) => ({
        ...entry,
        fill: selectedItem === entry.region ? '#00ffff' : COLORS[index % COLORS.length]
    }));

    const CustomTooltipBubbleTurbinePowerByRegion = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                    <p><strong>Region:</strong> {data.region}</p>
                    <p><strong>Average Nominal Power:</strong> {data.averagePower.toFixed(2)} kW</p>
                    <p><strong>Number of Turbines:</strong> {data.count}</p>
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
                        This bubble chart illustrates turbine distribution and performance across regions by showing average nominal power and turbine count.
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p><strong>Average Nominal Power (kW):</strong></p>
                    <p>
                        Represents the average rated output capacity of turbines in each region.
                    </p>
                    <p className="mt-2"><strong>Bubble Size – Turbine Count:</strong></p>
                    <p>
                        Indicates how many turbines are present in each region. Larger bubbles correspond to regions with more turbines.
                    </p>
                </div>
            </div>

            <div className='flex justify-center items-center w-full h-full'>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        onClick={(e) => {
                            if (e && e.activePayload?.[0]?.payload?.region) {
                                onItemClick(e.activePayload[0].payload.region);
                            }
                        }}
                    >
                        <CartesianGrid />
                        <XAxis
                            type="category"
                            dataKey="region"
                            name="Region"
                            interval={0}
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
                            range={[100, 500]}
                            name="Turbine Count"
                        />
                        <Tooltip content={<CustomTooltipBubbleTurbinePowerByRegion />} />
                        <Scatter name="Turbines by Region" data={coloredData}>
                            {coloredData.map((entry, index) => {
                                const isSelected = selectedItem === entry.region;
                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={isSelected ? '#00ffff' : COLORS[index % COLORS.length]}
                                        stroke={isSelected ? '#00ffff' : '#444'}
                                        strokeWidth={isSelected ? 2 : 0}
                                        opacity={selectedItem && !isSelected ? 0.3 : 1}
                                        style={{
                                            filter: isSelected ? 'drop-shadow(0 0 6px #00ffff)' : 'none',
                                            cursor: 'pointer'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onItemClick(isSelected ? null : entry.region);
                                        }}
                                    />
                                );
                            })}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}


    return null;
};

export default TurbineOverviewComponent;