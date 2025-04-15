import React, { useState, useEffect } from "react";
import "./index.css"; // Import the CSS file

const ProductBilling = () => {
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [size, setSize] = useState("");
  const [mrp, setMrp] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [billItems, setBillItems] = useState([]);

  const categories = ["CPVC", "UPVC"];

  const getApiUrl = (category) => `https://srinivasa-backend.onrender.com/${category.toLowerCase()}`;

  useEffect(() => {
    if (category) {
      fetch(getApiUrl(category))
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error("Failed to fetch products:", err));
    } else {
      setProducts([]);
    }

    // Reset all fields when category changes
    setSelectedProduct(null);
    setSize("");
    setMrp(0);
    setQuantity(1);
  }, [category]);

  const handleProductChange = (productName) => {
    if (!productName || !category) return;
  
    fetch(`https://srinivasa-backend.onrender.com/${category.toLowerCase()}/product/${encodeURIComponent(productName)}`)
      .then((res) => res.json())
      .then((data) => {
        // Filter the array for the selected product
        const filtered = data.filter(p => p.product_name === productName);
  
        if (filtered.length === 0) {
          console.warn("No matching products found for:", productName);
          return;
        }
  
        setSelectedProduct({
          productName: productName,
          priceList: filtered.map(p => ({
            size_inch: p.size_inch,
            mrp: p.mrp
          }))
        });
  
        setSize("");
        setMrp(0);
        setQuantity(1);
      })
      .catch((err) => console.error("Failed to fetch product details:", err));
  };

  const handleSizeChange = (selectedSize) => {
    setSize(selectedSize);

    // Find the matching price entry based on size
    const entry = selectedProduct?.priceList.find((item) => item.size_inch === selectedSize);
    setMrp(entry?.mrp || 0); // Set MRP based on selected size
  };

  const addToBill = () => {
    if (!selectedProduct || !size || mrp <= 0 || quantity <= 0) return;

    const newItem = {
      productName: selectedProduct.productName,
      size,
      mrp,
      quantity,
      subtotal: mrp * quantity,
    };

    setBillItems([...billItems, newItem]);

    // Reset fields for the next product
    setSelectedProduct(null);
    setSize("");
    setMrp(0);
    setQuantity(1);
  };

  const handleAddToReceipt = () => {
    const total = billItems.reduce((acc, item) => acc + item.subtotal, 0);
  
    localStorage.setItem(
      'SheenLacData',
      JSON.stringify({ todoList: billItems, total })
    );
  
    alert("Bill finalized and saved to localStorage!");
  
    // Clear the table and reset bill
    setBillItems([]);
    setSelectedProduct(null);
    setSize("");
    setMrp(0);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl mx-auto mt-10 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Product Billing</h2>

        {/* Category Dropdown */}
        <label className="block mb-1 font-semibold">Select Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Product Dropdown */}
        {products.length > 0 && (
          <>
            <label className="block ml-1 font-semibold">Select Product</label>
            <select
              value={selectedProduct ? selectedProduct.productName : ""}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-auto p-2 border mb-4 rounded"
            >
              <option value="">-- Select Product --</option>
              {products.map((product, idx) => (
                <option key={idx} value={product.productName}>
                  {product.productName}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Size and Quantity Fields */}
        {selectedProduct && selectedProduct.priceList.length > 0 && (
          <>
            <label className="block mb-1 font-semibold">Select Size (Inch)</label>
            <select
              value={size}
              onChange={(e) => handleSizeChange(e.target.value)}
              className="w-full p-2 border mb-2 rounded"
            >
              <option value="">-- Select Size --</option>
              {selectedProduct.priceList.map((entry, idx) => (
                <option key={idx} value={entry.size_inch}>
                  {entry.size_inch}
                </option>
              ))}
            </select>

            <div className="mb-2">
              <label className="w-full block mb-1 font-semibold">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-1 p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" // Changed to w-1/4
              />
            </div>

            <button
              onClick={addToBill}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow mt-2 transition duration-200"
            >
              Add to Table
            </button>

            <p className="text-sm text-gray-600 mt-2">
              Selected Size: {size || "None"}, MRP: ₹{mrp}
            </p>
          </>
        )}

        {/* Bill Table */}
        {billItems.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Bill Summary</h3>
            <table className="w-full border text-left shadow-sm rounded overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border p-2">Product</th>
                  <th className="border p-2">Size</th>
                  <th className="border p-2">MRP (₹)</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Subtotal (₹)</th>
                </tr>
              </thead>
              <tbody>
                {billItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{item.productName}</td>
                    <td className="border p-2">{item.size}</td>
                    <td className="border p-2">₹{item.mrp}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2 font-semibold">₹{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-blue-50">
                  <td colSpan="4" className="border p-2 text-right font-bold text-blue-800">
                    Total Amount
                  </td>
                  <td className="border p-2 font-bold text-green-700 text-lg">
                    ₹{billItems.reduce((acc, item) => acc + item.subtotal, 0)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <button
              onClick={handleAddToReceipt}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md transition duration-200"
            >
              Finalize Bill
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductBilling;
