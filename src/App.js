import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './dashboard/DashboardLayout.jsx';
import DashboardHome from './dashboard/homedash.jsx';
import ProductTable from './dashboard/productstable.jsx';
import OrdersTable from './dashboard/OrdersTable.jsx';
import Analytics from './dashboard/Analytics.jsx';
import { LogIn } from 'lucide-react';
import AdminLogin from './dashboard/login.jsx';
import Blog from './Pages/Blog/Blog.jsx';
import Store from './Pages/store/store.jsx';
import ProductDetails from './components/ProductDetails/ProductDetails.jsx';
import Cart from './Pages/Cart/Cart.jsx';
import Checkout from './Pages/Checkout/Checkout.jsx';
import About from './Pages/About/About.jsx';
import AuthForm from './Pages/Auth/AuthForm.jsx';
import Orders from './Pages/Orders/Orders.jsx';
import Home from './Pages/Home/Home.jsx';
import Contact from './Pages/Contact/Contact.jsx';
import MessagesList from './dashboard/messagesTable.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='login' element={<AdminLogin/>} />
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Analytics />} />
          <Route path="products" element={<ProductTable />} />
          <Route path="dashboard/orders" element={<OrdersTable />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="/messages" element={<MessagesList />} />

        </Route>
        <Route path='/home' element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/category/:category" element={<Store />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/check-out" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;