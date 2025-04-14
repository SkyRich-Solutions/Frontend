import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Components/Layout/Header";

const FaultReport = () => {
    const [technicians, setTechnicians] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null); // State for file upload

    const [formData, setFormData] = useState({
        Technician_ID: "",
        TurbineLocation: "",
        Report_Date: "",
        Fault_Type: "",
        Report_Status: "",
    });

    // Fetch data on component mount
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

        // Validate file type
        if (file && file.type !== "application/pdf") {
            alert("Only PDF files are allowed.");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("Technician_ID", formData.Technician_ID);
            formDataToSend.append("TurbineLocation", formData.TurbineLocation);
            formDataToSend.append("Report_Date", formData.Report_Date);
            formDataToSend.append("Fault_Type", formData.Fault_Type);
            formDataToSend.append("Report_Status", formData.Report_Status);
            if (file) {
                formDataToSend.append("file", file);
            }

            const response = await axios.post("http://localhost:4000/api/faultReport", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert(response.data.message);

            // Reset form
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
        <div className="flex-1 overflow-auto z-1 h-auto space-y-4">
            <Header title="Fault Report" />
            <div className="items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 h-screen">
                <h2>Submit Fault Report</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label>Technician:</label>
                    <select name="Technician_ID" value={formData.Technician_ID} onChange={handleChange} required>
                        <option value="">Select Technician</option>
                        {technicians.map((tech) => (
                            <option key={tech.Technician_ID} value={tech.Technician_ID}>
                                {tech.Name}
                            </option>
                        ))}
                    </select>

                    <label>Turbine Location:</label>
                    <select name="TurbineLocation" value={formData.TurbineLocation} onChange={handleChange} required>
                        <option value="">Select Location</option>
                        {locations.map((loc) => (
                            <option key={loc.Location_ID} value={loc.Location_ID}>
                                {loc.Location_Name}
                            </option>
                        ))}
                    </select>

                    <label>Report Date:</label>
                    <input type="date" name="Report_Date" value={formData.Report_Date} onChange={handleChange} required />

                    <label>Fault Type:</label>
                    <textarea name="Fault_Type" value={formData.Fault_Type} onChange={handleChange} required />

                    <label>Report Status:</label>
                    <input type="text" name="Report_Status" value={formData.Report_Status} onChange={handleChange} required />

                    <label>Upload PDF Report:</label>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />

                    <button type="submit">Submit Report</button>
                </form>
            </div>
        </div>
    );
};

export default FaultReport;
