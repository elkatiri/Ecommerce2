import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Store from "./Pages/Store/Store";
import Cart from "./Pages/Cart/Cart";
import Checkout from "./Pages/Checkout/Checkout";
import Contact from "./Pages/Contact/Contact";
import AuthForm from "./Pages/Auth/AuthForm";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import About from "./Pages/About/About";
import Blog from "./Pages/Blog/Blog";
import Orders from "./Pages/Orders/Orders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
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
    </Router>
  );
}
export default App;
