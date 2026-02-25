import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("crm_user_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchDeals = async () => {
    const response = await axios.get(`${API_BASE_URL}/core/deals/`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const createDeal = async (dealData) => {
    const response = await axios.post(`${API_BASE_URL}/core/deals/`, dealData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const updateDealApi = async (id, dealData) => {
    const response = await axios.patch(`${API_BASE_URL}/core/deals/${id}/`, dealData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const deleteDealApi = async (id) => {
    await axios.delete(`${API_BASE_URL}/core/deals/${id}/`, {
        headers: getAuthHeader(),
    });
};
