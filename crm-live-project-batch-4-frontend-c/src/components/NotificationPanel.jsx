import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, IconButton, Button } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { fetchNotifications, clearNotifications } from "../api/dashboard.api";
import { useNavigate } from "react-router-dom";

const getIcon = (type) => {
    switch (type) {
        case "success": return <PersonAddAltIcon fontSize="small" color="success" />;
        case "warning": return <ErrorOutlineIcon fontSize="small" color="warning" />;
        default: return <CheckCircleOutlineIcon fontSize="small" color="primary" />;
    }
};

const NotificationPanel = ({ onClose, initialNotifications = [] }) => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (initialNotifications.length === 0) {
            const loadNotifs = async () => {
                setLoading(true);
                const data = await fetchNotifications();
                setNotifications(data);
                setLoading(false);
            };
            loadNotifs();
        }
    }, [initialNotifications]);

    const handleClearAll = async () => {
        setLoading(true);
        await clearNotifications();
        setNotifications([]);
        setLoading(false);
    };

    return (
        <Box
            sx={{
                position: "absolute",
                top: "60px",
                right: "0",
                width: "320px",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                zIndex: 1000,
                overflow: "hidden",
                border: "1px solid #e2e8f0",
            }}
        >
            <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom="1px solid #f1f5f9">
                <Typography variant="subtitle1" fontWeight={600}>
                    Notifications
                </Typography>
                <Box display="flex" gap={1}>
                    {notifications.length > 0 && (
                        <Button
                            size="small"
                            color="error"
                            onClick={handleClearAll}
                            sx={{ textTransform: 'none', fontSize: '12px', minWidth: 'auto', p: '2px 8px' }}
                            startIcon={<DeleteOutlineIcon fontSize="inherit" />}
                        >
                            Clear
                        </Button>
                    )}
                    <IconButton size="small" onClick={onClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            <List sx={{ maxHeight: 300, overflowY: "auto", p: 0 }}>
                {loading ? (
                    <Box p={3} textAlign="center">
                        <Typography variant="body2" color="text.secondary">Loading...</Typography>
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box p={3} textAlign="center" py={6}>
                        <NotificationsNoneIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                            No new notifications
                        </Typography>
                    </Box>
                ) : (
                    notifications.map((notif, index) => (
                        <React.Fragment key={notif.id}>
                            <ListItem alignItems="flex-start" sx={{ px: 2, py: 1.5, "&:hover": { bgcolor: "#f8fafc" } }}>
                                <ListItemAvatar sx={{ minWidth: 40 }}>
                                    <Avatar sx={{ bgcolor: "#f1f5f9", width: 32, height: 32 }}>
                                        {getIcon(notif.type)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle2" fontSize="0.9rem" fontWeight={600} color="#1e293b">
                                            {notif.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <React.Fragment>
                                            <Typography component="span" variant="body2" color="#64748b" display="block" fontSize="0.8rem">
                                                {notif.message}
                                            </Typography>
                                            <Typography component="span" variant="caption" color="#94a3b8" fontSize="0.75rem">
                                                {notif.time}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            {index < notifications.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                    ))
                )}
            </List>

            {notifications.length > 0 && (
                <Box p={1.5} borderTop="1px solid #f1f5f9" textAlign="center">
                    <Typography
                        variant="caption"
                        color="primary"
                        sx={{ cursor: "pointer", fontWeight: 600 }}
                        onClick={() => {
                            onClose();
                            navigate('/notifications');
                        }}
                    >
                        View All
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default NotificationPanel;
