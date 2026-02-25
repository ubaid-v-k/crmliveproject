import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("crm_user_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchTickets = async () => {
    const response = await axios.get(`${API_BASE_URL}/core/tickets/`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const createTicket = async (ticketData) => {
    const response = await axios.post(`${API_BASE_URL}/core/tickets/`, ticketData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const updateTicketApi = async (id, ticketData) => {
    const response = await axios.patch(`${API_BASE_URL}/core/tickets/${id}/`, ticketData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const deleteTicketApi = async (id) => {
    await axios.delete(`${API_BASE_URL}/core/tickets/${id}/`, {
        headers: getAuthHeader(),
    });
};
