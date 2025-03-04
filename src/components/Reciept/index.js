import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react"; 
import { useState, useEffect, useRef } from "react";
import "./index.css";

function Receipt() {
    const location = useLocation();
    const { todoList, total } = location.state || { todoList: [], total: "0.00" };

    // UPI Payment Details
    const upiId = "8712923222@ybl";
    const upiPaymentUrl = `upi://pay?pa=${upiId}&pn=Shop&tn=Bill Payment&am=${total}&cu=INR`;

    // State to check if payment is done
    const [isPaid, setIsPaid] = useState(false);
    const intervalRef = useRef(null); // ✅ Declare intervalRef properly

    const checkPaymentStatus = async () => {
        try {
            const response = await fetch("https://srinivasa-backend.onrender.com/payment-status");
            const data = await response.json();
            if (data.isPaid) {
                setIsPaid(true);
                clearInterval(intervalRef.current); // ✅ Stop interval after payment
            }
        } catch (error) {
            console.error("Error checking payment status:", error);
        }
    }; // ✅ Close function properly

    // Check payment status every 5 seconds
    useEffect(() => {
        intervalRef.current = setInterval(checkPaymentStatus, 5000); // ✅ Store interval
        return () => clearInterval(intervalRef.current); // ✅ Cleanup on unmount
    }, []);

    return (
        <div className="receipt-container">
            <h1 className="receipt-title">Receipt</h1>
            <table className="receipt-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Base</th>
                        <th>Liters</th>
                        <th>Quantity</th>
                        <th>Discount</th>
                        <th>GST</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {todoList.map((item, index) => (
                        <tr key={index}>
                            <td>{item.product}</td>
                            <td>{item.base}</td>
                            <td>{item.liters}</td>
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

            {/* Show QR Code if payment is not done */}
            {!isPaid ? (
                <div className="qr-section">
                    <h3>Scan to Pay</h3>
                    <QRCodeCanvas value={upiPaymentUrl} size={200} />
                    <p>Scan this QR code using any UPI app to complete the payment.</p>
                </div>
            ) : (
                <div className="payment-done">
                    <h2>✅ Payment Completed</h2>
                    <p>Thank you! Your payment has been received.</p>
                </div>
            )}
        </div>
    );
}

export default Receipt;
