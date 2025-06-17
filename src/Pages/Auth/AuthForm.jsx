import React, { useState } from "react";
import axios from "axios";
import "./AuthForm.css";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import Spinner from "../../components/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "../../store/authSlice";

// Configure axios defaults
axios.defaults.withCredentials = true; 
axios.defaults.baseURL = 'http://127.0.0.1:8000';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [border, setBorder] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Where to redirect after login
  const from = location.state?.from?.pathname || "/home";

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post("/api/logout", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/home");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setBorder(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login flow
        const { data } = await axios.post("/api/login", {
          email: formData.email,
          password: formData.password,
        });

        const { access_token, user: u } = data;
        localStorage.setItem("token", access_token);

        dispatch(setCredentials({
          user: { 
            id: u.id, 
            name: u.name, 
            email: u.email,
            role: u.role // Include role in user data
          },
          token: access_token,
        }));

        // Check user role for redirect
        if (u.role === 'admin') {
          navigate("/home");
        } else {
          navigate(from);
        }
      } else {
        // Registration flow
        if (formData.password !== formData.password_confirmation) {
          setError("Passwords do not match");
          setBorder(true);
          setLoading(false);
          return;
        }

        await axios.post("/api/register", {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        });

        setIsLogin(true);
        setError("Registration successful! Please log in.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.response?.data?.message || "An error occurred.");
      setBorder(true);
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, show welcome + logout
  if (user) {
    return (
      <>
        <NavBar />
        <div className="auth-container">
          <div className="auth-form">
            <h2 className="form-title">Welcome back, {user.name}!</h2>
            <p>You are already logged in.</p>
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
          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="firstname">First Name</label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    placeholder="Enter your first name"
                    value={formData.firstname}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="Enter your last name"
                    value={formData.lastname}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
              </>
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
                disabled={loading}
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
                disabled={loading}
                required
                style={{ border: border ? "1px solid red" : undefined }}
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
                  disabled={loading}
                  required
                  style={{ border: border ? "1px solid red" : undefined }}
                />
              </div>
            )}

           

      <button
        type="submit"
        className={`submit-btn ${loading ? "loading" : ""}`}
        disabled={loading}
      >
        {loading
          ? <Spinner /* no overlay here! */ />
          : isLogin
            ? "Sign In"
            : "Create Account"}
      </button>

          </form>

          <button
            className="toggle-btn"
            onClick={toggleForm}
            disabled={loading}
          >
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