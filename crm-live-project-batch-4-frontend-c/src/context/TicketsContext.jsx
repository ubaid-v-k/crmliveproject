import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchTickets, createTicket, updateTicketApi, deleteTicketApi } from "../api/tickets.api";

const TicketsContext = createContext();

export const TicketsProvider = ({ children }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTickets = async () => {
        try {
            setLoading(true);
            const data = await fetchTickets();
            // Map backend fields to frontend format
            const mappedTickets = data.map(t => ({
                ...t,
                owner: t.owner_name || "Unassigned",
                // Handle association mapping from backend IDs/objects if needed
            }));
            setTickets(mappedTickets);
        } catch (error) {
            console.error("Failed to fetch tickets:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, []);

    const addTicket = async (ticket) => {
        try {
            const payload = {
                title: ticket.title,
                description: ticket.description,
                status: ticket.status,
                priority: ticket.priority,
                source: ticket.source,
                owner_name: ticket.owner,
                company: ticket.associationType === "company" && ticket.companyId ? parseInt(ticket.companyId, 10) : null,
                deal: ticket.associationType === "deal" && ticket.dealId ? parseInt(ticket.dealId, 10) : null,
            };
            const newTicket = await createTicket(payload);
            setTickets([newTicket, ...tickets]);
            return newTicket;
        } catch (error) {
            console.error("Failed to add ticket:", error.response?.data || error);
            throw error;
        }
    };

    const updateTicket = async (id, updatedData) => {
        try {
            const payload = { ...updatedData };
            if (payload.owner) {
                payload.owner_name = payload.owner;
                delete payload.owner;
            }
            if (payload.associationType) {
                payload.company = payload.associationType === "company" && payload.companyId ? parseInt(payload.companyId, 10) : null;
                payload.deal = payload.associationType === "deal" && payload.dealId ? parseInt(payload.dealId, 10) : null;
            }
            delete payload.associationType;
            delete payload.companyId;
            delete payload.dealId;

            const updated = await updateTicketApi(id, payload);
            setTickets(tickets.map((t) => (t.id === id ? { ...t, ...updated } : t)));
            return updated;
        } catch (error) {
            console.error("Failed to update ticket:", error.response?.data || error);
            throw error;
        }
    };

    const deleteTicket = async (id) => {
        try {
            await deleteTicketApi(id);
            setTickets(tickets.filter((t) => t.id !== id));
        } catch (error) {
            console.error("Failed to delete ticket:", error.response?.data || error);
            throw error;
        }
    };

    const getTicket = (id) => {
        return tickets.find((t) => t.id.toString() === id.toString());
    };

    return (
        <TicketsContext.Provider value={{ tickets, loading, addTicket, updateTicket, deleteTicket, getTicket, refreshTickets: loadTickets }}>
            {children}
        </TicketsContext.Provider>
    );
};

export const useTickets = () => {
    const context = useContext(TicketsContext);
    if (!context) {
        throw new Error("useTickets must be used within a TicketsProvider");
    }
    return context;
};
