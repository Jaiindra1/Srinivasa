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
        percentageIncrease: "18",
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
        this.setState({ selectedBase: event.target.value, selectedLiters: "", selectedPrice: "" });
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
        const { searchInput, selectedBase, selectedLiters, selectedPrice, selectedQuantity, discount, todoList, data, editIndex } = this.state;
    
        if (searchInput.trim() !== "" && selectedBase && selectedLiters && selectedQuantity) {
            const selectedProduct = data.find(product => product.productName === searchInput);
            const company = selectedProduct ? selectedProduct.company : "Unknown";
    
            let basePrice = parseFloat(selectedPrice); // Use stored price
            let percentage = parseFloat(18) || 0; // GST (default 18%)
            let quantity = parseInt(selectedQuantity, 10);
            let discountPercentage = parseFloat(discount) || 0;
    
            let finalPrice = basePrice + (basePrice * (percentage / 100)); // Apply GST
            finalPrice *= quantity; // Apply quantity
            finalPrice = finalPrice - (finalPrice * (discountPercentage / 100)); // Apply discount
            finalPrice = finalPrice.toFixed(2);
    
            const updatedTask = {
                company,
                product: searchInput,
                base: selectedBase,
                liters: selectedLiters,
                quantity,
                price: finalPrice,
                discount: `${discountPercentage}%`,
                gst: `${percentage}%`
            };
    
            if (editIndex !== null) {
                todoList[editIndex] = updatedTask;
            } else {
                todoList.push(updatedTask);
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
            discount: item.discount.replace('%', ''), // Remove '%' for editing
            percentageIncrease: item.gst.replace('%', ''),
            selectedPrice: item.price,
            editIndex: index,
        });
    };
    
    
    handleSaveEdit = () => {
        const { editIndex, selectedQuantity, discount, todoList } = this.state;
    
        if (editIndex !== null) {
            let updatedTask = { ...todoList[editIndex] };
    
            // Extract old values
            let oldQuantity = parseInt(updatedTask.quantity, 10);
            let oldPrice = parseFloat(updatedTask.price.replace("₹", "")); // Convert ₹ to number
            let oldDiscount = parseFloat(updatedTask.discount.replace("%", "")) || 0; // Remove % and convert
    
            // Convert input values
            let newQuantity = parseInt(selectedQuantity, 10);
            let newDiscount = parseFloat(discount) || 0;
    
            // ✅ Step 1: If quantity increased, multiply by the original price per unit
            let finalPrice = oldPrice * (newQuantity / oldQuantity);
    
            // ✅ Step 2: If discount changed, apply new discount
            if (newDiscount !== oldDiscount) {
                let discountDifference = (oldDiscount - newDiscount) / 100;
                finalPrice = finalPrice * (1 + discountDifference); // Apply discount change
            }
    
            // Round to 2 decimal places
            finalPrice = finalPrice.toFixed(2);
    
            // Update the task in the list
            updatedTask.quantity = newQuantity;
            updatedTask.discount = `${newDiscount}%`;
            updatedTask.price = finalPrice; // ✅ Remove ₹ to avoid duplicate currency symbols
    
            let updatedList = [...todoList];
            updatedList[editIndex] = updatedTask;
    
            // ✅ Set state and ensure total updates
            this.setState({
                todoList: updatedList,
                editIndex: null, // Exit edit mode
                selectedPrice: finalPrice,
            }, () => {
                console.log("Updated List:", updatedList);
                console.log("New Total:", this.calculateTotal()); // Debugging
            });
        }
    };
    
    
    handleRemoveTask = (index) => {
        this.setState(prevState => ({
            todoList: prevState.todoList.filter((_, i) => i !== index),
            editIndex: null
        }));
    };
    calculateTotal = () => {
        const total = this.state.todoList.reduce((sum, item) => {
            let itemPrice = parseFloat(item.price) || 0;
            return sum + itemPrice;
        }, 0);
    
        return total.toFixed(2);
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
                                {[1,2,3,4,5,6,7,8,9,10 ].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        <br/>
                        {/* Discount Input */}
                        <input 
                            type="" 
                            className="quantity-select discount-input" 
                            placeholder="Enter Discount %" 
                            value={this.state.discount} 
                            onChange={(e) => this.setState({ discount: e.target.value })} 
                        />

                        </>
                    )}
                    </>
                )}
                <br></br>
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
            <td className="product">{task.product}-{task.base}-{task.liters}</td>
            <td>
                {this.state.editIndex === index ? (
                    <input
                        type="text"
                        className="quantity"
                        value={this.state.selectedQuantity}
                        onChange={(e) => this.setState({ selectedQuantity: e.target.value })}
                    />
                ) : (
                    task.quantity
                )}
            </td>
            <td>{task.gst}</td>
            <td>
                {this.state.editIndex === index ? (
                    <input
                        type="text"
                        className="discount"
                        value={this.state.discount}
                        onChange={(e) => this.setState({ discount: e.target.value })}
                    />
                ) : (
                    task.discount
                )}
            </td>
            <td>{task.price}</td>
            <td>
                {this.state.editIndex === index ? (
                    <button onClick={this.handleSaveEdit}>Done</button>
                ) : (
                    <>
                        <button className="Edit" onClick={() => this.handleEditTask(index)}>Edit</button>
                        <br></br>
                        <button className="remove" onClick={() => this.handleRemoveTask(index)}>Remove</button>
                    </>
                )}
            </td>
        </tr>
        
    ))}
     <tr>
                <td colSpan="6" className="total-label"><strong>Total:</strong></td>
                <td colSpan="2"><p className="column-3">{this.calculateTotal()}</p></td>
                </tr>
</tbody>

        </table>
            </div>
        );
    }
}

export default ProductSelect;
