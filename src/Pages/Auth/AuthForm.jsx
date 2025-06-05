import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AuthForm.css";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import Spinner from "../../components/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "../../store/authSlice";

// Configure axios defaults
axios.defaults.withCredentials = true; // Important for Sanctum
axios.defaults.baseURL = 'http://127.0.0.1:8000';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [border, setBorder] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      dispatch(setCredentials({
        user: {
          name: response.data.name,
          email: response.data.email,
          is_admin: response.data.is_admin
        },
        token: token
      }));

      // Redirect to the saved path or dashboard for admin
      if (response.data.is_admin) {
        navigate("/dashboard/products");
      } else {
        navigate(from);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post("/api/logout", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage and Redux state
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("email");
      dispatch(logout());
      navigate("/");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleForm = () => {
    setIsLogin((prevState) => !prevState);
    setBorder(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const response = await axios.post("/api/login", {
          email: formData.email,
          password: formData.password,
        });

        const { token, user } = response.data;
        
        // Store auth data
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("email", user.email);

        // Update Redux store with credentials
        dispatch(setCredentials({
          user: {
            name: user.name,
            email: user.email,
            is_admin: user.is_admin
          },
          token: token
        }));

        // Redirect based on user role and saved path
        if (user.is_admin) {
          navigate("/dashboard/products");
        } else {
          navigate(from);
        }
      } else {
        // Registration
        if (formData.password !== formData.password_confirmation) {
          setError("Passwords do not match");
          setBorder(true);
          return;
        }

        await axios.post("/api/register", formData);
        setIsLogin(true);
        setError("Registration successful! Please login.");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
      setBorder(true);
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, show a message
  if (user) {
    return (
      <>
        <NavBar />
        <div className="auth-container">
          <div className="auth-form">
            <h2 className="form-title">Welcome back, {user.name}!</h2>
            <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
              You are already logged in.
            </p>
            <button onClick={handleLogout} className="submit-btn">
              Logout
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="auth-container">
        <div className={`auth-form ${isLogin ? "fade-in-bottom" : "fade-in-top"}`}>
          <h2 className="form-title">{isLogin ? "Sign In" : "Sign Up"}</h2>
          {loading && <Spinner />}
          {error && <p className="error-text">{error}</p>}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ border: border ? "1px solid red" : "1px solid #ccc" }}
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="password_confirmation">Confirm Password</label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  placeholder="Confirm your password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  style={{
                    border: border ? "1px solid red" : "1px solid #ccc",
                  }}
                />
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <button className="toggle-btn" onClick={toggleForm} disabled={loading}>
            {isLogin
              ? "Need an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthForm;
