import { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import ProductSelect from "../Emulsions/index.js";
import Receipt from "../Reciept/index.js";
import SheenLacBilling from "../SheenLac/index.js";
import AddLoan from "../AddLoans/index.js";
import ProductBilling from "../Pipes/index.js";
import ProductReport from "../ProductReport/index.js";
import Loandetails from "../LoanDetails/index.js";
import LoanPerson from "../LoanPersons/index.js";
import { FaPalette, FaFileInvoice, FaFileAlt, FaPlus, FaCubes, FaUser } from "react-icons/fa";
import { MdFormatPaint } from "react-icons/md";
import "./index.css";

const Dashboard = () => {
    const [pendingAmount, setPendingAmount] = useState(null);
    const [activeBorrowers, setActiveBorrowers] = useState(0);
    const [totalLoans, setTotalLoans] = useState(0);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch("https://srinivasa-backend.onrender.com/ploans");
                if (!response.ok) throw new Error("Failed to fetch pending loans");
                const data = await response.json();
                const totalPending = data.reduce((sum, loan) => sum + Math.floor(loan.Price), 0);
                setPendingAmount(totalPending);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchActiveBorrowers = async () => {
            try {
                const response = await fetch("https://srinivasa-backend.onrender.com/ActiveBorrowers");
                if (!response.ok) throw new Error("Failed to fetch active borrowers");
                const data = await response.json();
                setActiveBorrowers(data.Number || 0);
            } catch (err) {
                console.error("Error fetching active borrowers:", err);
            }
        };

        const fetchTotalProducts = async () => {
            try {
                const response = await fetch("https://srinivasa-backend.onrender.com/totalProducts");
                if (!response.ok) throw new Error("Failed to fetch total products");
                const data = await response.json();
                setTotalProducts(data.total || 0);
            } catch (err) {
                console.error("Error fetching total products:", err);
            }
        };

        const fetchTotalLoans = async () => {
            try {
                const response = await fetch("https://srinivasa-backend.onrender.com/ploans");
                if (!response.ok) throw new Error("Failed to fetch total loans");
                const data = await response.json();
                setTotalLoans(data[0].ID || 0);
            } catch (err) {
                console.error("Error fetching total loans:", err);
            }
        };

        const fetchRecentLoans = async () => {
            try {
                const response = await fetch("https://srinivasa-backend.onrender.com/recent-loans");
                if (!response.ok) throw new Error("Failed to fetch recent loans");
                const data = await response.json();
                setActivities(data.map(loan => ({
                    text: `Loan applied by ${loan.candidateName} for ₹${loan.Price}`,
                    time: new Date(loan.time).toLocaleString()  // Format date
                })));
            } catch (err) {
                console.error("Error fetching recent loans:", err);
            }
        };

        Promise.all([fetchDashboardData(), fetchActiveBorrowers(), fetchTotalProducts(), fetchTotalLoans(), fetchRecentLoans()])
            .finally(() => setLoading(false));
           
    }, []);

    return (
        <div className="dashboard-container">
            <nav className="top-nav">
                <h2 className="Dashboard-name">Srinivasa Enterprises</h2>
            </nav>

            <div className="main-layout">
                <div className="sidebar">
                    <Link to="/"> <h3>Dashboard</h3></Link>
                    <div className="sidebar-item"><FaPalette /><Link to="/SheenLac"> SheenLac</Link></div>
                    <div className="sidebar-item"><MdFormatPaint /><Link to="/Emulsions"> Emulsions</Link></div>
                    <div className="sidebar-item"><FaCubes /><Link to="/Pvc|cpvc"> PVC || CPVC </Link></div>
                    <div className="sidebar-item"><FaFileInvoice /><Link to="/Receipt"> Receipt </Link></div>
                    <div className="sidebar-item"><FaFileAlt /><Link to="/PReports"> Product Reports </Link></div>
                    <div className="sidebar-item"><FaPlus /><Link to="/AddLoans"> Add Loans </Link></div>
                    <div className="sidebar-item"><FaUser /><Link to="/Lpersons"> Loan Persons </Link></div>
                </div>

                <main className="content">
                    <Routes>
                        <Route path="/Emulsions" element={<ProductSelect />} />
                        <Route path="/SheenLac" element={<SheenLacBilling />} />
                        <Route path="/Receipt" element={<Receipt />} />
                        <Route path="/PReports" element={<ProductReport />} />
                        <Route path="/AddLoans" element={<AddLoan />} />
                        <Route path="/LoanProducts" element={<Loandetails />} />
                        <Route path="/Pvc|cpvc" element={<ProductBilling />} />
                        <Route path="/Lpersons" element={<LoanPerson />} />
                        <Route
                            path="/"
                            element={
                                <div className="dashboard-home">
                                    <section className="metrics-section">
                                        <div className="metric-card">
                                            <div className="metric-title">Total Products</div>
                                            <div className="metric-value">{totalProducts}</div>
                                        </div>
                                        <div className="metric-card">
                                            <div className="metric-title">Total Loans Pending</div>
                                            <div className="metric-value">{loading ? "Loading..." : error ? "Failed to fetch" : totalLoans}</div>
                                        </div>
                                        <div className="metric-card">
                                            <div className="metric-title">Total Pending Loan Amount</div>
                                            <div className="metric-value">
                                                {loading ? "Loading..." : error ? "Unavailable" : `₹ ${pendingAmount}`}
                                            </div>
                                        </div>
                                        <div className="metric-card">
                                            <div className="metric-title">Active Borrowers</div>
                                            <div className="metric-value">{activeBorrowers}</div>
                                            <div className="metric-change">+5%</div>
                                        </div>
                                    </section>

                                    <section className="charts-section">
                                        <div className="chart-card">
                                            <div className="chart-title">Revenue Overview</div>
                                            <div className="chart-placeholder"></div>
                                        </div>
                                        <div className="chart-card">
                                            <div className="chart-title">Loan Trends</div>
                                            <div className="chart-placeholder"></div>
                                        </div>
                                    </section>

                                    <section className="activities-section">
                                        <div className="activities-header">
                                            Recent Activities
                                            <a href="/Lpersons" className="view-all">View All</a>
                                        </div>
                                        <ul className="activities-list">
                                            {activities.length > 0 ? (
                                                activities.map((activity, index) => (
                                                    <li key={index} className="activity-item">
                                                        <span className="activity-text" >{activity.text}</span>
                                                        {activity.time && <span className="activity-time" >{activity.time}</span>}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="activity-item">No recent activities</li>
                                            )}
                                        </ul>
                                    </section>
                                </div>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
