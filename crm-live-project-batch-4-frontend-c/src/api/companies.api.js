import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("crm_user_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const mapCompanyToFrontend = (company) => {
    // Format date properly
    let formattedDate = company.created_at;
    if (formattedDate) {
        try {
            const dateObj = new Date(formattedDate);
            formattedDate = dateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (e) {
            console.error("Date formatting error", e);
        }
    }

    return {
        ...company,
        owner: company.owner_name || "Unassigned", // Map backend owner_name to frontend owner
        created: formattedDate || "N/A"
    };
};

export const fetchCompanies = async () => {
    const response = await axios.get(`${API_BASE_URL}/companies/`, {
        headers: getAuthHeader(),
    });
    return Array.isArray(response.data) ? response.data.map(mapCompanyToFrontend) : [];
};

export const createCompany = async (companyData) => {
    // Map frontend owner to backend owner_name
    const payload = { ...companyData, owner_name: companyData.owner };
    const response = await axios.post(`${API_BASE_URL}/companies/`, payload, {
        headers: getAuthHeader(),
    });
    return mapCompanyToFrontend(response.data);
};

export const updateCompanyApi = async (id, companyData) => {
    const payload = { ...companyData, owner_name: companyData.owner };
    const response = await axios.patch(`${API_BASE_URL}/companies/${id}/`, payload, {
        headers: getAuthHeader(),
    });
    return mapCompanyToFrontend(response.data);
};

export const deleteCompanyApi = async (id) => {
    await axios.delete(`${API_BASE_URL}/companies/${id}/`, {
        headers: getAuthHeader(),
    });
};
