import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("crm_user_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const mapLeadToFrontend = (lead) => ({
    ...lead,
    firstName: lead.first_name,
    lastName: lead.last_name,
    name: `${lead.first_name || ""} ${lead.last_name || ""}`.trim(),
    created: lead.created_at || lead.created,
});

const mapLeadToBackend = (lead) => {
    const { firstName, lastName, name, created, ...rest } = lead;
    return {
        ...rest,
        first_name: firstName || (name ? name.split(" ")[0] : ""),
        last_name: lastName || (name ? name.split(" ").slice(1).join(" ") : ""),
    };
};

export const fetchLeads = async () => {
    const response = await axios.get(`${API_BASE_URL}/core/leads/`, {
        headers: getAuthHeader(),
    });
    return Array.isArray(response.data) ? response.data.map(mapLeadToFrontend) : [];
};

export const createLead = async (leadData) => {
    const response = await axios.post(`${API_BASE_URL}/core/leads/`, mapLeadToBackend(leadData), {
        headers: getAuthHeader(),
    });
    return mapLeadToFrontend(response.data);
};

export const updateLeadApi = async (id, leadData) => {
    const response = await axios.patch(`${API_BASE_URL}/core/leads/${id}/`, mapLeadToBackend(leadData), {
        headers: getAuthHeader(),
    });
    return mapLeadToFrontend(response.data);
};

export const deleteLeadApi = async (id) => {
    await axios.delete(`${API_BASE_URL}/core/leads/${id}/`, {
        headers: getAuthHeader(),
    });
};
