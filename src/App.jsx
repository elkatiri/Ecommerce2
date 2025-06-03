import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Store from "./Pages/Store/Store";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/category/:category" element={<Store />} />
        <Route path="/blog" element={<h1>Blog</h1>} />
        <Route path="/contact" element={<h1>Contact Us</h1>} />
        <Route path="/about" element={<h1>About</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
