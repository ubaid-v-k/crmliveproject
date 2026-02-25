import { useState } from "react";
import { loginUser } from "../api/authService";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import { toast } from "react-toastify";
import FormField from "../components/form/FormField";

export default function Login() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Please enter email before signing in";
    if (!form.password) newErrors.password = "Please enter password";
    return newErrors;
  };

  const submit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting login with:", form.email); // Debug
      const res = await loginUser(form);
      console.log("Login result:", res); // Debug

      if (!res.success) {
        setGlobalError(res.message || "Email or password incorrect");
        toast.error(res.message || "Login failed");
      } else {
        // toast.success("Login successful!"); // Removed as per request
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setGlobalError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="auth-card p-4" style={{ width: 360 }}>
        <h4 className="text-center mb-3">Log in</h4>

        {globalError && <div className="alert alert-danger">{globalError}</div>}

        <form onSubmit={submit}>
          <FormField
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            error={errors.email}
            required
          />

          <FormField
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
            error={errors.password}
            required
            className="form-control auth-input mb-2"
          />

          {/* Forgot password */}
          <div className="text-end mb-3">
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn auth-btn w-100" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center mt-3">
          Don’t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
