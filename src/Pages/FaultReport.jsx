import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Components/Layout/Header";

const FaultReport = () => {
    const [technicians, setTechnicians] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);

    const [formData, setFormData] = useState({
        Technician_ID: "",
        TurbineLocation: "",
        Report_Date: "",
        Fault_Type: "",
        Report_Status: "",
    });
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [techRes, locRes] = await Promise.all([
                    axios.get("http://localhost:4000/api/technicians"),
                    axios.get("http://localhost:4000/api/locations")
                ]);

                setTechnicians(techRes.data.data || []);
                setLocations(locRes.data.data || []);
            } catch (err) {
                setError("Failed to load data.");
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (file && file.type !== "application/pdf") {
            alert("Only PDF files are allowed.");
            return;
        }

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });
            if (file) formDataToSend.append("file", file);

            const response = await axios.post("http://localhost:4000/api/faultReport", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert(response.data.message);

            setFormData({
                Technician_ID: "",
                TurbineLocation: "",
                Report_Date: "",
                Fault_Type: "",
                Report_Status: "",
            });
            setFile(null);
        } catch (error) {
            alert("Error submitting report: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="flex-1 overflow-auto z-10 min-h-screen space-y-4">
             <div className="flex justify-between items-center px-6 pt-6 bg-gray-900 bg-opacity-90 z-10"></div>
            <Header title="Fault Report Upload" />
            <div className="flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 min-h-screen">
                <div className="w-full max-w-md text-white">
                    {loading ? (
                        <p className="text-center text-gray-300">Loading technicians and locations...</p>
                    ) : error ? (
                        <p className="text-center text-red-400">{error}</p>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-4">
                                <label>Technician:</label>
                                <select
                                    name="Technician_ID"
                                    value={formData.Technician_ID}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-700 text-white border border-gray-500 p-2 rounded"
                                >
                                    <option value="">Select Technician</option>
                                    {technicians.map((tech) => (
                                        <option key={tech.Technician_ID} value={tech.Technician_ID}>
                                            {tech.Technician_ID}{".    "}{tech.Name} {tech.Surname}
                                        </option>
                                    ))}
                                </select>

                                <label>Turbine Location:</label>
                                <select
                                    name="TurbineLocation"
                                    value={formData.TurbineLocation}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-700 text-white border border-gray-500 p-2 rounded"
                                >
                                    <option value="">Select Location</option>
                                    {locations.map((loc) => (
                                        <option key={loc.Location_ID} value={loc.Location_ID}>
                                        {loc.Location_ID}{".    "}{loc.Location_Name || "Unnamed Location"}
                                        </option>
                                    ))}
                                </select>

                                <label>Report Date:</label>
                                <input
                                    type="date"
                                    name="Report_Date"
                                    value={formData.Report_Date}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-700 text-white border border-gray-500 p-2 rounded"
                                />

                                <label>Fault Type:</label>
                                <select
                                    name="Fault_Type"
                                    value={formData.Fault_Type}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-700 text-white border border-gray-500 p-2 rounded"
                                >
                                    <option value="Replacement Part">Replacement Part</option>
                                    <option value="Maintenance Check">Maintenance Check</option>
                                    <option value="Electrical Fault">Electrical Fault</option>
                                    <option value="Mechanical Fault">Mechanical Fault</option>
                                    <option value="Sensor Issue">Sensor Issue</option>
                                    <option value="Firmware Update">Firmware Update</option>
                                    <option value="Environmental Damage">Environmental Damage</option>
                                    <option value="Unknown">Unknown</option>
                                </select>

                                <label>Report Status:</label>
                                <select
                                    name="Report_Status"
                                    value={formData.Report_Status}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-700 text-white border border-gray-500 p-2 rounded"
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

                                <label>Upload PDF Report:</label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="text-white"
                                />

                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Submit Report
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FaultReport;
