import { useState } from "react";
import { registerUser } from "../api/authService";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import FormField from "../components/form/FormField";

export default function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
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
      const res = await registerUser(form);

      if (!res.success) {
        setGlobalError(res.message || "Registration failed");
        toast.error(res.message || "Registration failed");
      } else {
        toast.success("Registration successful! Please log in.");
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setGlobalError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="auth-card p-5 w-100" style={{ maxWidth: 800 }}>
        <h3 className="text-center mb-3">Register</h3>

        {globalError && <div className="alert alert-danger">{globalError}</div>}

        <form onSubmit={submit} className="row g-3">
          <div className="col-md-6">
            <FormField
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              error={errors.firstName}
              required
            />
          </div>

          <div className="col-md-6">
            <FormField
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              error={errors.lastName}
              required
            />
          </div>

          <div className="col-md-6">
            <FormField
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              required
            />
          </div>

          <div className="col-md-6">
            <FormField
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={errors.phone}
              required
            />
          </div>

          <div className="col-md-6">
            <FormField
              placeholder="Company"
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <select
                className="form-select auth-input"
                value={form.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
              >
                <option value="">Choose Industry</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Retail">Retail</option>
              </select>
            </div>
          </div>

          <div className="col-md-6">
            <FormField
              placeholder="Country / Region"
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            {/* Empty column or spacer if needed layout-wise, but 
                 Register.jsx had Password/ConfirmPassword next. 
                 Wait, original code had country then password.
                 Let's stick to original order.
             */}
          </div>

          <div className="col-md-6">
            <FormField
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={errors.password}
              required
            />
          </div>

          <div className="col-md-6">
            <FormField
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
              required
            />
          </div>

          <div className="col-12">
            <button className="btn auth-btn w-100 mt-2" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
