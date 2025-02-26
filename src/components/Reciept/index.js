import './index.css'
const Data = () =>{
    return (
        <>
            <h1> Srinivasa Enterprises </h1>
            <table>
                <thead>
                <tr>
                    <th>S.No</th>
                    <th>Company</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Discount</th>
                </tr>
                </thead>
               <tbody>
               <tr>
                    <td>1</td>
                    <td> Birla Opus</td>
                    <td>One Pure Elegance</td>
                    <td> 20L</td>
                    <td> 11,000</td>
                    <td> 20%</td>
                </tr>
               </tbody>
                
            </table>
            <p>Total: 11,000</p> 
            <button onClick="">add items</button>
        </>
    );
}
export default Data;