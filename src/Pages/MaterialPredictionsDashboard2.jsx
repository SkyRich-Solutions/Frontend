import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from '../Components/Layout/Header';
import PredictionsChartComponent from '../Components/PredictionsChartComponent';
import Fuse from 'fuse.js';

import {
    getMaterialComponentScoreSummary,
    getMaterialCategoryHealthScores,
    getMaterialCategoryPredictions,
    getMaterialComponentHealthScores,
    getMaterialCategoryScoreSummary,
    getMaintenanceForecasts
} from '../Utils/MaterialDashboardDataHandler';

const MaterialPredictionsDashboard2 = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [MaterialComponentScoreSummary, setMaterialComponentScoreSummary] = useState([]);
    const [MaterialComponentHealthScores, setMaterialComponentHealthScores] = useState([]);
    const [MaterialCategoryScoreSummary, setMaterialCategoryScoreSummary] = useState([]);
    const [MaterialCategoryHealthScores, setMaterialCategoryHealthScores] = useState([]);
    const [MaterialCategoryPredictions, setMaterialCategoryPredictions] = useState([]);
    const [MaintenanceForecasts, setMaintenanceForecasts] = useState([]);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const searchWrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setMaterialComponentScoreSummary(await getMaterialComponentScoreSummary());
                setMaterialComponentHealthScores(await getMaterialComponentHealthScores());
                setMaterialCategoryScoreSummary(await getMaterialCategoryScoreSummary());
                setMaterialCategoryHealthScores(await getMaterialCategoryHealthScores());
                setMaterialCategoryPredictions(await getMaterialCategoryPredictions());
                setMaintenanceForecasts(await getMaintenanceForecasts());
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const allTerms = useMemo(() => {
        const termSet = new Set();
        const extractTerms = (data, keys) => {
            data.forEach(item => {
                keys.forEach(key => {
                    if (item[key]) termSet.add(String(item[key]));
                });
            });
        };

        extractTerms(MaterialComponentScoreSummary, ['Material_ID', 'TotalComponentScore']);
        extractTerms(MaterialComponentHealthScores, ['Material_ID', 'HealthScore']);
        extractTerms(MaterialCategoryScoreSummary, ['Material_ID', 'TotalCategoryScore']);
        extractTerms(MaterialCategoryHealthScores, ['Material_ID', 'HealthScore']);
        extractTerms(MaterialCategoryPredictions, ['Category', 'BayesianProbability', 'MonteCarloEstimate']);
        extractTerms(MaintenanceForecasts, ['Forecast_ID', 'Material_ID', 'Plant_ID', 'LastMaintenance', 'AverageIntervalDays', 'NextEstimatedMaintenanceDate']);

        return [...termSet];
    }, [
        MaterialComponentScoreSummary,
        MaterialComponentHealthScores,
        MaterialCategoryScoreSummary,
        MaterialCategoryHealthScores,
        MaterialCategoryPredictions,
        MaintenanceForecasts,
    ]);

    const fuse = useMemo(() => new Fuse(allTerms, { includeScore: true, threshold: 0.4 }), [allTerms]);

    const suggestions = searchQuery
        ? fuse.search(searchQuery).map(res => res.item).slice(0, 5)
        : [];

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-950 pb-4 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-900 bg-opacity-90 z-10 relative">
                <Header title="Material Component Health Scores" />
                <div className="relative w-1/2 max-w-md" ref={searchWrapperRef}>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Material..."
                            className="w-full bg-gray-800 text-white px-4 py-2 pr-10 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setShowSuggestions(false);
                                }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/10 px-2 py-0.5 rounded text-gray-300 hover:text-white hover:bg-white/20 transition"
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-50 bg-gray-900 text-white w-full mt-1 rounded-md shadow-lg border border-gray-700 max-h-40 overflow-auto">
                            {suggestions.map((item, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                    onClick={() => {
                                        setSearchQuery(item);
                                        setShowSuggestions(false);
                                    }}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-3 gap-6 h-full p-4">
                    {/* Top row charts */}
                    {[0, 1, 2].map((index) => (
                        <div
                            key={index}
                            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex items-center justify-center rounded-lg h-full min-h-[18rem]"
                        >
                            <PredictionsChartComponent
                                type={
                                    index === 0
                                        ? 'bar_MaterialComponentScoreSummary'
                                        : index === 1
                                            ? 'bar_MaterialComponentHealthScores'
                                            : 'bar_MaterialCategoryScoreSummary'
                                }
                                selectedItem={selectedItem}
                                handleClick={handleItemClick}
                                searchQuery={searchQuery}
                            />
                        </div>
                    ))}

                    {/* Two stacked charts */}
                    <div className="flex flex-col gap-6 col-span-1 h-full">
                        {[3, 4].map((index) => (
                            <div
                                key={index}
                                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-[19rem] flex items-center justify-center rounded-lg"
                            >
                                <PredictionsChartComponent
                                    type={
                                        index === 3
                                            ? 'bar_MaterialCategoryHealthScores'
                                            : 'line_MaterialCategoryPredictions'
                                    }
                                    selectedItem={selectedItem}
                                    handleClick={handleItemClick}
                                    searchQuery={searchQuery}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Large Forecast Table */}
                    <div className="col-span-2 row-span-2 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 h-[38rem] rounded-lg h-full overflow-auto">
                        <div className="min-w-full">
                            <PredictionsChartComponent
                                type="table_MaintenanceForecasts"
                                selectedItem={selectedItem}
                                handleClick={handleItemClick}
                                searchQuery={searchQuery}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialPredictionsDashboard2;
