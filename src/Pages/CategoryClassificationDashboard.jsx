"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Header from "../Components/Layout/Header"
import CategoryClassificationComponent from "../Components/CategoryClassificationComponent"
import Fuse from "fuse.js"

import CategoryClassificationsDataHandler from "../Utils/CategoryClassificationsDataHandler"
const { getProcessedCategoryData } = CategoryClassificationsDataHandler()

const CategoryClassificationDashboard = () => {
  const [editingUnlocked, setEditingUnlocked] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const [MaterialCategoryClassificationsData, setMaterialCategoryClassificationsData] = useState([])

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
      try {
        setMaterialCategoryClassificationsData(await getProcessedCategoryData())
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  // Combine terms for fuzzy search
  const allTerms = useMemo(() => {
    const termSet = new Set()
    const extractTerms = (data, keys) => {
      data.forEach((item) => {
        keys.forEach((key) => {
          if (item[key]) termSet.add(String(item[key]))
        })
      })
    }

    MaterialCategoryClassificationsData.forEach(item => {
      if (item.Description) termSet.add(item.Description.toLowerCase());
      if (item.MaterialCategory) termSet.add(item.MaterialCategory.toLowerCase());
    });    

    return [...termSet]
  }, [MaterialCategoryClassificationsData])


  // Set up Fuse instance
  const fuse = useMemo(() => new Fuse(allTerms, { includeScore: true, threshold: 0.4 }), [allTerms])

  // Generate suggestions
  const suggestions = searchQuery
    ? fuse
        .search(searchQuery)
        .map((res) => res.item)
        .slice(0, 5)
    : []

    const filteredCategoryData = useMemo(() => {
      if (!searchQuery) return MaterialCategoryClassificationsData;
    
      const resultTerms = fuse.search(searchQuery).map(res => res.item.toLowerCase());
    
      return MaterialCategoryClassificationsData.filter(row => {
        const description = (row.Description || '').toLowerCase();
        const category = (row.MaterialCategory || '').toLowerCase();
        const material = (row.Material || '').toLowerCase();
        const plant = (row.Plant || '').toLowerCase();
        return resultTerms.some(term =>
          description.includes(term) ||
          category.includes(term) ||
          material.includes(term) ||
          plant.includes(term)
        );
      });
    }, [searchQuery, MaterialCategoryClassificationsData, fuse]);

    const handleDataRefresh = async () => {
      try {
        const newData = await getProcessedCategoryData();
        setMaterialCategoryClassificationsData(newData);
        setRefreshKey(prev => prev + 1); // 🔥 Trigger component refresh via useEffect
      } catch (error) {
        console.error("Failed to refresh data:", error);
      }
    };    
    
  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-950 pb-4 overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 bg-gray-900 bg-opacity-90 z-10 relative">
        <Header title="Material Category Overview" />
        <div className="relative w-1/2 max-w-md" ref={searchWrapperRef}>
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

      <div className="px-4 space-y-4 pt-4">
        {/* TOP SECTION */}
        <div className="flex w-full h-[calc(100vh/3)] gap-4">
          <div className="w-1/2 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 rounded-lg overflow-auto">
            <CategoryClassificationComponent
              refreshKey={refreshKey}
              setRefreshKey={setRefreshKey}
              type="Line_chart_UnclassifiedNewlyDiscovered"
              editingUnlocked={editingUnlocked}
              setEditingUnlocked={setEditingUnlocked}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              data={filteredCategoryData}
              searchQuery={searchQuery}
              onSave={handleDataRefresh}
            />
          </div>

          <div className="w-[30%] bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 rounded-lg overflow-auto">
            <CategoryClassificationComponent
              refreshKey={refreshKey}
              setRefreshKey={setRefreshKey}
              type="donut_UnclassifiedNewlyDiscovered"
              editingUnlocked={editingUnlocked}
              setEditingUnlocked={setEditingUnlocked}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              data={filteredCategoryData}
              searchQuery={searchQuery}
              onSave={handleDataRefresh}
            />
          </div>

          <div className="w-1/5 flex flex-col gap-4">
            <div className="flex-1 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 rounded-lg overflow-auto">
              <CategoryClassificationComponent
                refreshKey={refreshKey}
                setRefreshKey={setRefreshKey}
                type="count_Unclassified"
                editingUnlocked={editingUnlocked}
                setEditingUnlocked={setEditingUnlocked}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                data={filteredCategoryData}
                searchQuery={searchQuery}
                onSave={handleDataRefresh}
              />
            </div>

            <div className="flex-1 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 rounded-lg overflow-auto">
              <CategoryClassificationComponent
                refreshKey={refreshKey}
                setRefreshKey={setRefreshKey}
                type="count_NewlyDiscovered"
                editingUnlocked={editingUnlocked}
                setEditingUnlocked={setEditingUnlocked}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                data={filteredCategoryData}
                searchQuery={searchQuery}
                onSave={handleDataRefresh}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex w-full h-[calc(100vh-8rem-100vh/3-2rem)] gap-4">
          <div className="w-4/5 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 rounded-lg overflow-auto">
            <CategoryClassificationComponent
              refreshKey={refreshKey}
              setRefreshKey={setRefreshKey}
              type="table_MaterialCategoryClassificationsData"
              editingUnlocked={editingUnlocked}
              setEditingUnlocked={setEditingUnlocked}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              data={filteredCategoryData}
              searchQuery={searchQuery}
              onSave={handleDataRefresh}
            />
          </div>

          <div className="w-1/5 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-4 rounded-lg overflow-auto">
            <CategoryClassificationComponent
              refreshKey={refreshKey}
              setRefreshKey={setRefreshKey}
              type="table_UniqueMaterialCategories"
              editingUnlocked={editingUnlocked}
              setEditingUnlocked={setEditingUnlocked}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              data={filteredCategoryData}
              searchQuery={searchQuery}
              onSave={handleDataRefresh}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryClassificationDashboard
