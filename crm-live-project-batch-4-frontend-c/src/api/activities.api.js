import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const getAuthHeader = () => {
    const token = localStorage.getItem("crm_user_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Map backend to frontend (handles due_date and created_at)
const mapActivityToFrontend = (activity) => ({
    ...activity,
    dueDate: activity.due_date,
    createdAt: activity.created_at,
    type: activity.activity_type,
});

// Map frontend to backend
const mapActivityToBackend = (activityData) => {
    const { dueDate, type, createdAt, ...rest } = activityData;
    return {
        ...rest,
        activity_type: type,
        due_date: dueDate || null,
    };
};

export const fetchActivities = async (entityType, entityId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/activities/?${entityType}=${entityId}`, {
            headers: getAuthHeader(),
        });
        return Array.isArray(response.data) ? response.data.map(mapActivityToFrontend) : [];
    } catch (error) {
        console.error("Failed to fetch activities:", error);
        return [];
    }
};

export const createActivity = async (activityData) => {
    const response = await axios.post(`${API_BASE_URL}/activities/`, mapActivityToBackend(activityData), {
        headers: getAuthHeader(),
    });
    return mapActivityToFrontend(response.data);
};

export const generateAiSummary = async (entityType, entityId, attachmentCount = 0) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/generate-summary/?type=${entityType}&id=${entityId}&attachments=${attachmentCount}`, {
            headers: getAuthHeader(),
        });
        return response.data.summary;
    } catch (error) {
        console.error("Failed to generate AI summary:", error);
        return "Failed to generate summary.";
    }
};
