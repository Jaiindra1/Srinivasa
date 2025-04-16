import React, { useState, useEffect } from "react";
import "./index.css";

const TanksBilling = () => {
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [billingItems, setBillingItems] = useState([]);

  const categories = ["3 Layer", "4 Layer"];

  const getApiUrl = (category) => {
    const formatted = category.toLowerCase().replace(" ", "-");
    return `http://localhost:5000/${formatted}`;
  };

  useEffect(() => {
    if (category) {
      fetch(getApiUrl(category))
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setFilteredProducts(data);
          setSelectedColor("");
          setSelectedCapacity("");
        })
        .catch((err) => console.error("Error fetching products:", err));
    } else {
      setProducts([]);
      setFilteredProducts([]);
    }
  }, [category]);

  useEffect(() => {
    let result = products;

    if (selectedColor) {
      result = result.filter((item) => item.color === selectedColor);
    }
    if (selectedCapacity) {
      result = result.filter(
        (item) => String(item.capacity_ltr) === selectedCapacity
      );
    }

    setFilteredProducts(result);
  }, [selectedColor, selectedCapacity, products]);

  const handleAddProduct = () => {
    const product = products.find(
      (item) =>
        item.color === selectedColor &&
        String(item.capacity_ltr) === selectedCapacity
    );

    if (product) {
      setBillingItems([...billingItems, product]);
    } else {
      alert("Please select valid Color and Capacity.");
    }
  };

  const uniqueColors = [...new Set(products.map((item) => item.color))];
  const uniqueCapacities = [
    ...new Set(products.map((item) => String(item.capacity_ltr))),
  ];

  return (
    <div className="billing-container">
      <h2>Select Tank Category</h2>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="dropdown"
      >
        <option value="">-- Select Category --</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {products.length > 0 && (
        <>
          <div className="filter-row">
            <label className="color">
              Color:
            </label>
            <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                <option value="">All</option>
                {uniqueColors.map((color, idx) => (
                  <option key={idx} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            <label>
              Capacity (Ltr):
            </label>
            <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
              >
                <option value="">All</option>
                {uniqueCapacities.map((cap, idx) => (
                  <option key={idx} value={cap}>
                    {cap}
                  </option>
                ))}
              </select>

            <button onClick={handleAddProduct} className="add-btn">
              Add
            </button>
          </div>

          
        </>
      )}

      {billingItems.length > 0 && (
        <>
          <h3>Billing Table</h3>
          <table className="product-table billing-table">
            <thead>
              <tr>
                <th>Capacity (Ltr)</th>
                <th>Color</th>
                <th>Diameter (mm)</th>
                <th>Height (mm)</th>
                <th>Manhole Dia (mm)</th>
                <th>MRP</th>
              </tr>
            </thead>
            <tbody>
              {billingItems.map((tank, index) => (
                <tr key={index}>
                  <td>{tank.capacity_ltr}</td>
                  <td>{tank.color}</td>
                  <td>{tank.diameter_mm}</td>
                  <td>{tank.height_mm}</td>
                  <td>{tank.manhole_dia_mm}</td>
                  <td>₹{tank.mrp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default TanksBilling;
