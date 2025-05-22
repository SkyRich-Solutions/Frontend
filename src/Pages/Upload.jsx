"use client"

import React from "react"
import { useState } from "react"
import axios from "axios"
import Loader from "../Components/ReUseable/Loader"
import Pagination from "../Components/ReUseable/Pagination"
import { CircleAlertIcon, CircleCheckBigIcon, WandSparklesIcon } from "lucide-react"

const UploadPage = () => {
  const rowsPerPage = 18
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [response, setResponse] = useState(null)
  const [output, setOutput] = useState("")
  const [UnprocessedData, setUnprocessedData] = useState([])
  const [ProcessedData, setProcessedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasErrors, setHasErrors] = useState(false)

  const [Uploading, setUploading] = useState(false)
  const [Cleaning, setCleaning] = useState(false)
  const [error, setError] = useState(null)

  const headerMap = {
    ViolationReplacementPart: "Violation (Part)",
    UnknownMaintPlant: "Maint. Plant Unknown",
    UnknownPlanningPlant: "Planning Plant Unknown",
    UnknownLocation: "Location Unknown",
    PlantSpecificMaterialStatus: "Status",
    BatchManagementPlant: "Batch Managed",
    Serial_No_Profile: " Serial No. Profile",
    ReplacementPart: "Replacement Part",
    UsedInSBom: "Used in S-BOM",
    UnknownPlant: "Unknown Plant",
    Auto_Classified: "Auto Classified",
    NewlyDiscovered: "Newly Discovered",
    Manually_Classified: "Manually Classified",
    FunctionalLoc: "Functional Location",
    Description: "Description",
    MaintPlant: "Maintenance Plant",
    PlanningPlant: "Planning Plant",
    Platform: "Platform",
    WTShortName: "WT Short Name",
    TurbineModel: "Turbine Model",
    MkVersion: "MK Version",
    Revision: "Revision",
    NominalPower: "Nominal Power",
    OriginalEqManufact: "Original Equipment Manufacturer",
    SBOMForTurbine: "SBOM For Turbine",
    SCADAName: "SCADA Name",
    SCADAParkID: "SCADA Park ID",
    SCADACode: "SCADA Code",
    SCADAFunctionalLoc: "SCADA Functional Location",
    TechID: "Tech ID",
    Region: "Region",
    Technology: "Technology",
    HubHeight: "Hub Height",
    TowerHeight: "Tower Height",
    TurbineClass: "Turbine Class",
    TurbineLatitude: "Latitude",
    TurbineLongitude: "Longitude",
  }

  const isMaterialProcessed = (item) => {
    return (
      item.ViolationReplacementPart === "1" ||
      item.Auto_Classified === "1" ||
      item.UnknownPlant === "Unknown" ||
      item.NewlyDiscovered === "1" ||
      item.Manually_Classified === "1"
    )
  }

  const isTurbineProcessed = (item) => {
    return item.UnknownMaintPlant === "1" || item.UnknownPlanningPlant === "1" || item.UnknownLocation === "1"
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setResponse(null)
    setError(null)
    setHasErrors(false)

    if (selectedFile) {
      const lowerName = selectedFile.name.toLowerCase()
      if (lowerName.includes("material")) setFileType("material")
      else if (lowerName.includes("turbine")) setFileType("turbine")
      else setFileType(null)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return alert("Please select a file first.")

    const formData = new FormData()
    formData.append("file", file)

    setUploading(true)
    setCleaning(false)

    try {
      const res = await axios.post("http://localhost:4000/api/uploadFile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setResponse(res.data.message)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.")
      setResponse(null)
    } finally {
      setUploading(false)
    }
  }

  const fetchData = async () => {
    try {
      const tryFetch = async (type) => {
        const apiPrefix = type === "material" ? "Material" : "Turbine"
        const [unprocessedRes, processedRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/fetch_Unprocessed${apiPrefix}Data`),
          axios.get(`http://localhost:4000/api/fetch_Processed${apiPrefix}Data`),
        ])
        setFileType(type)
        setUnprocessedData(unprocessedRes.data.data)
        setProcessedData(processedRes.data.data)

        const rowsWithErrors = processedRes.data.data.filter((item) =>
          type === "material" ? isMaterialProcessed(item) : isTurbineProcessed(item),
        ).length

        setOutput(
          rowsWithErrors > 0
            ? `Found ${rowsWithErrors} rows with issues that need cleaning`
            : "Data is already clean ✅ (No issues found)",
        )
        setHasErrors(rowsWithErrors > 0)
      }

      if (fileType) await tryFetch(fileType)
      else {
        try {
          await tryFetch("material")
        } catch {
          await tryFetch("turbine")
        }
      }
    } catch (err) {
      setError("Error fetching data.")
      console.error(err)
    }
  }

  const handleRunScript = async () => {
    setCleaning(true)
    setUploading(false)
    setError(null)
    setOutput("")

    try {
      const response = await axios.post("http://localhost:4000/api/run-python-both", {}, { withCredentials: true })

      if (response.data) {
        const apiPrefix = fileType === "material" ? "Material" : "Turbine"
        const [unprocessedRes, processedRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/fetch_Unprocessed${apiPrefix}Data`),
          axios.get(`http://localhost:4000/api/fetch_Processed${apiPrefix}Data`),
        ])

        const unprocessed = unprocessedRes.data.data
        const processed = processedRes.data.data

        setUnprocessedData(unprocessed)
        setProcessedData(processed)

        const totalRows = processed.length
        const cleanedLines = processed.filter((item) =>
          fileType === "material" ? isMaterialProcessed(item) : isTurbineProcessed(item),
        ).length

        if (cleanedLines > 0) {
          setOutput(`${cleanedLines} Violations out of ${totalRows}`)
          setHasErrors(true)
        } else {
          setOutput("Data was already clean ✅ (No issues found)")
          setHasErrors(false)
        }
      }
    } catch (error) {
      console.error("Error running script:", error)
      setError("Error running both scripts.")
    } finally {
      setTimeout(() => setCleaning(false), 2000)
    }
  }

  const unprocessedColumns = UnprocessedData.length > 0 ? Object.keys(UnprocessedData[0]) : []

  // ✅ MATCH ROWS BY INDEX, showing same row from unprocessed and cleaned
  const createMatchedPairs = () => {
    const processedRows = ProcessedData.filter((item) => {
      if (fileType === "material") {
        return isMaterialProcessed(item)
      } else if (fileType === "turbine") {
        return isTurbineProcessed(item)
      }
      return false
    })

    const pairs = []

    processedRows.forEach((processedItem) => {
      let matchFn

      if (fileType === "material") {
        matchFn = (unprocessedItem) =>
          unprocessedItem.Material === processedItem.Material &&
          unprocessedItem.Description === processedItem.Description
      } else if (fileType === "turbine") {
        matchFn = (unprocessedItem) =>
          unprocessedItem.FunctionalLoc === processedItem.FunctionalLoc &&
          unprocessedItem.Description === processedItem.Description &&
          unprocessedItem.MaintPlant === processedItem.MaintPlant &&
          unprocessedItem.PlanningPlant === processedItem.PlanningPlant
      }

      const matchingUnprocessed = UnprocessedData.find(matchFn)

      if (matchingUnprocessed) {
        pairs.push({
          processed: processedItem,
          unprocessed: matchingUnprocessed,
        })
      }
    })

    return pairs
  }

  const matchedPairs = createMatchedPairs()
  const paginatedPairs = matchedPairs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <div className="flex-1 overflow-auto z-10 min-h-screen space-y-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-xl text-center flex items-center justify-between">
        <h1 className="text-white text-2xl font-semibold">CSV Upload Dashboard</h1>
        <div>
          <form onSubmit={handleUpload} className="flex gap-2 justify-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="p-2 border border-gray-600 bg-gray-700 text-white rounded"
            />
            <button
              type="submit"
              disabled={Uploading || Cleaning}
              className={`w-32 flex items-center justify-center gap-2 font-bold py-2 px-4 rounded 
                ${Uploading || Cleaning ? "bg-blue-500 cursor-not-allowed opacity-50" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
            >
              {Uploading ? <Loader upload /> : "Upload"}
            </button>
          </form>

          {response && (
            <div className="mt-3 text-green-400 flex gap-1 justify-center">
              <b>Success</b>
              <CircleCheckBigIcon />
            </div>
          )}

          {error && (
            <div className="mt-3 text-red-400 flex gap-1 justify-center">
              <b>{error}</b>
              <CircleAlertIcon />
            </div>
          )}
        </div>

        <div>
          {response && (
            <button
              onClick={handleRunScript}
              disabled={Uploading || Cleaning}
              className={`w-42 flex items-center justify-center gap-2 font-bold py-3 px-4 rounded whitespace-nowrap
              ${Uploading || Cleaning ? "bg-blue-500 cursor-not-allowed opacity-50" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
            >
              <WandSparklesIcon className="w-5 h-5" />
              Clean Data
            </button>
          )}
        </div>
      </div>

      {!Uploading && (
        <>
          {output && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md mx-auto max-w-3xl p-4 mb-4">
              <div
                className={`flex items-center justify-center gap-2 ${hasErrors ? "text-amber-400" : "text-green-400"}`}
              >
                {hasErrors ? <CircleAlertIcon className="w-5 h-5" /> : <CircleCheckBigIcon className="w-5 h-5" />}
                <span className="text-sm font-medium">{output}</span>
              </div>
            </div>
          )}
          {Cleaning ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <Loader />
            </div>
          ) : hasErrors ? (
            <>
              <div className="flex item-center justify-center">
                <h2 className="text-xl w-1/2 font-bold text-center mb-2">
                  Unprocessed Data ({matchedPairs.length} rows)
                </h2>
                <h2 className="text-xl w-1/2 font-bold text-center mb-2">
                  Processed Data ({matchedPairs.length} rows)
                </h2>
              </div>
              <div className="flex w-full justify-center gap-4 overflow-x-auto py-4 px-4">
                {[
                  { title: "Unprocessed", getItem: (pair) => pair.unprocessed },
                  { title: "Processed", getItem: (pair) => pair.processed },
                ].map(({ title, getItem }, index) => (
                  <div key={index} className="w-[50%] h-full overflow-auto">
                    <div className="overflow-x-auto max-h-[715px]">
                      <table className="table-auto w-full h-full">
                        <thead className="sticky top-0 z-10 bg-gray-700 text-white">
                          <tr>
                            {unprocessedColumns.map((key) => (
                              <th key={key} className="px-4 py-2 text-sm font-semibold text-left whitespace-nowrap">
                                {headerMap[key] || key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedPairs.map((pair, rowIndex) => {
                            const item = getItem(pair)
                            const shouldHighlight =
                              title === "Processed" &&
                              ((fileType === "material" && isMaterialProcessed(item)) ||
                                (fileType === "turbine" && isTurbineProcessed(item)))

                            return (
                              <tr
                                key={rowIndex}
                                className={`text-sm ${
                                  shouldHighlight
                                    ? "bg-red-500 text-white font-bold"
                                    : rowIndex % 2 === 0
                                      ? "bg-gray-800"
                                      : "bg-transparent"
                                } hover:bg-cyan-800 transition-colors`}
                              >
                                {unprocessedColumns.map((key, cellIndex) => (
                                  <td
                                    key={cellIndex}
                                    className="px-4 py-2 text-left max-w-[150px] truncate"
                                    title={item[key]}
                                  >
                                    {item[key]}
                                  </td>
                                ))}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalItems={matchedPairs.length}
                  itemsPerPage={rowsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  )
}

export default UploadPage
