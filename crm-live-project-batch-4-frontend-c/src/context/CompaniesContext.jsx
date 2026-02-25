import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchCompanies, createCompany, updateCompanyApi, deleteCompanyApi } from "../api/companies.api";

const CompaniesContext = createContext();

export function CompaniesProvider({ children }) {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCompanies = async () => {
        try {
            setLoading(true);
            const data = await fetchCompanies();
            setCompanies(data);
        } catch (error) {
            console.error("Failed to fetch companies:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCompanies();
    }, []);

    const STATUS_COLORS = {
        Active: { bg: "#d1fae5", color: "#059669" },
        Inactive: { bg: "#fee2e2", color: "#dc2626" },
        "On Hold": { bg: "#ffedd5", color: "#ea580c" },
    };

    const addCompany = async (company) => {
        try {
            const newCompany = await createCompany(company);
            setCompanies([newCompany, ...companies]);
            toast.success("Company created successfully");
            return newCompany;
        } catch (error) {
            console.error("Failed to add company:", error);
            toast.error("Failed to create company");
            throw error;
        }
    };

    const updateCompany = async (id, updatedData) => {
        try {
            const updated = await updateCompanyApi(id, updatedData);
            setCompanies(companies.map((c) => (c.id === id ? { ...c, ...updated } : c)));
            toast.success("Company updated successfully");
            return updated;
        } catch (error) {
            console.error("Failed to update company:", error);
            toast.error("Failed to update company");
            throw error;
        }
    };

    const deleteCompany = async (id) => {
        try {
            await deleteCompanyApi(id);
            setCompanies(companies.filter((c) => c.id !== id));
            toast.success("Company deleted successfully");
        } catch (error) {
            console.error("Failed to delete company:", error);
            toast.error("Failed to delete company");
            throw error;
        }
    };

    const getCompany = (id) => {
        return companies.find((c) => c.id.toString() === id.toString());
    };

    return (
        <CompaniesContext.Provider
            value={{
                companies,
                addCompany,
                updateCompany,
                deleteCompany,
                getCompany,
                STATUS_COLORS,
                loading,
                refreshCompanies: loadCompanies
            }}
        >
            {children}
        </CompaniesContext.Provider>
    );
}

export function useCompanies() {
    return useContext(CompaniesContext);
}
