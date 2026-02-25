import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchLeads, createLead, updateLeadApi, deleteLeadApi } from "../api/leads.api";

const LeadsContext = createContext();

export function LeadsProvider({ children }) {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadLeads = async () => {
        try {
            setLoading(true);
            const data = await fetchLeads();
            setLeads(data);
        } catch (error) {
            console.error("Failed to fetch leads:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeads();
    }, []);

    const STATUS_COLORS = {
        New: { bg: "#dbeafe", color: "#2563eb" },
        Open: { bg: "#d1fae5", color: "#059669" },
        "In Progress": { bg: "#ffedd5", color: "#ea580c" },
        Lost: { bg: "#fee2e2", color: "#dc2626" },
        "Bad Info": { bg: "#f3f4f6", color: "#6b7280" },
    };

    const addLead = async (lead) => {
        try {
            const newLead = await createLead(lead);
            setLeads([newLead, ...leads]);
            toast.success("Lead created successfully");
            return newLead;
        } catch (error) {
            console.error("Failed to add lead:", error);
            toast.error("Failed to create lead");
            throw error;
        }
    };

    const updateLead = async (id, updatedData) => {
        try {
            const updated = await updateLeadApi(id, updatedData);
            setLeads(leads.map((lead) => (lead.id === id ? { ...lead, ...updated } : lead)));
            toast.success("Lead updated successfully");
            return updated;
        } catch (error) {
            console.error("Failed to update lead:", error);
            toast.error("Failed to update lead");
            throw error;
        }
    };

    const deleteLead = async (id) => {
        try {
            await deleteLeadApi(id);
            setLeads(leads.filter((lead) => lead.id !== id));
            toast.success("Lead deleted successfully");
        } catch (error) {
            console.error("Failed to delete lead:", error);
            toast.error("Failed to delete lead");
            throw error;
        }
    };

    const getLead = (id) => {
        return leads.find((l) => l.id.toString() === id.toString());
    };

    return (
        <LeadsContext.Provider
            value={{
                leads,
                addLead,
                updateLead,
                deleteLead,
                getLead,
                loading,
                STATUS_COLORS,
                refreshLeads: loadLeads
            }}
        >
            {children}
        </LeadsContext.Provider>
    );
}

export function useLeads() {
    return useContext(LeadsContext);
}
