import { useState, useMemo, useEffect, useRef } from "react"
import Header from "../Components/Layout/Header"
import MaterialComponentOverviewComponent from "../Components/MaterialComponentOverviewComponent"
import Loader from "../Components/ReUseable/Loader"// Update this path to match your project structure
import Fuse from "fuse.js"
import { getPredictionMaterialData } from "../Utils/MaterialDashboardDataHandler"

const MaterialComponentOverviewDashboard = () => {
    const [selectedItem, setSelectedItem] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [materialData, setMaterialData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const handleItemClick = (item) => {
        setSelectedItem(item)
    }

    const searchWrapperRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const materials = await getPredictionMaterialData()
                setMaterialData(materials)
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    // Combine terms for fuzzy search
    const allTerms = useMemo(() => {
        return [
            ...new Set(
                [
                    ...materialData.flatMap((item) => [
                        item.Material,
                        item.MaterialCategory,
                        item.Plant,
                        item.PlantSpecificMaterialStatus,
                    ]),
                ].filter(Boolean),
            ),
        ]
    }, [materialData])

    // Set up Fuse instance
    const fuse = useMemo(() => new Fuse(allTerms, { includeScore: true, threshold: 0.4 }), [allTerms])

    // Generate suggestions
    const suggestions = searchQuery
        ? fuse
            .search(searchQuery)
            .map((res) => res.item)
            .slice(0, 5)
        : []

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-950 overflow-hidden">
            {/* Header Section - consistent padding */}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-900 bg-opacity-90 z-10">
                <Header title="Material Component Overview" />
                <div className="relative w-full md:w-1/2 max-w-md" ref={searchWrapperRef}>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Material..."
                            className="w-full bg-gray-800 text-white px-4 py-2 pr-10 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setShowSuggestions(true)
                            }}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery("")
                                    setShowSuggestions(false)
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
                                        setSearchQuery(item)
                                        setShowSuggestions(false)
                                    }}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Charts Section - takes remaining height with consistent padding */}
            <div className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                    {/* Top row charts - responsive grid */}
                    {[0, 1, 2].map((index) => (
                        <div
                            key={index}
                            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex items-center justify-center rounded-lg h-[calc(33vh-2.5rem)]"
                        >
                            {isLoading ? (
                                <Loader upload />
                            ) : (
                                <MaterialComponentOverviewComponent
                                    type={
                                        index === 0
                                            ? "bar_PlantSpecificMaterialStatus"
                                            : index === 1
                                                ? "line_MaterialCategoryCount"
                                                : "bar_MaterialByPlant"
                                    }
                                    selectedItem={selectedItem}
                                    handleClick={handleItemClick}
                                    searchQuery={searchQuery}
                                />
                            )}
                        </div>
                    ))}

                    {/* Large chart - spans 2 columns on larger screens */}
                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex items-center justify-center rounded-lg col-span-1 md:col-span-2 h-[calc(66vh-5rem)]">
                        {isLoading ? (
                            <Loader upload />
                        ) : (
                            <MaterialComponentOverviewComponent
                                type="line_TopMaterialByReplacementParts"
                                selectedItem={selectedItem}
                                handleClick={handleItemClick}
                                searchQuery={searchQuery}
                            />
                        )}
                    </div>

                    {/* Two stacked charts - responsive height */}
                    <div className="flex flex-col gap-4 h-[calc(66vh-5rem)]">
                        {[3, 4].map((index) => (
                            <div
                                key={index}
                                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 flex-1 flex items-center justify-center rounded-lg"
                            >
                                {isLoading ? (
                                    <Loader upload />
                                ) : (
                                    <MaterialComponentOverviewComponent
                                        type={index === 3 ? "line_ReplacementPartsByPlant" : "bar_MaterialCount"}
                                        selectedItem={selectedItem}
                                        handleClick={handleItemClick}
                                        searchQuery={searchQuery}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MaterialComponentOverviewDashboard
