import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from '../Components/Layout/Header';
import TurbineComponentHealthScoresComponent from '../Components/TurbineComponentHealthScoresComponent';
import Fuse from 'fuse.js';
import { getTurbineModelHealthScores, getTurbineModelScoreSummary, getTurbinePlatformHealthScores, getTurbinePlatformScoreSummary } from '../Utils/TurbineDashboardDataHandler';

const TurbinePredictionsDashboard = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [TurbineModelHealthScores, setTurbineModelHealthScores] = useState([]);
    const [TurbineModelScoreSummary, setTurbineModelScoreSummary] = useState([]);
    const [TurbinePlatformHealthScores, setTurbinePlatformHealthScores] = useState([]);
    const [TurbinePlatformScoreSummary, setTurbinePlatformScoreSummary] = useState([]);

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
                setTurbineModelHealthScores(await getTurbineModelHealthScores());
                setTurbineModelScoreSummary(await getTurbineModelScoreSummary());
                setTurbinePlatformHealthScores(await getTurbinePlatformHealthScores());
                setTurbinePlatformScoreSummary(await getTurbinePlatformScoreSummary());

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

        
        extractTerms(TurbineModelHealthScores, ['TurbineModel', 'HealthScore']);
        extractTerms(TurbineModelScoreSummary, ['TurbineModel', 'TotalModelScore']);
        extractTerms(TurbinePlatformHealthScores, ['Platform', 'Plant', 'HealthScore']);
        extractTerms(TurbinePlatformScoreSummary, ['Platform', 'TotalPlatformScore']);


        return [...termSet];
    }, [
        TurbineModelHealthScores,
        TurbineModelScoreSummary,
        TurbinePlatformHealthScores,
        TurbinePlatformScoreSummary
    ]);

    const fuse = useMemo(() => new Fuse(allTerms, { includeScore: true, threshold: 0.4 }), [allTerms]);

    const suggestions = searchQuery
        ? fuse.search(searchQuery).map(res => res.item).slice(0, 5)
        : [];
    return (
        <div className="flex flex-col h-screen w-screen bg-gray-950 pb-4 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 bg-gray-900 bg-opacity-90 z-10 relative">
                <Header title="Turbine Model Health Scores" />
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

            <div className='grid grid-cols-3 gap-6 p-4'>
                {/* Top row with three different charts */}
                {[0, 1, 2].map((index) => (
                    <div
                        key={index}
                        className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-[20rem] flex items-center justify-center rounded-lg'
                    >
                        <TurbineComponentHealthScoresComponent
                            type={
                                index === 0
                                    ? 'bar_TurbineModelHealthScores'
                                    : index === 1
                                    ? 'line_TurbineModelHealthScores'
                                    : 'bar_TurbineModelScoreSummary'
                            }
                            selectedItem={selectedItem}
                            handleClick={handleItemClick}
                            searchQuery={searchQuery}
                        />
                    </div>
                ))}

                {/* Middle-left two different charts */}
                <div className='flex flex-col gap-6 col-span-1'>
                    {[3, 4].map((index) => (
                        <div
                            key={index}
                            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-[18rem] flex items-center justify-center rounded-lg'
                        >
                            <TurbineComponentHealthScoresComponent
                                type={index === 3
                                    ? 'bubble_PlatformHealthScores'
                                    : 'bar_TurbinePlatformScoreSummary'
                                }
                                selectedItem={selectedItem}
                                handleClick={handleItemClick}
                                searchQuery={searchQuery}
                            />
                        </div>
                    ))}
                </div>

                {/* Large square chart on the right */}
                <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 flex items-center justify-center rounded-lg col-span-2 row-span-2 h-[38rem]'>
                    <TurbineComponentHealthScoresComponent
                        type='radar_TurbineModelHealthScores_ByPlant'
                        selectedItem={selectedItem}
                        handleClick={handleItemClick}
                        searchQuery={searchQuery}
                    />
                </div>
            </div>
        </div>
    );
};

export default TurbinePredictionsDashboard;
