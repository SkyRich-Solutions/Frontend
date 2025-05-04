import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Pie, Cell, PieChart
} from 'recharts';

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
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryData = await getProcessedCategoryData();
                console.log('Fetched category data in component:', categoryData);
                setMaterialCategoryClassificationsData(categoryData);
            } catch (error) {
                console.error('Error fetching category data:', error);
            }
        };

        fetchData();
    }, []);

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
        setSelectedRows(prevSelected => {
            const alreadySelected = prevSelected.some(selected => selected.Material === item.Material && selected.Plant === item.Plant);
            if (alreadySelected) {
                return prevSelected.filter(selected => !(selected.Material === item.Material && selected.Plant === item.Plant));
            } else {
                return [...prevSelected, item];
            }
        });
    };
    
    const handleMaterialRowCategoryUpdate = async () => {
        if (!selectedCategory || selectedRows.length === 0) {
            alert("Please select a category and at least one material.");
            return;
        }
    
        setLoading(true);
        setSuccessMessage('');
    
        try {
            // 1. Update categories in DB
            await axios.post('http://localhost:4000/api/updateMaterialCategories', {
                selectedCategory,
                rows: selectedRows.map(row => ({ Material: row.Material, Plant: row.Plant }))
            });
    
            // 2. Wait for the human_in_the_loop Python script to finish
            const scriptRes = await axios.post('http://localhost:4000/api/run-python-human-in-the-loop');
    
            console.log("🔁 Python script output:", scriptRes.data.output);
    
            // 3. Refresh frontend data
            const updatedData = await getProcessedCategoryData();
            setMaterialCategoryClassificationsData(updatedData);
    
            // 4. Clear state and show success
            setSelectedRows([]);
            setSelectedCategory(null);
            setEditingUnlocked(false);
            setSuccessMessage('✅ Categories saved and synced successfully!');
    
            // Auto-hide confirmation after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
    
        } catch (err) {
            console.error("Update error:", err);
            alert(err.response?.data?.message || 'Failed to update material categories.');
        } finally {
            setLoading(false);
        }
    };
    
    
    if (type === 'table_MaterialCategoryClassificationsData') {
        return (
            <div className="w-full h-full overflow-y-auto p-4">
                {/* Top buttons */}
                <div className="flex gap-4 mb-4">
                    {['All', 'Unclassified', 'Newly Discovered'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => {
                                setSelectedFilter(filter);
                                setEditingUnlocked(false); // Reset unlocking when changing filter
                                setSelectedRows([]);        // Clear selected rows
                                setSelectedCategory(null);  // 🛠️ Clear selected category too
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
    
                    {/* Unlock editing button */}
                    {(selectedFilter === 'Unclassified' || selectedFilter === 'Newly Discovered') && (
                        <button
                            onClick={() => setEditingUnlocked(true)}
                            disabled={editingUnlocked} // ✅ Disable button if already unlocked
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
    
                {/* Main table */}
                <table className="min-w-full table-auto text-sm text-gray-300">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-4 py-2">Material</th>
                            <th className="px-4 py-2">Plant</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Material Status</th>
                            <th className="px-4 py-2">Serial No Profile</th>
                            <th className="px-4 py-2">Replacement Part</th>
                            <th className="px-4 py-2">Material Category</th>
                            <th className="px-4 py-2">Auto Classified</th>
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
                                }}
                                className={`cursor-pointer ${
                                    selectedRows.some(selected => 
                                        selected.Material === item.Material &&
                                        selected.Plant === item.Plant
                                    )
                                        ? 'bg-blue-800'
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
        return (
            <div className="w-full h-full">
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
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="Unclassified" stroke={COLORS[0]} fillOpacity={1} fill="url(#colorUnclassified)" />
                        <Area type="monotone" dataKey="NewlyDiscovered" stroke={COLORS[1]} fillOpacity={1} fill="url(#colorNewlyDiscovered)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (type === 'donut_UnclassifiedNewlyDiscovered') {
        return (
            <div className="w-full h-full flex flex-col justify-center items-center">
                <h2 className="text-lg text-white mb-4">Material Category Overview</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} label>
                            {donutData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
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
                <div className="w-full h-full p-4 overflow-y-auto space-y-4">
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
                    <div className="grid grid-cols-2 gap-4">
                        {uniqueCategories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedCategory(category)}
                                className={`flex items-center justify-center p-4 rounded-lg font-bold transition ${
                                    selectedCategory === category ? 'ring-4 ring-gray-400' : ''
                                }`}
                                style={{
                                    backgroundColor: COLORS[index % COLORS.length],
                                    minHeight: '4rem',
                                    color: 'white',
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }
    }        
    
    return null;
};


export default CategoryClassificationComponent;
