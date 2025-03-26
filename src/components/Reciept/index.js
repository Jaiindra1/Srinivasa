import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./index.css";

const Receipt = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [receiptData, setReceiptData] = useState({ todoList: [], total: "0.00" });
    const [isPaid, setIsPaid] = useState(false);
    const intervalRef = useRef(null);

    // UPI Payment Setup
    const upiId = "mi4233715@okaxis"; // Replace with backend UPI ID
    const upiPaymentUrl = `upi://pay?pa=${upiId}&pn=Shop&tn=Bill Payment&am=${receiptData.total}&cu=INR`;

    // Fetch Data from State or LocalStorage
   // Fetch Data from State or LocalStorage
useEffect(() => {
    let emulsionsData = JSON.parse(localStorage.getItem("EmulsionData")) || { todoList: [], total: "0.00" };
    let enamelsData = JSON.parse(localStorage.getItem("Enamels_Data")) || { todoList: [], total: "0.00" };
    let sheenLacData = JSON.parse(localStorage.getItem("SheenLacData")) || { todoList: [], total: "0.00" };

    // Merge all lists and calculate the new total
    const combinedTodoList = [
        ...emulsionsData.todoList, 
        ...enamelsData.todoList, 
        ...sheenLacData.todoList
    ];
    
    const combinedTotal = (
        parseFloat(emulsionsData.total || 0) + 
        parseFloat(enamelsData.total || 0) + 
        parseFloat(sheenLacData.total || 0)
    ).toFixed(2);

    setReceiptData({ todoList: combinedTodoList, total: combinedTotal });
}, []);

    

    // Periodically Check Payment Status
    const checkPaymentStatus = async () => {
        try {
            const response = await fetch("https://srinivasa-backend.onrender.com/payment-status");
            const data = await response.json();
            if (data.isPaid) {
                handlePaymentSuccess();
            }
        } catch (error) {
            console.error("Error checking payment status:", error);
        }
    };

    useEffect(() => {
        intervalRef.current = setInterval(checkPaymentStatus, 5000);
        return () => clearInterval(intervalRef.current);
    }, []);

    // Handle Payment Success
    const handlePaymentSuccess = () => {
        setIsPaid(true);
        localStorage.removeItem("EmulsionData"); // Clear stored receipt data
        localStorage.removeItem("Enamels_Data");
        setReceiptData({ todoList: [], total: "0.00" }); // Reset state
        clearInterval(intervalRef.current);
    };

    // Handle Manual Payment Confirmation
    const handleManualConfirmation = async () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
        const formattedTime = currentDate.toLocaleTimeString(); // HH:MM:SS AM/PM
        const currentYear = currentDate.getFullYear();

        const billData = {
            todoList: receiptData.todoList,
            total: receiptData.total,
            date: formattedDate,
            time: formattedTime,
            year: currentYear,
        };

        try {
            await fetch("https://srinivasa-backend.onrender.com/save-bill", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(billData),
            });

            handlePaymentSuccess(); // Clear data after saving bill
        } catch (error) {
            console.error("Error saving bill:", error);
        }
    };

    // Handle Print Receipt
    // Handle Print Receipt
    const handlePrint = () => {
        const printContent = document.querySelector(".receipt-table").outerHTML; // Get table
        const totalAmount = document.querySelector(".receipt-total").outerHTML; // Get total amount
        const qrCanvas = document.querySelector("canvas"); // Get QR code canvas
    
        if (!qrCanvas) {
            alert("QR code not found!");
            return;
        }
    
        const qrDataUrl = qrCanvas.toDataURL(); // Convert QR code to image
    
        const newWindow = window.open("", "_blank");
    
        newWindow.document.write(`
            <html>
                <head>
                    <title>Receipt</title>
                    <style>
                        @media print {
                            body { font-family: Arial, sans-serif; margin: 20px; text-align: center; }
                            .receipt-container { width: 100%; max-width: 600px; margin: auto; padding: 20px; text-align: left; }
                            .receipt-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            .receipt-table th, .receipt-table td { border: 1px solid #000; padding: 8px; text-align: center; }
                            .receipt-total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
                            .qr-section { text-align: center; margin-top: 20px; }
                            .qr-section img { width: 150px; height: 150px; }
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt-container">
                        <h1>Receipt</h1>
                        ${printContent}  <!-- Table Data Only -->
                        ${totalAmount}    <!-- Total Amount -->
    
                        <div class="qr-section">
                            <h3>Scan to Pay</h3>
                            <img src="${qrDataUrl}" alt="QR Code" />
                        </div>
                    </div>
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(() => window.close(), 500);
                        };
                    </script>
                </body>
            </html>
        `);
    
        newWindow.document.close();
    };
    
    
    
    

    // Handle Missing Receipt Data
    if (!receiptData.todoList || receiptData.todoList.length === 0) {
        return (
            <div className="error-message">
                <h2 className="status">Error: No Receipt Data Found!</h2>
            </div>
        );
    }

    return (

        <div className="receipt-container" id="printable-receipt">
            <h1 className="receipt-title">Receipt</h1>

            <table className="receipt-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Discount</th>
                        <th>GST</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {receiptData.todoList.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.product}_{item.base} - {item.liters}</td>
                            <td>{item.quantity}</td>
                            <td>{item.discount}%</td>
                            <td>{item.gst}%</td>
                            <td>₹{item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="receipt-total">
                <h2>Total: ₹{receiptData.total}</h2>
            </div>

            {!isPaid ? (
                <div className="qr-section">
                    <h3>Scan to Pay</h3>
                    <QRCodeCanvas value={upiPaymentUrl} size={120} />
                    <p>Scan this QR code using any UPI app to complete the payment.</p>
                    <button onClick={handleManualConfirmation}>✅ Mark as Paid</button>
                </div>
            ) : (
                <div className="payment-done">
                    <h2>✅ Payment Completed</h2>
                    <p>Your payment has been received.</p>
                </div>
            )}

            <div className="print-section">
                <button onClick={handlePrint}>🖨️ Print Receipt</button>
            </div>
        </div>
    );
};

export default Receipt;
