import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchDeals, createDeal, updateDealApi, deleteDealApi } from "../api/deals.api";

const DealsContext = createContext();

export const DealsProvider = ({ children }) => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDeals = async () => {
        try {
            setLoading(true);
            const data = await fetchDeals();
            // Map backend fields to frontend format
            const mappedDeals = data.map(d => ({
                ...d,
                closeDate: d.close_date,
                owner: d.owner_name || "Unassigned"
            }));
            setDeals(mappedDeals);
        } catch (error) {
            console.error("Failed to fetch deals:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDeals();
    }, []);

    const addDeal = async (deal) => {
        try {
            const payload = {
                name: deal.name,
                amount: parseFloat(deal.amount?.toString().replace(/[^0-9.]/g, '') || 0),
                stage: deal.stage,
                priority: deal.priority,
                close_date: deal.closeDate,
                owner_name: deal.owner, // Pass owner name to backend
            };
            const newDeal = await createDeal(payload);
            setDeals([newDeal, ...deals]);
            return newDeal;
        } catch (error) {
            console.error("Failed to add deal:", error.response?.data || error);
            throw error;
        }
    };

    const updateDeal = async (id, updatedData) => {
        try {
            const payload = { ...updatedData };
            if (payload.amount !== undefined) {
                payload.amount = parseFloat(payload.amount?.toString().replace(/[^0-9.]/g, '') || 0);
            }
            if (payload.closeDate) {
                payload.close_date = payload.closeDate;
            }
            if (payload.owner) {
                payload.owner_name = payload.owner;
            }
            delete payload.closeDate;
            delete payload.owner;

            const updated = await updateDealApi(id, payload);
            setDeals(deals.map((d) => (d.id === id ? { ...d, ...updated } : d)));
            return updated;
        } catch (error) {
            console.error("Failed to update deal:", error.response?.data || error);
            throw error;
        }
    };

    const deleteDeal = async (id) => {
        try {
            await deleteDealApi(id);
            setDeals(deals.filter((d) => d.id !== id));
        } catch (error) {
            console.error("Failed to delete deal:", error.response?.data || error);
            throw error;
        }
    };

    const getDeal = (id) => {
        return deals.find((d) => d.id.toString() === id.toString());
    };

    return (
        <DealsContext.Provider value={{ deals, loading, addDeal, updateDeal, deleteDeal, getDeal, refreshDeals: loadDeals }}>
            {children}
        </DealsContext.Provider>
    );
};

export const useDeals = () => {
    const context = useContext(DealsContext);
    if (!context) {
        throw new Error("useDeals must be used within a DealsProvider");
    }
    return context;
};
