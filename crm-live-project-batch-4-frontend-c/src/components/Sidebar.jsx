import React from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";

import "../styles/sidebar.css";

// Menu items with ROUTES
const menu = [
  { label: "Dashboard", icon: DashboardOutlinedIcon, path: "/dashboard" },
  { label: "Leads", icon: PeopleAltOutlinedIcon, path: "/leads" },
  { label: "Companies", icon: BusinessCenterOutlinedIcon, path: "/companies" },
  { label: "Deals", icon: AssignmentTurnedInOutlinedIcon, path: "/deals" },
  { label: "Tickets", icon: ConfirmationNumberOutlinedIcon, path: "/tickets" },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div
          className="sidebar-backdrop show"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <Box
        className={`sidebar ${open ? "open" : ""}`}
      >
        <List>
          {menu.map((item, index) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.path);

            return (
              <ListItem
                key={index}
                onClick={() => navigate(item.path)}
                sx={{
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: active ? "none" : "1px solid #e7ecf3",
                    background: active
                      ? "linear-gradient(135deg, #5b5ce2, #7a6ff0)"
                      : "transparent",
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: 20,
                      color: active ? "#ffffff" : "#8f9bad",
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    mt: 1.5,
                    fontSize: 10,
                    fontWeight: active ? 600 : 500,
                    color: active ? "#1f2a44" : "#0f1f3d",
                  }}
                >
                  {item.label}
                </Typography>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </>
  );
}
