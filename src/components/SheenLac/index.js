import { Component } from "react";
import { useNavigate } from "react-router-dom";
import './index.css';

class SheenLacBilling extends Component {
     state = {
        searchInput: "",
        data: [],
        filteredData: [],
        baseOptions: [],
        selectedLiters: "",
        selectedPrice: "",
        showDropdown: false,
        percentageIncrease: "18",
        discount: "",
        selectedQuantity: "",
        todoList: [],
        editIndex: null,
        showReceipt: false, // Controls receipt visibility
    };
    

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        try {
            const response = await fetch('https://srinivasa-backend.onrender.com/SheenLac');
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
            const response = await fetch(`https://srinivasa-backend.onrender.com/SheenLac/${productId}`);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const baseData = await response.json();
            const updateBase = baseData.map(eachItem => ({
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

    
    
    handleLitersSelect = (event) => {
        const selectedLiters = event.target.value;
        const { baseOptions } = this.state;
        const selectedItem = baseOptions.find(base =>  base.liters === selectedLiters);
        
        this.setState({ selectedLiters, selectedPrice: selectedItem ? selectedItem.price : "N/A" });
    };

    handleQuantitySelect = (event) => {
        this.setState({ selectedQuantity: event.target.value });
    };
    
    handleAddTask = () => {
        const { searchInput, selectedLiters, selectedPrice, selectedQuantity, discount, todoList, data, editIndex } = this.state;
    
        if (searchInput.trim() !== ""  && selectedLiters && selectedQuantity) {
            const selectedProduct = data.find(product => product.productName === searchInput);
            const company = selectedProduct ? selectedProduct.company : "Unknown";
    
            let basePrice = parseFloat(selectedPrice); // Use stored price
            let quantity = parseInt(selectedQuantity, 10);
            let discountPercentage = parseFloat(discount) || 0;
    
            let finalPrice = basePrice // Apply GST
            finalPrice *= quantity; // Apply quantity
            finalPrice = finalPrice - (finalPrice * (discountPercentage / 100)); // Apply discount
            finalPrice = finalPrice.toFixed(2);
    
            const updatedTask = {
                company,
                product: searchInput,
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
                selectedLiters: "",
                selectedPrice: "",
                selectedQuantity: "",
                percentageIncrease: "",
                discount: discount,
                baseOptions: [],
                editIndex: null
            });
        }
    };
    
    handleEditTask = (index) => {
        const item = this.state.todoList[index];
    
        this.setState({
            searchInput: item.product,
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
    handleGenerateReceipt = () => {
        this.setState({ showReceipt: true });
    };
    handleAddToReceipt = () => {
        const { todoList } = this.state;
        const total = this.calculateTotal();
    
        if (todoList.length === 0) {
            alert("No items to add to receipt!");
            return;
        }
    
        // Store data in localStorage
        localStorage.setItem('SheenLacData', JSON.stringify({ todoList, total }));
    
        // Reset state
        this.setState({
            todoList: [],
            searchInput: "",
            selectedBase: "",
            selectedLiters: "",
            selectedPrice: "",
            selectedQuantity: "",
            percentageIncrease: "18",
            discount: "",
            baseOptions: [],
            editIndex: null,
            showReceipt: false
        });
    };    
    

    render() {
        const { searchInput, filteredData, showDropdown, baseOptions, selectedLiters, todoList } = this.state;
        const uniqueLiters = [...new Set(baseOptions.map(item => item.liters))];


        return (
            <div className="container">
                <h1 className="heading">SheenLac Materials</h1>

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
                         <>
                            <select className="liters-select" onChange={this.handleLitersSelect} value={selectedLiters}>
                                <option value="" disabled>Select Liters</option>
                                {uniqueLiters.map((baseItem, index) => (
                                    <option key={index} value={baseItem.liters}>{baseItem}</option>
                                ))}
                            </select>
                        </>

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
                <button className='form-submit' onClick={this.handleAddTask} disabled={!selectedLiters}>
                    Add to List
                </button>
                <h2>List</h2>
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

         {/* Button to Navigate to Receipt Page */}
         <button onClick={this.handleAddToReceipt}>
    Final Data
</button>

            </div>
        );
    }
}

export default function SheenLacBillingWrapper(props) {
    const navigate = useNavigate();
    return <SheenLacBilling {...props} navigate={navigate} />;
}
