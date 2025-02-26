import Data from './components/Reciept/index.js';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProductSelect from './components/Product Selection/index.js';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route  path='/' Component={ProductSelect}/>
          <Route  path='/Reciept' Component={Data}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
