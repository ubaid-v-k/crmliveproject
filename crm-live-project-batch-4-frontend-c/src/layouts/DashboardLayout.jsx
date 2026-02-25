import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/dashboard.css";

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="dashboard">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="main-content">
                <Topbar onMenuClick={() => setSidebarOpen(true)} />
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
