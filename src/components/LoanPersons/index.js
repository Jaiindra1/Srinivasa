import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import "./index.css";

const LoanPerson = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loanData, setLoanData] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle search input
    const handleSearch = (e) => setSearchQuery(e.target.value);

    // Fetch data from API
    const fetchLoanData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:5000/gloans");
            if (!response.ok) throw new Error("Failed to fetch loan data");
            const data = await response.json();
            console.log("Fetched loan data:", data);
            setLoanData(data);
        } catch (err) {
            setError(err.message);
            setLoanData([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter Loan Data
    const filteredData = loanData.filter((item) =>
        item?.candidateName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container">
            <header className="dashboard-header">
                <h2>Loan Management System</h2>
                <nav className="navbar">
                    <a href="/LoanProducts"><FaUsers /> Persons</a>
                </nav>
            </header>

            {/* Search Bar */}
            <div className="search-container">
                <input type="text" placeholder="Enter person name..." value={searchQuery} onChange={handleSearch} />
                
                <button className="fetch-btn" onClick={fetchLoanData}>Get Data</button>
            </div>

            {/* Loading/Error Message */}
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
                                    <td>{item.LoanData}</td>
                                    <td>{item.createdAt}</td>
                                    <td><span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No loan records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LoanPerson;
