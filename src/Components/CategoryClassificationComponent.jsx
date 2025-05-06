import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Pie, Cell, PieChart
} from 'recharts';

import CategorySelectionLegend from './CategorySelectionLegend';

export const getProcessedCategoryData = async () => {
    try {
        const response = await axios.get('http://localhost:4000/api/fetch_ProcessedMaterialData');
        console.log('Processed Category Data:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching processed category data:', error);
        throw error;
    }
};

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


const CategoryClassificationComponent = ({
    type,
    refreshKey,
    setRefreshKey,
    editingUnlocked,
    setEditingUnlocked,
    selectedRows,
    setSelectedRows,
    selectedCategory,
    setSelectedCategory,
    searchQuery
}) => {
    const [MaterialCategoryClassificationsData, setMaterialCategoryClassificationsData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isReclassifying, setIsReclassifying] = useState(false);
    const [selectedRowCategoryMap, setSelectedRowCategoryMap] = useState({});


    

    const fetchData = async () => {
        try {
            const categoryData = await getProcessedCategoryData();
            console.log('Fetched category data in component:', categoryData);
            setMaterialCategoryClassificationsData(categoryData);
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [refreshKey]);;

     // Normalize search query
    const query = searchQuery.toLowerCase();

    // Apply search filter to material data (search across multiple fields)
    const filteredMaterialCategoryClassificationsData = MaterialCategoryClassificationsData.filter((item) =>
        [item.Material, item.MaterialCategory, item.Plant, item.PlantSpecificMaterialStatus]
            .some(field => field?.toString().toLowerCase().includes(query))
    );

    const filteredData = useMemo(() => {
        if (selectedFilter === 'All') return filteredMaterialCategoryClassificationsData;
        return filteredMaterialCategoryClassificationsData.filter(
            item => item.MaterialCategory === selectedFilter
        );
    }, [filteredMaterialCategoryClassificationsData, selectedFilter]);

    const cumulativeData = useMemo(() => {
        let unclassifiedCount = 0;
        let newlyDiscoveredCount = 0;
        return filteredMaterialCategoryClassificationsData.map((item, index) => {
            if (item.MaterialCategory === 'Unclassified') unclassifiedCount++;
            if (item.MaterialCategory === 'Newly Discovered') newlyDiscoveredCount++;
            return { index: index + 1, Unclassified: unclassifiedCount, NewlyDiscovered: newlyDiscoveredCount };
        });
    }, [filteredMaterialCategoryClassificationsData]);

    const donutData = useMemo(() => {
        let unclassified = 0, newlyDiscovered = 0;
        filteredMaterialCategoryClassificationsData.forEach(item => {
            if (item.MaterialCategory === 'Unclassified') unclassified++;
            else if (item.MaterialCategory === 'Newly Discovered') newlyDiscovered++;
        });
        const others = filteredMaterialCategoryClassificationsData.length - unclassified - newlyDiscovered;
        return [
            { name: 'Unclassified', value: unclassified },
            { name: 'Newly Discovered', value: newlyDiscovered },
            { name: 'Others', value: others }
        ];
    }, [filteredMaterialCategoryClassificationsData]);

    const unclassifiedCount = useMemo(() =>
        filteredMaterialCategoryClassificationsData.filter(item => item.MaterialCategory === 'Unclassified').length
    , [filteredMaterialCategoryClassificationsData]);

    const newlyDiscoveredCount = useMemo(() =>
        filteredMaterialCategoryClassificationsData.filter(item => item.MaterialCategory === 'Newly Discovered').length
    , [filteredMaterialCategoryClassificationsData]);

    const uniqueCategories = useMemo(() => {
        const set = new Set();
        filteredMaterialCategoryClassificationsData.forEach(item => {
            const category = item.MaterialCategory || 'Unknown';
            set.add(category);
        });
        return Array.from(set);
    }, [filteredMaterialCategoryClassificationsData]);

    const toggleRowSelection = (item) => {
        const key = `${item.Material}-${item.Plant}`;
        setSelectedRows(prevSelected => {
            const alreadySelected = prevSelected.some(
                selected => selected.Material === item.Material && selected.Plant === item.Plant
            );
            if (alreadySelected) {
                const newSelected = prevSelected.filter(
                    selected => !(selected.Material === item.Material && selected.Plant === item.Plant)
                );
                const updatedMap = { ...selectedRowCategoryMap };
                delete updatedMap[key];
                setSelectedRowCategoryMap(updatedMap);
                return newSelected;
            } else {
                setSelectedRowCategoryMap(prev => ({
                    ...prev,
                    [key]: selectedCategory
                }));
                return [...prevSelected, item];
            }
        });
    };
    
    const handleMaterialRowCategoryUpdate = async () => {
        if (!selectedCategory || selectedRows.length === 0) {
            alert("Please select a category and at least one material.");
            return;
        }
    
        const payload = {
            selectedCategory,
            rows: selectedRows.map(row => ({
                Material: row.Material,
                Plant: row.Plant
            }))
        };
    
        console.log("Payload being sent to backend:", payload);
    
        setLoading(true);
        setSuccessMessage('');
    
        try {
            await axios.post('http://localhost:4000/api/updateMaterialCategories', payload);
    
            await axios.post('http://localhost:4000/api/run-python-human-in-the-loop');
    
            setSelectedRows([]);
            setSelectedCategory(null);
            setEditingUnlocked(false);
            setSuccessMessage('Categories saved and synced successfully!');
    
            setTimeout(() => {
                setSuccessMessage('');
                setRefreshKey(prev => prev + 1);
            }, 3000);
        } catch (err) {
            console.error("Update error:", err);
            alert(err.response?.data?.message || 'Failed to update material categories.');
        } finally {
            setLoading(false);
        }
    };
    

    const handleReclassification = async () => {
        setIsReclassifying(true);
        try {
            await axios.post('http://localhost:4000/api/run-python-human-in-the-loop');
            setRefreshKey(prev => prev + 1); // or any refresh trigger you use
        } catch (err) {
            console.error("Reclassification failed:", err);
            alert("Failed to re-run classification.");
        } finally {
            setIsReclassifying(false);
        }
    };
    
    if (type === 'table_MaterialCategoryClassificationsData') {
        return (
            <div className="w-full h-full overflow-y-auto p-4 relative">
                {/* Info Icon Tooltip */}
                <div className="absolute top-2 right-2 group cursor-pointer z-10">
                    <span className="text-gray-500">ℹ️</span>
                    <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                        <p><strong>Table Info:</strong></p>
                        <p>
                            This table displays a classification overview of all materials across plants, showing their category, status, and other metadata.
                        </p>
                        <hr className="my-2 border-gray-300" />
                        <p><strong>Unclassified / Newly Discovered:</strong></p>
                        <p>
                            Filter options to help users reassign or validate categories for materials that lack classification or have been flagged by the system.
                        </p>
                        <p className="mt-2"><strong>Unlock Editing:</strong></p>
                        <p>
                            Allows you to select rows for category assignment. Selected rows turn blue for visibility.
                        </p>
                    </div>
                </div>
    
                {/* Top buttons */}
                <div className="flex gap-4 mr-10 mb-4 justify-between items-center">
                    <div className="flex gap-4">
                        {['All', 'Unclassified', 'Newly Discovered'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => {
                                    setSelectedFilter(filter);
                                    setEditingUnlocked(false);
                                    setSelectedRows([]);
                                    setSelectedCategory(null);
                                }}
                                className={`px-4 py-2 rounded ${
                                    selectedFilter === filter 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                        {(selectedFilter === 'Unclassified' || selectedFilter === 'Newly Discovered') && (
                            <button
                                onClick={() => setEditingUnlocked(true)}
                                disabled={editingUnlocked}
                                className={`px-4 py-2 rounded ${
                                    editingUnlocked
                                        ? 'bg-green-600 text-white'
                                        : 'bg-yellow-500 text-black hover:bg-yellow-600'
                                }`}
                            >
                                {editingUnlocked ? 'Editing Unlocked' : 'Unlock Editing'}
                            </button>
                        )}
                    </div>

                    {/* Right-aligned reclassification button */}
                    {(selectedFilter === 'Unclassified' || selectedFilter === 'Newly Discovered') && (
                        <button
                            onClick={async () => {
                                setIsReclassifying(true);
                                setSuccessMessage('');
                                try {
                                    await axios.post('http://localhost:4000/api/run-python-human-in-the-loop');
                                    setSuccessMessage('Reclassification triggered successfully!');
                                    setTimeout(() => {
                                        setSuccessMessage('');
                                        setRefreshKey(prev => prev + 1);
                                    }, 3000);
                                } catch (err) {
                                    console.error('Reclassification error:', err);
                                    alert(err.response?.data?.message || 'Failed to trigger reclassification.');
                                } finally {
                                    setIsReclassifying(false);
                                }
                            }}
                            disabled={isReclassifying}
                            className={`px-4 py-2 rounded font-bold text-white flex items-center justify-center gap-2 ${
                                isReclassifying ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                        >
                            {isReclassifying && (
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    />
                                </svg>
                            )}
                            {isReclassifying ? 'Updating...' : 'Re-run Classification'}
                        </button>
                    )}
                </div>
                {/* Main table */}
                <table className="min-w-full table-auto text-sm text-gray-300">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-left">Material</th>
                            <th className="px-4 py-2 text-left">Plant</th>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">Material Status</th>
                            <th className="px-4 py-2 text-left">Serial No Profile</th>
                            <th className="px-4 py-2 text-left">Replacement Part</th>
                            <th className="px-4 py-2 text-left">Material Category</th>
                            <th className="px-4 py-2 text-left">Auto Classified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr
                            key={index}
                            onClick={() => {
                                if (editingUnlocked) {
                                  toggleRowSelection(item);
                                }
                                setSelectedCategory(item.MaterialCategory); // Always update chart selection
                              }}
                            className={`cursor-pointer ${
                                selectedRows.some(selected =>
                                    selected.Material === item.Material &&
                                    selected.Plant === item.Plant
                                )
                                    ? 'bg-blue-800'
                                    : selectedRowCategoryMap[`${item.Material}-${item.Plant}`] === selectedCategory
                                        ? 'bg-[#00ffff]/30'
                                        : (index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900')
                            }`}
                            >
                                <td className="px-4 py-2">{item.Material}</td>
                                <td className="px-4 py-2">{item.Plant}</td>
                                <td className="px-4 py-2">{item.Description}</td>
                                <td className="px-4 py-2">{materialStatusMap[item.PlantSpecificMaterialStatus] || item.PlantSpecificMaterialStatus}</td>
                                <td className="px-4 py-2">{item.Serial_No_Profile}</td>
                                <td className="px-4 py-2">{item.ReplacementPart}</td>
                                <td className="px-4 py-2">{item.MaterialCategory}</td>
                                <td className="px-4 py-2">{item.Auto_Classified}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
    
    if (type === 'Line_chart_UnclassifiedNewlyDiscovered') {

        const CustomTooltipLine_UnclassifiedNewlyDiscovered = ({ active, payload, label }) => {
            if (active && payload && payload.length) {
                const { name: category, value } = payload[0];
                return (
                    <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                        <p><strong>Step:</strong> {label}</p>
                        <p><strong>Category:</strong> {category}</p>
                        <p><strong>Cumulative Count:</strong> {value}</p>
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
                            This area chart tracks the cumulative count of materials that are either unclassified or newly discovered during the classification process.
                        </p>
                        <hr className="my-2 border-gray-300" />
                        <p><strong>Unclassified:</strong></p>
                        <p>
                            Materials that do not have a predefined category and need human intervention or model prediction.
                        </p>
                        <p className="mt-2"><strong>Newly Discovered:</strong></p>
                        <p>
                            Materials that were automatically flagged as belonging to a previously unseen or rare classification.
                        </p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cumulativeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <defs>
                            <linearGradient id="colorUnclassified" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorNewlyDiscovered" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" />
                        <YAxis />
                        <Tooltip content={<CustomTooltipLine_UnclassifiedNewlyDiscovered />} /> 
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="Unclassified"
                            stroke={selectedCategory === 'Unclassified' ? '#00ffff' : COLORS[0]}
                            strokeWidth={selectedCategory  === 'Unclassified' ? 3 : 2}
                            fillOpacity={1}
                            fill="url(#colorUnclassified)"
                            onClick={() => setSelectedCategory('Unclassified')}
                        />
                        <Area
                            type="monotone"
                            dataKey="NewlyDiscovered"
                            stroke={selectedCategory  === 'Newly Discovered' ? '#00ffff' : COLORS[1]}
                            strokeWidth={selectedCategory  === 'Newly Discovered' ? 3 : 2}
                            fillOpacity={1}
                            fill="url(#colorNewlyDiscovered)"
                            onClick={() => setSelectedCategory('Newly Discovered')}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (type === 'donut_UnclassifiedNewlyDiscovered') {

        const CustomTooltipDonut_MaterialCategorySummary = ({ active, payload }) => {
            if (active && payload && payload.length) {
                const { name, value } = payload[0];
                return (
                    <div className="bg-gray-800/80 p-2 rounded shadow text-sm border border-gray-700 text-white">
                        <p><strong>Category:</strong> {name}</p>
                        <p><strong>Count:</strong> {value}</p>
                    </div>
                );
            }
            return null;
        };

        const categoryCounts = (filteredData  ?? []).reduce((acc, item) => {
            const category = item.MaterialCategory || 'Unclassified';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});
        
        const donutData = Object.entries(categoryCounts).map(([name, value]) => ({
            name,
            value
        }));
        
        
        return (
            <div className="w-full h-full relative">
                {/* Info Icon Tooltip */}
                <div className="absolute top-2 right-1 group cursor-pointer z-10">
                    <span className="text-gray-500">ℹ️</span>
                    <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                        <p><strong>Chart Info:</strong></p>
                        <p>
                            This donut chart summarizes the current distribution of material classifications that are either unclassified or newly discovered.
                        </p>
                        <hr className="my-2 border-gray-300" />
                        <p><strong>Unclassified:</strong></p>
                        <p>
                            Materials lacking sufficient information to be categorized. These require manual review or ML-assisted classification.
                        </p>
                        <p className="mt-2"><strong>Newly Discovered:</strong></p>
                        <p>
                            Materials that were automatically detected by the system as belonging to new or previously unknown categories.
                        </p>
                    </div>
                </div>
                <h2 className="text-lg text-white mb-4">Material Category Overview</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                            <Pie
                            data={donutData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            label
                            onClick={(data) => setSelectedCategory(data.name)}
                            >
                            {donutData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke={selectedCategory === entry.name ? '#00ffff' : 'none'}
                                    strokeWidth={selectedCategory === entry.name ? 3 : 1}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltipDonut_MaterialCategorySummary />} /> 
                        <Legend verticalAlign="bottom" height={90} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (type === 'count_Unclassified') {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center text-center">
                <h2 className="text-lg text-gray-300">Unclassified Materials</h2>
                <p className="text-4xl font-bold text-blue-400">{unclassifiedCount}</p>
            </div>
        );
    }

    if (type === 'count_NewlyDiscovered') {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center text-center">
                <h2 className="text-lg text-gray-300">Newly Discovered Materials</h2>
                <p className="text-4xl font-bold text-blue-400">{newlyDiscoveredCount}</p>
            </div>
        );
    }

    if (type === 'table_UniqueMaterialCategories') {
        if (!editingUnlocked) {
            return (
                <div className="w-full h-full flex justify-center items-center text-gray-300">
                    <p>Please unlock editing first.</p>
                </div>
            );
        }
    
        if (selectedRows.length === 0) {
            return (
                <div className="w-full h-full flex justify-center items-center text-gray-300">
                    <p>Please select some materials first.</p>
                </div>
            );
        }
    
        if (type === 'table_UniqueMaterialCategories') {
            return (
                <div className="w-full h-full relative">
                    {/* Info Icon Tooltip */}
                    <div className="absolute top right-1 group cursor-pointer z-10">
                        <span className="text-gray-500">ℹ️</span>
                        <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded shadow text-sm border border-gray-200 w-64 top-6 right-0 h-40 overflow-y-auto">
                            <p><strong>Component Info:</strong></p>
                            <p>
                                This interface allows you to assign or update material categories for unclassified or newly discovered items based on their descriptions.
                            </p>
                            <hr className="my-2 border-gray-300" />
                            <p><strong>Unique Categories:</strong></p>
                            <p>
                                Select a category from the colored buttons below. Once selected, click on table rows to assign the chosen category.
                            </p>
                            <p className="mt-2"><strong>Saving:</strong></p>
                            <p>
                                After making selections, click "Save Category Assignment" to update and sync the changes.
                            </p>
                        </div>
                    </div>
        
                    {/* Loading spinner */}
                    {loading && (
                        <div className="w-full text-center text-yellow-400 font-semibold">
                            Saving and syncing... ⏳
                        </div>
                    )}
        
                    {/* Success confirmation */}
                    {!loading && successMessage && (
                        <div className="w-full text-center text-green-500 font-semibold">
                            {successMessage}
                        </div>
                    )}
        
                    {/* Save button */}
                    {editingUnlocked && selectedRows.length > 0 && selectedCategory && (
                        <button
                            onClick={handleMaterialRowCategoryUpdate}
                            className="w-full px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700"
                        >
                            Save Category Assignment
                        </button>
                    )}
        
                    {/* Category selection buttons */}
                    <div className="flex flex-wrap justify-between gap-4 pt-10">
                        <CategorySelectionLegend
                            uniqueCategories={uniqueCategories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />
                    </div>
                </div>
            );
        }
    }        
    return null;
};


export default CategoryClassificationComponent;
