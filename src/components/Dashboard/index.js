import { useState } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom"; // Import useLocation
import ProductSelect from "../Emulsions/index.js";
import Receipt from "../Reciept/index.js";
import EnamelsBilling from "../Enamels/index.js";
import AddLoan from "../AddLoans";
import PiPes from "../Pipes/index.js";
import ProductReport from "../ProductReport/index.js";
import Loandetails from "../LoanDetails/index.js"
import LoanPerson from "../LoanPersons/index.js";
import { FaPalette, FaFileInvoice, FaFileAlt, FaPlus, FaCubes, FaUser } from "react-icons/fa";
import { MdFormatPaint } from "react-icons/md";
import "./index.css";

const Dashboard = () => {
    const [isSidebarOpen] = useState(true);
    const location = useLocation(); // Use useLocation to get the current pathname

    return (
        <div className="dashboard-container">
            {/* Top Navbar */}
            <nav className="top-nav">
                <h2 className="Dashboard-name">Srinivasa Enterprises</h2>
            </nav>

            <div className="main-layout">
                {/* Left Sidebar */}
                <div className="sidebar">
                <Link to="/"> <h3>Dashboard</h3></Link>
                    <div className="sidebar-item">
                        <FaPalette /> <Link to="/Enamels">Enamels</Link>
                    </div>
                    <div className="sidebar-item">
                        <MdFormatPaint /><Link to="/Emulsions"> Emulsions</Link>
                    </div>
                    <div className="sidebar-item">
                        <FaCubes /> <Link to="/Pipes"> Pipes </Link>
                    </div>
                    <div className="sidebar-item">
                        <FaFileInvoice /> <Link to="/Receipt"> Receipt </Link>
                    </div>
                    <div className="sidebar-item">
                        <FaFileAlt /> <Link to="/PReports"> Product Reports </Link>
                    </div>
                    <div className="sidebar-item">
                        <FaPlus /> <Link to="/AddLoans"> Add Loans </Link>
                    </div>
                    <div className="sidebar-item">
                        <FaUser /> <Link to="/Lpersons"> Loan Persons </Link>
                    </div>
                    </div>

                {/* Main Content */}
                <main className="content">
                    <Routes>
                        <Route path="/Emulsions" element={<ProductSelect />} />
                        <Route  path='/Enamels' Component={EnamelsBilling}/>
                        <Route  path='/Receipt' Component={Receipt}/>
                        <Route  path='/PReports' Component={ProductReport}/>
                        <Route path="/AddLoans" Component={AddLoan}/>
                        <Route path="/LoanProducts" Component={LoanPerson}/>
                        <Route path="/Pipes" Component={PiPes}/>
                        <Route path="Lpersons" Component={LoanPerson}/>
                        <Route 
  path="/" 
  element={
    <div className="dashboard-home">
     

      <section className="metrics-section">
        <div className="metric-card">
          <div className="metric-title">Total Enamels</div>
          <div className="metric-value">2,345</div>
          <div className="metric-change">+12%</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Total Loans</div>
          <div className="metric-value">$12,345</div>
          <div className="metric-change">+8%</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Active Borrowers</div>
          <div className="metric-value">456</div>
          <div className="metric-change">+5%</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Revenue</div>
          <div className="metric-value">$34,567</div>
          <div className="metric-change">+15%</div>
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
          <a href="#" className="view-all">View All</a>
        </div>
        <ul className="activities-list">
          <li className="activity-item">
            <span className="activity-text">New loan application</span>
            <span className="activity-time">2 hours ago</span>
          </li>
          <li className="activity-item">
            <span className="activity-text">John Doe submitted a loan application</span>
          </li>
          <li className="activity-item">
            <span className="activity-text">Product report generated</span>
            <span className="activity-time">4 hours ago</span>
          </li>
          <li className="activity-item">
            <span className="activity-text">Monthly report for Q1 2024</span>
          </li>
          <li className="activity-item">
            <span className="activity-text">New emulsion order</span>
            <span className="activity-time">5 hours ago</span>
          </li>
          <li className="activity-item">
            <span className="activity-text">Order #123 Premium Emulsion</span>
          </li>
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
