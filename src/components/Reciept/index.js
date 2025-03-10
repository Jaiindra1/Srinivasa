import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { useState, useEffect, useRef } from "react";
import "./index.css";

function Receipt() {
    const location = useLocation();
    const { todoList, total } = location.state || { todoList: [], total: "0.00" };

    const upiId = "8712923222@ybl"; // Replace with backend UPI ID
    const upiPaymentUrl = `upi://pay?pa=${upiId}&pn=Shop&tn=Bill Payment&am=${total}&cu=INR`;

    const [isPaid, setIsPaid] = useState(false);
    const intervalRef = useRef(null);

     const checkPaymentStatus = async () => {
        try {
            const response = await fetch("https://srinivasa-backend.onrender.com/payment-status");
            const data = await response.json();
            if (data.isPaid) {
                setIsPaid(true);
                clearInterval(intervalRef.current);
            }
        } catch (error) {
            console.error("Error checking payment status:", error);
        }
    };

    useEffect(() => {
        intervalRef.current = setInterval(checkPaymentStatus, 5000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const handleManualConfirmation = async () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
        const formattedTime = currentDate.toLocaleTimeString(); // HH:MM:SS AM/PM
        const currentYear = currentDate.getFullYear();
    
        const billData = {
            todoList,
            total,
            date: formattedDate,
            time: formattedTime,
            year: currentYear,
        };
    
        console.log("Sending bill data:", billData); // Debugging output
    
        try {
            await fetch("http://localhost:5000/save-bill", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(billData),
            });
    
            setIsPaid(true);
            clearInterval(intervalRef.current);
        } catch (error) {
            console.error("Error saving bill:", error);
        }
    };
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="receipt-container">
            <h1 className="receipt-title">Receipt</h1>
            <table className="receipt-table">
                <thead>
                    <tr>
                       <th>Product</th>
                        <th>Quantity</th>
                        <th>Discount</th>
                        <th>GST</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {todoList.map((item, index) => (
                        <tr key={index}>
                            <td>{item.product}_{item.base} -{item.liters}</td>
                            <td>{item.quantity}</td>
                            <td>{item.discount}</td>
                            <td>{item.gst}</td>
                            <td>₹{item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="receipt-total">
                <h2>Total: ₹{total}</h2>
            </div>

            {!isPaid ? (
                <div className="qr-section">
                    <h3>Scan to Pay</h3>
                    <QRCodeCanvas value={upiPaymentUrl} size={100} />
                    <p>Scan this QR code using any UPI app to complete the payment.</p>
                    <button onClick={handleManualConfirmation}>✅ Mark as Paid</button>
                </div>
            ) : (
                <div className="payment-done">
                    <h2>✅ Payment Completed</h2>
                    <p>Your payment has been received.</p>
                </div>
            )}

            {/* Print Button */}
            <div className="print-section">
                <button onClick={handlePrint}>🖨️ Print Receipt</button>
            </div>
        </div>
    );
}

export default Receipt;
