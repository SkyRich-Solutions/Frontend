"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Header from "../Components/Layout/Header"
import Pagination from "../Components/ReUseable/Pagination"

const ITEMS_PER_PAGE = 13

const FaultReport = () => {
  const [technicians, setTechnicians] = useState([])
  const [locations, setLocations] = useState([])
  const [faultReports, setFaultReports] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [file, setFile] = useState(null)

  const [formData, setFormData] = useState({
    Technician_ID: "",
    TurbineLocation: "",
    Report_Date: "",
    Fault_Type: "",
    Report_Status: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [techRes, locRes, reportRes] = await Promise.all([
          axios.get("http://localhost:4000/api/technicians"),
          axios.get("http://localhost:4000/api/locations"),
          axios.get("http://localhost:4000/api/getAllFaultReports"),
        ])

        setTechnicians(techRes.data.data || [])
        setLocations(locRes.data.data || [])
        setFaultReports(reportRes.data.data || [])
      } catch (err) {
        setError("Failed to load data.")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (file && file.type !== "application/pdf") {
      alert("Only PDF files are allowed.")
      return
    }

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })
      if (file) formDataToSend.append("file", file)

      const response = await axios.post("http://localhost:4000/api/faultReport", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      alert(response.data.message)

      // Refresh report list
      const refreshed = await axios.get("http://localhost:4000/api/getAllFaultReports")
      setFaultReports(refreshed.data.data || [])

      // Reset form
      setFormData({
        Technician_ID: "",
        TurbineLocation: "",
        Report_Date: "",
        Fault_Type: "",
        Report_Status: "",
      })
      setFile(null)
    } catch (error) {
      alert("Error submitting report: " + (error.response?.data?.message || error.message))
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const paginatedReports = faultReports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="h-screen flex flex-col bg-gray-800 bg-opacity-50 backdrop-blur-md w-full border-gray-700 ">
      <Header title="Fault Report Upload" />

      <div className="flex-1 p-8 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-8 h-full max-h-full">
          {/* Form Section */}
          <div className="lg:w-1/2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Submit New Fault Report</h2>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-300">Loading data...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
                <div className="space-y-2">
                  <label className="block font-medium">Technician:</label>
                  <select
                    name="Technician_ID"
                    value={formData.Technician_ID}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Technician</option>
                    {technicians.map((tech) => (
                      <option key={tech.Technician_ID} value={tech.Technician_ID}>
                        {tech.Technician_ID}
                        {". "}
                        {tech.Name} {tech.Surname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block font-medium">Turbine Location:</label>
                  <select
                    name="TurbineLocation"
                    value={formData.TurbineLocation}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Location</option>
                    {locations.map((loc) => (
                      <option key={loc.Location_ID} value={loc.Location_ID}>
                        {loc.Location_ID}
                        {". "}
                        {loc.Location_Name || "Unnamed Location"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block font-medium">Report Date:</label>
                  <input
                    type="date"
                    name="Report_Date"
                    value={formData.Report_Date}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-medium">Fault Type:</label>
                  <select
                    name="Fault_Type"
                    value={formData.Fault_Type}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Fault Type</option>
                    <option value="Replacement Part">Replacement Part</option>
                    <option value="Maintenance Check">Maintenance Check</option>
                    <option value="Electrical Fault">Electrical Fault</option>
                    <option value="Mechanical Fault">Mechanical Fault</option>
                    <option value="Sensor Issue">Sensor Issue</option>
                    <option value="Firmware Update">Firmware Update</option>
                    <option value="Environmental Damage">Environmental Damage</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block font-medium">Report Status:</label>
                  <select
                    name="Report_Status"
                    value={formData.Report_Status}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting for Parts">Waiting for Parts</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block font-medium">Upload PDF Report:</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-600 file:text-white hover:file:bg-gray-500 transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Table Section */}
          <div className="lg:w-1/2 flex flex-col h-full">
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold mb-6 text-center">Submitted Fault Reports</h2>

              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-auto rounded-md border border-gray-700">
                  <table className="min-w-full divide-y divide-gray-700 text-white">
                    <thead className="bg-gray-700 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Technician</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                            Loading reports...
                          </td>
                        </tr>
                      ) : paginatedReports.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                            No reports found.
                          </td>
                        </tr>
                      ) : (
                        paginatedReports.map((report, index) => (
                          <tr key={index} className="hover:bg-gray-700 transition-colors">
                            <td className="px-4 py-3 text-sm">{report.Technician_ID}</td>
                            <td className="px-4 py-3 text-sm">{report.TurbineLocation}</td>
                            <td className="px-4 py-3 text-sm">{report.Report_Date}</td>
                            <td className="px-4 py-3 text-sm">{report.Fault_Type}</td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  report.Report_Status === "Open"
                                    ? "bg-green-900 text-green-200"
                                    : report.Report_Status === "In Progress"
                                      ? "bg-blue-900 text-blue-200"
                                      : report.Report_Status === "Waiting for Parts"
                                        ? "bg-yellow-900 text-yellow-200"
                                        : report.Report_Status === "Under Review"
                                          ? "bg-purple-900 text-purple-200"
                                          : report.Report_Status === "Resolved"
                                            ? "bg-teal-900 text-teal-200"
                                            : report.Report_Status === "Closed"
                                              ? "bg-gray-700 text-gray-200"
                                              : "bg-red-900 text-red-200"
                                }`}
                              >
                                {report.Report_Status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {!loading && faultReports.length > 0 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={faultReports.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FaultReport
