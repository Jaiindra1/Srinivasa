import React, { useState } from "react";
import "./index.css";

const ProductReport = () => {
    const [reportData, setReportData] = useState([]);
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [year, setYear] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        setLoading(true);
        let url = "";

        // Reset report data before fetching
        setReportData([]);

         if (month && year) {
            url = `http://localhost:5000/get-product-report/month?month=${month}&year=${year}`;
        }else {
            alert("Please select a valid filter (Month & Year, Day & Year, or Exact Date).");
            setLoading(false);
            return;
        }

        try {
            console.log("📡 Fetching:", url);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("✅ Data Received:", data);
            setReportData(data);
        } catch (error) {
            console.error("❌ Error fetching report:", error);
            alert("Failed to fetch report. Check the console for details.");
        } finally {
            setLoading(false);
        }
    };
    const fetchReport2 = async () => {
        setLoading(true);
        let url = "";

        // Reset report data before fetching
        setReportData([]);

          if (day && month && year) {
            url = `http://localhost:5000/get-product-report/day?day=${day}&month=${month}&year=${year}`;
        } else {
            alert("Please select a valid filter (Month & Year, Day & Year, or Exact Date).");
            setLoading(false);
            return;
        }

        try {
            console.log("📡 Fetching:", url);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("✅ Data Received:", data);
            setReportData(data);
        } catch (error) {
            console.error("❌ Error fetching report:", error);
            alert("Failed to fetch report. Check the console for details.");
        } finally {
            setLoading(false);
        }
    };
    // Reset Filters and Data
    const clearFilters = () => {
        setMonth("");
        setDay("");
        setYear("");
        setDate("");
        setReportData([]);
    };

    return (
        <div className="report-container">
            <h1>📊 Product Sales Report</h1>

            <div className="filter-container">
                <label>Select Month & Year:</label>
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option value="">Select Month</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                            {new Date(0, i).toLocaleString("default", { month: "long" })}
                        </option>
                    ))}
                </select>

                <select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">Select Year</option>
                    {[...Array(6)].map((_, i) => (
                        <option key={i} value={2025 - i}>
                            {2025 - i}
                        </option>
                    ))}
                </select>
                <br />

                <button onClick={fetchReport}>📋 Get Report</button><br/>
                <label>Select Exact Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                        const selectedDate = e.target.value;
                        setDate(selectedDate);

                        // Extracting day, month, and year from selected date
                        const [year, month, day] = selectedDate.split("-");
                        setYear(year);
                        setMonth(month);
                        setDay(day);
                    }}
                />
                <br />

                {/* Buttons */}
                <button onClick={fetchReport2}>📋 Get Report</button><br/>
                <button onClick={clearFilters} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>
                    🗑️ Clear Filters
                </button>
            </div>

            {loading && <p>Loading report...</p>}

            {reportData.length > 0 ? (
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity Sold</th>
                            <th>Total Sales (₹)</th>
                            <th>Total GST (₹)</th>
                            <th>Date</th>
                            <th>Month</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.product}</td>
                                <td>{item.quantity}</td>
                                <td>₹{item.price}</td>
                                <td>₹{item.gst}</td>
                                <td>{item.date}</td>
                                <td>{item.month || "Unknown Month"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !loading && <p>No sales data found for the selected period.</p>
            )}
        </div>
    );
};

export default ProductReport;
