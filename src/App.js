import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './dashboard/DashboardLayout';
import Home from './dashboard/home';
import ProductTable from './dashboard/productstable.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Home />} />
          <Route path="products" element={<ProductTable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
