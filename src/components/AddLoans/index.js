
import { useState } from "react";
import { FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "./index.css";

const AddLoan = () => {
    const [formData, setFormData] = useState({
        candidateName: "",
        mobileNumber: "",
        loanProduct: "",
        address: "",
        EmulsionsData: "",
        createdAt: new Date().toISOString().slice(0, 19).replace("T", " ")
    });

    // Handle Input Change
    // Handle Input Change
const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    // If "Paints Loan" is selected, fetch and display Emulsions Data from localStorage
    if (name === "loanProduct" && value === "Paints-loan") {
        const emulsionsData = localStorage.getItem("EmulsionData");
        if (emulsionsData) {
            const parsedData = JSON.parse(emulsionsData);
            updatedFormData = { ...updatedFormData, EmulsionsData: parsedData };
        }
    } else {
        // Clear EmulsionsData if another loan product is selected
        updatedFormData.EmulsionsData = "";
    }

    setFormData(updatedFormData);
};


    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.candidateName || !formData.mobileNumber || !formData.loanProduct || !formData.address || !formData.createdAt) {
            alert("Please fill in all required fields.");
            return;
        }
    
        try {
            const response = await fetch("https://srinivasa-backend.onrender.com/add-loan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            console.log("Server Response:", data); // Debugging line 🔍
    
            if (response.ok) {
                alert("Loan details submitted successfully!"); // ✅ This should work
                localStorage.clear(); // Clear local storage after submission
                setFormData({ candidateName: "", mobileNumber: "", loanProduct: "", address: "", EmulsionsData: "" });
            } else {
                alert("Error: " + (data.error || "Something went wrong"));
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit loan details. Please try again.");
        }
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
                            <input
                                type="text"
                                name="candidateName"
                                placeholder="Enter candidate name"
                                value={formData.candidateName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Mobile Number *</label>
                        <div className="input-field">
                            <FaPhone className="icon" />
                            <input
                                type="tel"
                                name="mobileNumber"
                                placeholder="Enter mobile number"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                required
                            />
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
                            <option value="Paints-loan">Paints Loan</option>
                            <option value="car-loan">PVC or CPVC Loan</option>
                            <option value="business-loan">Electronics Loan</option>
                        </select>
                    </div>
                    {/* Display Emulsions Data if available */}
                    {formData.loanProduct === "Paints-loan" && formData.EmulsionsData && (
                        <div className="form-section">
                            <h3>Emulsions Data</h3>
                            <div className="input-group">
                            <table className="emulsions-table">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                {formData.EmulsionsData.todoList.map((item, index) => (
                    <tr key={index}>
                        <td>{index + 1}.</td>
                        <td>{item.product}_{item.base} - {item.liters}</td>
                        <td>{item.quantity}</td>
                        <td>₹ {item.price}</td>
                    </tr>
                ))}
            </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Site Address */}
                <div className="form-section">
                    <h3>Site Address</h3>
                    <div className="input-group">
                        <label>Complete Address *</label>
                        <div className="input-field">
                            <FaMapMarkerAlt className="icon" />
                            <textarea
                                name="address"
                                placeholder="Enter complete site address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
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
