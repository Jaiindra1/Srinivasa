import { useState } from "react";
import { FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "./index.css";

const AddLoan = () => {
    const [formData, setFormData] = useState({
        candidateName: "",
        mobileNumber: "",
        loanProduct: "",
        address: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.candidateName || !formData.mobileNumber || !formData.loanProduct || !formData.address) {
            alert("Please fill in all required fields.");
            return;
        }
        console.log("Loan Details Submitted:", formData);
    };

    return (
        <div className="loan-container">
            <h2 className="loan-title">Add New Loan</h2>

            <form className="loan-form" onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="form-section">
                    <h3>Personal Information</h3>
                    <div className="input-group">
                        <label>Candidate Name *</label>
                        <div className="input-field">
                            <FaUser className="icon" />
                            <input type="text" name="candidateName" placeholder="Enter candidate name" value={formData.candidateName} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Mobile Number *</label>
                        <div className="input-field">
                            <FaPhone className="icon" />
                            <input type="tel" name="mobileNumber" placeholder="Enter mobile number" value={formData.mobileNumber} onChange={handleChange} required />
                        </div>
                    </div>
                </div>

                {/* Loan Details */}
                <div className="form-section">
                    <h3>Loan Details</h3>
                    <div className="input-group">
                        <label>Loan Products *</label>
                        <select name="loanProduct" value={formData.loanProduct} onChange={handleChange} required>
                            <option value="">Select loan product</option>
                            <option value="home-loan">Paints Loan</option>
                            <option value="car-loan">PVC or CPVC Loan</option>
                            <option value="business-loan">Electronics Loan</option>
                        </select>
                    </div>
                </div>

                {/* Site Address */}
                <div className="form-section">
                    <h3>Site Address</h3>
                    <div className="input-group">
                        <label>Complete Address *</label>
                        <div className="input-field">
                            <FaMapMarkerAlt className="icon" />
                            <textarea name="address" placeholder="Enter complete site address" value={formData.address} onChange={handleChange} required />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="submit-btn">Add Loan Details</button>
            </form>

            <footer> Loan Management System</footer>
        </div>
    );
};

export default AddLoan;
