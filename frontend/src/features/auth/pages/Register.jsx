import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setUser, setError } from "../state/auth.slice";
import { registerUser } from "../services/auth.api"; // register API
import mentoLogo from "../../../assets/mentoai_logo.png";
import "../../../styles/Login.scss"; // reuse same styles

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setLocalError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setLocalError("");
  };

  const validateForm = () => {
    if (!formData.fullname.trim()) {
      setLocalError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setLocalError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError("Please enter a valid email");
      return false;
    }
    if (!formData.password) {
      setLocalError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setLocalError("");
    try {
      const response = await registerUser(
        formData.fullname,
        formData.email,
        formData.password
      );
      if (response.success) {
        dispatch(setUser(response.user));
        navigate("/", { replace: true });
      } else {
        setLocalError(response.message || "Registration failed");
        dispatch(setError(response.message || "Registration failed"));
      }
    } catch (err) {
      console.error("Register error:", err);
      setLocalError("An error occurred. Please try again.");
      dispatch(setError("An error occurred. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login">
      <div className="login__orb login__orb--1" />
      <div className="login__orb login__orb--2" />
      <div className="login__orb login__orb--3" />

      <div className="login__card">
        <div className="login__logo">
          <img src={mentoLogo} alt="MentoAI" className="login__logo-img" />
        </div>
        <p className="login__subtitle">
          Create your MentoAI account
        </p>
        <div className="login__divider"><span>Register</span></div>
        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__form-group">
            <label className="login__label" htmlFor="fullname">Full Name</label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              value={formData.fullname}
              onChange={handleInputChange}
              placeholder="Your Name"
              className="login__input"
              disabled={loading}
            />
          </div>
          <div className="login__form-group">
            <label htmlFor="email" className="login__label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="login__input"
              disabled={loading}
            />
          </div>
          <div className="login__form-group">
            <label htmlFor="password" className="login__label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••"
              className="login__input"
              disabled={loading}
            />
          </div>
          <div className="login__form-group">
            <label htmlFor="confirmPassword" className="login__label">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••"
              className="login__input"
              disabled={loading}
            />
          </div>
          {error && <div className="login__error-message">{error}</div>}
          <button type="submit" className="login__submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="login__terms">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
        <p className="login__switch">
          Already have an account? <a href="/login" className="login__link">Login</a>
        </p>
      </div>
      <div className="login__footer"><span>Built with ✦ MentoAI</span></div>
    </section>
  );
};

export default Register;
