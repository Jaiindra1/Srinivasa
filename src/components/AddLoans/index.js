import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { FaUsers, FaFileAlt } from "react-icons/fa";
import "./index.css";

const LoanPersons = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loanData, setLoanData] = useState([]); // Initially empty
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusUpdates, setStatusUpdates] = useState({}); // Store selected status changes

    // Handle search input
    const handleSearch = (e) => setSearchQuery(e.target.value);

    // Fetch data from API on button click
    const fetchLoanData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("https://srinivasa-backend.onrender.com/loans");
            if (!response.ok) throw new Error("Failed to fetch loan data");
            const data = await response.json();
    
            console.log("Fetched loan data:", data); // 🔍 Debugging log
    
            setLoanData(data);
        } catch (err) {
            setError(err.message);
            setLoanData([]); // Reset data on error
        } finally {
            setLoading(false);
        }
    };    

    // 🔥 Corrected Filtering
    const filteredData = loanData.filter((item) =>
        item?.candidateName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle status selection
    const handleStatusChange = (id, newStatus) => {
        setStatusUpdates((prev) => ({ ...prev, [id]: newStatus }));
    };

    // Update status in backend and frontend
    const updateLoanStatus = async (id) => {
        const newStatus = statusUpdates[id];

        if (!newStatus) return alert("Please select a new status before updating!");

        try {
            const response = await fetch(`https://srinivasa-backend.onrender.com/loans/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error("Failed to update status");

            // Update state to reflect new status instantly
            setLoanData((prevData) =>
                prevData.map((item) =>
                    item.id === id ? { ...item, status: newStatus } : item
                )
            );

            alert("Status updated successfully!");
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error updating status. Try again.");
        }
    };

    return (
        <div className="container">
            <header className="dashboard-header">
                <h2>Loan Management System</h2>
            </header>

            {/* Search Bar */}
            <div className="search-container">
                <input type="text" placeholder="Enter person name..." value={searchQuery} onChange={handleSearch} />
                <button className="fetch-btn" onClick={fetchLoanData}>
                    Get Data
                </button>
            </div>

            {/* Display loading or error message */}
            {loading && <p>Loading loan details...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Loan Data Table */}
            {!loading && !error && (
                <table className="loan-table">
                    <thead>
                        <tr>
                            <th>S.NO</th>
                            <th>Name of Person</th>
                            <th>Number</th>
                            <th>Site Address</th>
                            <th>Loan Products</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.candidateName}</td>
                                    <td>{item.mobileNumber}</td>
                                    <td>{item.address}</td>
                                    <td className="loan-data">{item.LoanData}</td>
                                    <td>{item.createdAt}</td>
                                    <td>
                                        {/* Dropdown for selecting status */}
                                        <select
                                            value={statusUpdates[item.id] || item.status}
                                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </td>
                                    <td>
                                        {/* Button to apply status change */}
                                        <button onClick={() => updateLoanStatus(item.id)}>Change</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No loan records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LoanPersons;
