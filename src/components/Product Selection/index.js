import { Component } from "react";
import './index.css';

class ProductSelect extends Component {
    state = {
        searchInput: "",
        data: [],
        filteredData: [],
        baseOptions: [],
        selectedBase: "",
        selectedLiters: "",
        selectedPrice: "",
        showDropdown: false,
        percentageIncrease: "",
        discount: "",
        selectedQuantity: "",
        todoList: [],
        editIndex: null
    };

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        try {
            const response = await fetch('https://srinivasa-backend.onrender.com/Products');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            const updateData = data.map(eachItem => ({
                id: eachItem.ProductId,
                company: eachItem.Company,
                productName: eachItem.ProductName,
            }));
            this.setState({ data: updateData, filteredData: updateData });
        } catch (error) {
            console.error("Failed to fetch data:", error.message);
        }
    };

    getBaseOptions = async (productId) => {
        try {
            if (!productId) return;
            const response = await fetch(`https://srinivasa-backend.onrender.com/BaseOptions/${productId}`);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const baseData = await response.json();
            const updateBase = baseData.map(eachItem => ({
                base: eachItem.BaseName,
                liters: eachItem.Liters,
                price: eachItem.Price,
            }));

            this.setState({ baseOptions: updateBase });
        } catch (error) {
            console.error("Failed to fetch base options:", error.message);
        }
    };

    handleSearch = (event) => {
        const searchInput = event.target.value.toLowerCase();
        const { data } = this.state;

        const filteredData = data.filter(product => 
            product.productName.toLowerCase().includes(searchInput)
        );

        this.setState({ searchInput: event.target.value, filteredData, showDropdown: true });
    };

    handleProductSelect = (productName, id) => {
        this.setState({
            searchInput: productName,
            selectedBase: "",
            selectedLiters: "",
            selectedPrice: "",
            showDropdown: false,
            baseOptions: []
        });
        this.getBaseOptions(id);
    };

    handleBaseSelect = (event) => {
        const selectedBase = event.target.value;
        this.setState({ selectedBase, selectedLiters: "", selectedPrice: "" });
    };
    
    handleLitersSelect = (event) => {
        const selectedLiters = event.target.value;
        const { baseOptions, selectedBase } = this.state;

        const selectedItem = baseOptions.find(base => base.base === selectedBase && base.liters === selectedLiters);
        
        this.setState({ selectedLiters, selectedPrice: selectedItem ? selectedItem.price : "N/A" });
    };

    handleQuantitySelect = (event) => {
        this.setState({ selectedQuantity: event.target.value });
    };
    
    handleAddTask = () => {
        const { searchInput, selectedBase, selectedLiters, selectedPrice, selectedQuantity, percentageIncrease, discount, todoList, data, editIndex } = this.state;
    
        if (searchInput.trim() !== "" && selectedBase && selectedLiters && selectedQuantity) {
            const selectedProduct = data.find(product => product.productName === searchInput);
            const company = selectedProduct ? selectedProduct.company : "Unknown";
    
            let basePrice = parseFloat(selectedPrice);
            let percentage = parseFloat(percentageIncrease) || 0;
            let quantity = parseInt(selectedQuantity, 10);
            let discountPercentage = parseFloat(discount) || 0;
    
            let finalPrice = basePrice + (basePrice * (percentage / 100));
            finalPrice *= quantity;
            finalPrice = finalPrice - (finalPrice * (discountPercentage / 100));
            finalPrice = finalPrice.toFixed(2);
    
            if (editIndex !== null) {
                todoList[editIndex] = {
                    company,
                    product: searchInput,
                    base: selectedBase,
                    liters: selectedLiters,
                    quantity,
                    price: finalPrice,
                    discount: `${discountPercentage}%`,
                    gst: `${percentage}%`
                };
            } else {
                todoList.push({
                    company,
                    product: searchInput,
                    base: selectedBase,
                    liters: selectedLiters,
                    quantity,
                    price: finalPrice,
                    discount: `${discountPercentage}%`,
                    gst: `${percentage}%`
                });
            }
    
            this.setState({
                todoList,
                searchInput: "",
                selectedBase: "",
                selectedLiters: "",
                selectedPrice: "",
                selectedQuantity: "",
                percentageIncrease: "",
                discount: "",
                baseOptions: [],
                editIndex: null
            });
        }
    };
    
    handleEditTask = (index) => {
        const item = this.state.todoList[index];
        this.setState({
            searchInput: item.product,
            selectedBase: item.base,
            selectedLiters: item.liters,
            selectedQuantity: item.quantity,
            percentageIncrease: item.gst.replace('%', ''),
            discount: item.discount.replace('%', ''),
            editIndex: index
        });
    };
    
    handleRemoveTask = (index) => {
        this.setState(prevState => ({
            todoList: prevState.todoList.filter((_, i) => i !== index)
        }));
    };

    calculateTotal = () => {
        return this.state.todoList.reduce((total, item) => total + parseFloat(item.price), 0);
    };

    render() {
        const { searchInput, filteredData, showDropdown, baseOptions, selectedBase, selectedLiters, todoList } = this.state;
        
        return (
            <div className="container">
                <h1 className="heading">Srinivasa Enterprises</h1>

                <input
                    className="item-list"
                    onChange={this.handleSearch}
                    value={searchInput}
                    placeholder="Search for a product..."
                />
                
                {showDropdown && filteredData.length > 0 && (
                    <ul className="dropdown">
                        {filteredData.map(product => (
                            <li key={product.id} onClick={() => this.handleProductSelect(product.productName, product.id)}>
                                {product.productName}
                            </li>
                        ))}
                    </ul>
                )}

                {baseOptions.length > 0 && (
                    <>
                        <select className="base-select" onChange={this.handleBaseSelect} value={selectedBase}>
                            <option value="" disabled>Select Base Option</option>
                            {baseOptions.map((baseItem, index) => (
                                <option key={index} value={baseItem.base}>{baseItem.base}</option>
                            ))}
                        </select>

                        {selectedBase && (
                            <select className="liters-select" onChange={this.handleLitersSelect} value={selectedLiters}>
                                <option value="" disabled>Select Liters</option>
                                {baseOptions
                                    .filter(baseItem => baseItem.base === selectedBase)
                                    .map((baseItem, index) => (
                                        <option key={index} value={baseItem.liters}>{baseItem.liters}</option>
                                    ))}
                            </select>
                        )}

                    {selectedLiters && (
                        <>
                            <select className="quantity-select" onChange={this.handleQuantitySelect} value={this.state.selectedQuantity}>
                                <option value="" disabled>Select Quantity</option>
                                {[0,1,2,3,4,5,6,7,8,9,10 ].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>

                            {/* 🔹 Input for Percentage Increase */}
                            <input 
                                type="number"
                                className="percentage-input"
                                placeholder="Enter % Increase"
                                value={this.state.percentageIncrease}
                                onChange={(e) => this.setState({ percentageIncrease: e.target.value })}
                            />

                        {/* Discount Input */}
                        <input 
                            type="number" 
                            className="discount-input" 
                            placeholder="Enter Discount %" 
                            value={this.state.discount} 
                            onChange={(e) => this.setState({ discount: e.target.value })} 
                        />

                        </>
                    )}
                    </>
                )}
                               <button className='form-submit' onClick={this.handleAddTask} disabled={!selectedBase || !selectedLiters}>
                    Add to List
                </button>
                <h2>Receipt</h2>
                        <table>
                         <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Company</th>
                                <th>Product</th>
                                <th>Base</th>
                                <th>Liters</th>
                                <th>Quantity</th>
                                <th>GST</th>
                                <th>Discount</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>

            <tbody>
                {todoList.map((task, index) => (
                     <tr key={index}>
                     <td>{index + 1}</td>
                     <td>{task.company}</td>
                     <td>{task.product}</td>
                     <td>{task.base}</td>
                     <td>{task.liters}</td>
                     <td>{task.quantity}</td>
                     <td>{task.gst}</td>
                     <td>{task.discount}</td>
                     <td>₹{task.price}</td>
                     
                     
                     <td><button className="remove" onClick={() => this.handleRemoveTask(index)}>Remove</button></td>
                 </tr>
                ))}
                {/* ✅ Add Total Row at the Bottom of the Table ✅ */}
                {this.state.todoList.map((task, index) => (
                            <tr key={index}>
                                <td>
                                    <button onClick={() => this.handleEditTask(index)}>Edit</button>
                                    <button onClick={() => this.handleRemoveTask(index)}>Remove</button>
                                </td>
                            </tr>
                        ))}
            </tbody>
        </table>
            </div>
        );
    }
}

export default ProductSelect;
