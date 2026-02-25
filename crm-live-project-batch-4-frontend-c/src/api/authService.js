import axios from "axios";

const API_URL = "http://localhost:8000/api";
const SESSION_KEY = "crm_user_token";
const USER_DATA_KEY = "crm_logged_user";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    // Only attach token if the request isn't an auth setup
    const isAuthRoute = config.url.includes('/auth/login') || config.url.includes('/auth/register') || config.url.includes('/auth/forgot-password');
    if (!isAuthRoute) {
      const token = localStorage.getItem(SESSION_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to handle API errors
const handleError = (error) => {
  if (error.response) {
    let message = error.response.data.detail || error.response.data.message || "An error occurred";

    // Handle FastAPI validation errors (array of objects)
    if (Array.isArray(message)) {
      message = message.map((err) => err.msg || JSON.stringify(err)).join(", ");
    }
    // Handle object errors
    else if (typeof message === "object") {
      message = JSON.stringify(message);
    }

    return {
      success: false,
      message: message,
    };
  } else if (error.request) {
    return { success: false, message: "Network error. Please try again." };
  } else {
    return { success: false, message: error.message };
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const payload = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      company: userData.company,
      industry: userData.industry,
      country: userData.country,
      password: userData.password,
    };

    const response = await api.post("/auth/register", payload);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);

    const response = await api.post("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, token_type, user } = response.data;

    if (access_token) {
      localStorage.setItem(SESSION_KEY, access_token);

      // Map backend snake_case fields to frontend camelCase if necessary,
      // and default to the email if the backend didn't return a user object
      const userToStore = user ? {
        email: user.email || credentials.email,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        phone: user.phone || "",
        company: user.company || "",
        industry: user.industry || "",
        country: user.country || "",
        role: user.role || "user",
      } : { email: credentials.email };

      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userToStore));
    }

    return { success: true, token: access_token };
  } catch (error) {
    return handleError(error);
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/auth/verify-otp", { email, otp });
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Reset Password
export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await api.post("/auth/reset-password", {
      email,
      otp,
      new_password: newPassword,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  // Optional: Call backend logout if needed, but usually JWT is stateless
};

// Get current user
export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_DATA_KEY));
  } catch {
    return null;
  }
};

// Check if authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem(SESSION_KEY);
  return !!token;
};
