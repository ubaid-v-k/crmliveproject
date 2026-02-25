import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword, verifyOtp, resetPassword } from "../api/authService";
import FormField from "../components/form/FormField";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // email, otp, reset
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  // Step 1: Send OTP to Email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      if (res.success) {
        toast.success("OTP sent to your email");
        setStep("otp");
      } else {
        setError(res.message || "Failed to send OTP");
        toast.error(res.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await verifyOtp(email, otp);
      if (res.success) {
        toast.success("OTP verified successfully");
        setStep("reset");
      } else {
        setError(res.message || "Invalid OTP");
        toast.error(res.message || "Invalid OTP");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await resetPassword(email, otp, password);
      if (res.success) {
        toast.success("Password reset successfully! Please login.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.message || "Failed to reset password");
        toast.error(res.message || "Failed to reset password");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="auth-card p-4" style={{ width: 400 }}>
        <h4 className="text-center mb-3">
          {step === "email" && "Forgot Password"}
          {step === "otp" && "Verify OTP"}
          {step === "reset" && "Reset Password"}
        </h4>

        {error && <div className="alert alert-danger">{error}</div>}

        {step === "email" && (
          <form onSubmit={handleEmailSubmit}>
            <p className="text-muted text-center mb-3">
              Enter your email address to receive a verification code.
            </p>
            <FormField
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn auth-btn w-100 mt-3" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit}>
            <p className="text-muted text-center mb-3">
              Enter the OTP sent to <strong>{email}</strong>
            </p>
            <FormField
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button className="btn auth-btn w-100 mt-3" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="text-center mt-2">
              <button
                type="button"
                className="btn btn-link text-decoration-none"
                onClick={() => setStep("email")}
                disabled={loading}
              >
                Wrong email?
              </button>
            </div>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetSubmit}>
            <p className="text-muted text-center mb-3">
              Create a new password for your account.
            </p>
            <FormField
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mb-2"
            />
            <FormField
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button className="btn auth-btn w-100 mt-3" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="text-center mt-3 mb-0">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
