import { useState } from "react";
import { FaSearch, FaHome, FaUsers, FaChartBar, FaFileAlt } from "react-icons/fa";
import { Link, Routes, Route } from "react-router-dom"; 
import "./index.css";

const LoanPersons = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const loanData = [
        { id: 1, name: "John Smith", number: "+1 (555) 123-4567", address: "123 Main Street, New York, NY 10001", product: "Personal Loan", status: "Active" },
        { id: 2, name: "Sarah Johnson", number: "+1 (555) 234-5678", address: "456 Park Avenue, Los Angeles, CA 90001", product: "Home Loan", status: "Pending" },
        { id: 3, name: "Michael Brown", number: "+1 (555) 345-6789", address: "789 Oak Road, Chicago, IL 60601", product: "Business Loan", status: "Closed" }
    ];

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const filteredData = loanData.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <div className="container">
            <header className="dashboard-header">
                <h2>Loan Management System</h2>
                <nav className="navbar">
                <Link to="/"><FaHome /> <h3>Dashboard</h3></Link> 
                    <a href="#"><FaUsers /> Persons</a>
                    <a href="#"><FaFileAlt /> Reports</a>
                    <a href="#"><FaChartBar /> Analytics</a>
                </nav>
            </header>

            {/* Search Bar */}
            <div className="search-container">
                <input type="text" placeholder="Enter person name..." value={searchQuery} onChange={handleSearch} />
                <button className="search-btn"><FaSearch /></button>
                <button className="fetch-btn">Get Data</button>
            </div>

            {/* Loan Data Table */}
            <table className="loan-table">
                <thead>
                    <tr>
                        <th>S.NO</th>
                        <th>Name of Person</th>
                        <th>Number</th>
                        <th>Site Address</th>
                        <th>Loan Products</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.number}</td>
                            <td>{item.address}</td>
                            <td>{item.product}</td>
                            <td>
                                <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>{"<"}</button>
                <span>{currentPage}</span>
                <button onClick={() => handlePageChange(currentPage + 1)}>{">"}</button>
                <span>Showing {filteredData.length} of {loanData.length} items</span>
            </div>
        </div>
    );
};

export default LoanPersons;
