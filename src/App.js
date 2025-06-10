import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './dashboard/DashboardLayout';
import Home from './dashboard/home';
import ProductTable from './dashboard/productstable.jsx';
import OrdersTable from './dashboard/OrdersTable.jsx';
import Analytics from './dashboard/Analytics.jsx';
import { LogIn } from 'lucide-react';
import AdminLogin from './dashboard/login.jsx';



function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path='login' element={< AdminLogin/>} />
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Home />} />
          <Route path="products" element={<ProductTable />} />
          <Route path="orders" element={<OrdersTable />} />
          <Route path="analytics" element={<Analytics />} />
      
        
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
