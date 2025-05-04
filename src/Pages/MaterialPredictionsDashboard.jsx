import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from '../Components/Layout/Header';
import PredictionsChartComponent from '../Components/PredictionsChartComponent';
import Fuse from 'fuse.js';

import {
    getReplacementPredictions,
    getReplacementPredictionGlobal,
    getMaterialPredictions,
    getMaterialStatusTransitions,
    getMonteCarloDominance,
} from '../Utils/MaterialDashboardDataHandler';

const MaterialPredictionsDashboard = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [ReplacementPredictionGlobal, setReplacementPredictionGlobal] = useState([]);
    const [ReplacementPredictions, setReplacementPredictions] = useState([]);
    const [MonteCarloDominance, setMonteCarloDominance] = useState([]);
    const [MaterialStatusTransitions, setMaterialStatusTransitions] = useState([]);
    const [MaterialPredictions, setMaterialPredictions] = useState([]);

    const searchWrapperRef = useRef(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

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
                setReplacementPredictionGlobal(await getReplacementPredictionGlobal());
                setReplacementPredictions(await getReplacementPredictions());
                setMonteCarloDominance(await getMonteCarloDominance());
                setMaterialStatusTransitions(await getMaterialStatusTransitions());
                setMaterialPredictions(await getMaterialPredictions());
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

        
        extractTerms(ReplacementPredictions, ['MonteCarloProbability', 'Material_Description', 'BayesianProbability']);
        extractTerms(ReplacementPredictionGlobal, ['MonteCarloProbability', 'MaterialCategory', 'BayesianProbability']);
        extractTerms(MaterialStatusTransitions, ['Material', 'PlantSpecificMaterialStatus', 'Description', 'PrevStatus', 'Plant', 'TransitionCount', 'Direction']);
        extractTerms(MonteCarloDominance, ['DominanceCount', 'Description', 'Percentage']);
        extractTerms(MaterialPredictions, ['Material_ID', 'Material_A9B_Number', 'MaterialCategory', 'Material_Description', 'TotalReplacementCount', 'Future_Replacement_Probability', 'TotalUsageCount']);
        
        

        return [...termSet];
    }, [
        MaterialPredictions,
        MonteCarloDominance,
        ReplacementPredictions,
        ReplacementPredictionGlobal,
        MaterialStatusTransitions
    ]);

    const fuse = useMemo(() => new Fuse(allTerms, { includeScore: true, threshold: 0.4 }), [allTerms]);

    const suggestions = searchQuery
        ? fuse.search(searchQuery).map(res => res.item).slice(0, 5)
        : [];

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-950 pb-4 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 bg-gray-900 bg-opacity-90 z-10 relative">
                <Header title="Material Component Predictions" />
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

            <div className="grid grid-cols-3 gap-6 p-4">
                {[0, 1, 2].map((index) => (
                    <div
                        key={index}
                        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-[20rem] flex items-center justify-center rounded-lg"
                    >
                        <PredictionsChartComponent
                            type={
                                index === 0
                                    ? 'bar_ReplacementPrediction'
                                    : index === 1
                                    ? 'line_GlobalMonteCarloVsBayesian'
                                    : 'line_MonteCarloVsBayesian'
                            }
                            selectedItem={selectedItem}
                            onItemClick={handleItemClick}
                            searchQuery={searchQuery}
                        />
                    </div>
                ))}

                <div className="flex flex-col gap-6 col-span-1">
                    {[3, 4].map((index) => (
                        <div
                            key={index}
                            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-[18rem] flex items-center justify-center rounded-lg"
                        >
                            <PredictionsChartComponent
                                type={
                                    index === 3
                                        ? 'pie_MaterialStatusTransitions'
                                        : 'bubble_MonteCarloDominance'
                                }
                                selectedItem={selectedItem}
                                onItemClick={handleItemClick}
                                searchQuery={searchQuery}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-6 col-span-2">
                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-[18rem] flex items-center justify-center rounded-lg">
                        <PredictionsChartComponent
                            type="table_MaterialStatusTransitions"
                            selectedItem={selectedItem}
                            onItemClick={handleItemClick}
                            searchQuery={searchQuery}
                        />
                    </div>

                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-[18rem] flex items-center justify-center rounded-lg overflow-auto">
                        <PredictionsChartComponent
                            type="table_MaterialPredictions"
                            selectedItem={selectedItem}
                            onItemClick={handleItemClick}
                            searchQuery={searchQuery}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialPredictionsDashboard;
