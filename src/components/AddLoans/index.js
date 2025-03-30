import { useEffect, useState } from "react";
import { FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "./index.css";

const AddLoan = () => {
    const [formData, setFormData] = useState({
        candidateName: "",
        mobileNumber: "",
        loanProduct: "",
        address: "",
        EmulsionsData: [],
        createdAt: new Date().toISOString().slice(0, 19).replace("T", " ")
    });

    // Fetch stored data on component mount
    useEffect(() => {
        const emulsionsData = JSON.parse(localStorage.getItem("EmulsionData")) || { todoList: [] };
        const enamelsData = JSON.parse(localStorage.getItem("Enamels_Data")) || { todoList: [] };
        const sheenLacData = JSON.parse(localStorage.getItem("SheenLacData")) || { todoList: [] };

        // Merge all lists
        const combinedTodoList = [
            ...emulsionsData.todoList,
            ...enamelsData.todoList,
            ...sheenLacData.todoList
        ];

        // Set initial state with merged data
        setFormData((prevState) => ({
            ...prevState,
            EmulsionsData: combinedTodoList
        }));
    }, []);

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };

        if (name === "loanProduct" && value === "Paints-loan") {
            const emulsionsData = JSON.parse(localStorage.getItem("EmulsionData")) || { todoList: [] };
            const enamelsData = JSON.parse(localStorage.getItem("Enamels_Data")) || { todoList: [] };
            const sheenLacData = JSON.parse(localStorage.getItem("SheenLacData")) || { todoList: [] };

            const combinedTodoList = [
                ...emulsionsData.todoList,
                ...enamelsData.todoList,
                ...sheenLacData.todoList
            ];

            updatedFormData = { 
                ...updatedFormData, 
                EmulsionsData: combinedTodoList 
            };
        }

        setFormData(updatedFormData);
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.candidateName || !formData.mobileNumber  ) {
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
            console.log("Server Response:", data);

            if (response.ok) {
                alert("Loan details submitted successfully!");
                
                // Remove only loan-related data from localStorage
                localStorage.removeItem("EmulsionData");
                localStorage.removeItem("Enamels_Data");
                localStorage.removeItem("SheenLacData");

                // Reset form fields
                setFormData({ candidateName: "", mobileNumber: "", loanProduct: "", address: "", EmulsionsData: [] });
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
                    
                    {/* Display Receipt Data By Default */}
                    {formData.EmulsionsData.length > 0 && (
                        <div className="form-section">
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
                                        {formData.EmulsionsData.map((item, index) => (
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
