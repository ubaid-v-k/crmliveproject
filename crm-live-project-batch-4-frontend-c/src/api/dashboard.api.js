import axios from "axios";

const API_URL = "http://localhost:8000/api";
const SESSION_KEY = "crm_user_token";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(SESSION_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getDashboardData = async (period = 'monthly') => {
  try {
    const response = await api.get(`/dashboard/?period=${period}`);
    return response.data;
  } catch (error) {
    console.error("Dashboard stats error", error);
    return {
      stats: [
        { title: "Total Leads", value: "0", icon: "👥", color: "#e0e7ff" },
        { title: "Active Deals", value: "0", icon: "💼", color: "#d1fae5" },
        { title: "Closed Deals", value: "0", icon: "🎒", color: "#fee2e2" },
        { title: "Revenue", value: "$0", icon: "💰", color: "#fde68a" },
      ],
    };
  }
};

export const fetchSalesChartData = async (period = 'monthly') => {
  try {
    const response = await api.get(`/dashboard/sales-chart/?period=${period}`);
    return response.data;
  } catch (error) {
    console.error("Dashboard chart error", error);
    return null;
  }
};

export const fetchConversionData = async () => {
  try {
    const response = await api.get('/dashboard/conversion/');
    return response.data.conversions;
  } catch (error) {
    console.error("Dashboard conversion error", error);
    return [];
  }
};

export const fetchTeamData = async () => {
  try {
    const response = await api.get('/dashboard/team/');
    return response.data.team;
  } catch (error) {
    console.error("Dashboard team error", error);
    return [];
  }
};

export const fetchNotifications = async () => {
  try {
    const response = await api.get('/dashboard/notifications/');
    return response.data.notifications;
  } catch (error) {
    console.error("Dashboard notifications error", error);
    return [];
  }
};

export const createNotification = async (title, message, type = "info") => {
  try {
    const response = await api.post('/dashboard/notifications/', { title, message, type });
    return response.data;
  } catch (error) {
    console.error("Create notification error", error);
    return null;
  }
};

export const clearNotifications = async () => {
  try {
    const response = await api.delete('/dashboard/notifications/');
    return response.data;
  } catch (error) {
    console.error("Clear notifications error", error);
    return null;
  }
};
