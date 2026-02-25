import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("crm_user_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchCompanies = async () => {
    const response = await axios.get(`${API_BASE_URL}/core/companies/`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const createCompany = async (companyData) => {
    const response = await axios.post(`${API_BASE_URL}/core/companies/`, companyData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const updateCompanyApi = async (id, companyData) => {
    const response = await axios.patch(`${API_BASE_URL}/core/companies/${id}/`, companyData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const deleteCompanyApi = async (id) => {
    await axios.delete(`${API_BASE_URL}/core/companies/${id}/`, {
        headers: getAuthHeader(),
    });
};
