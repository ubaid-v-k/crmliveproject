import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, CircularProgress, Stack, Paper } from '@mui/material';
import Topbar from '../components/Topbar';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { fetchNotifications, clearNotifications } from '../api/dashboard.api';
import { useNavigate } from 'react-router-dom';

const getIcon = (type) => {
    switch (type) {
        case "success": return <PersonAddAltIcon fontSize="small" color="success" />;
        case "warning": return <ErrorOutlineIcon fontSize="small" color="warning" />;
        default: return <CheckCircleOutlineIcon fontSize="small" color="primary" />;
    }
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        const data = await fetchNotifications();
        setNotifications(data || []);
        setLoading(false);
    };

    const handleClearAll = async () => {
        setLoading(true);
        await clearNotifications();
        setNotifications([]);
        setLoading(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f8fafc' }}>
            <Topbar onMenuClick={() => { }} />

            <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '800px', margin: '0 auto', width: '100%', flexGrow: 1, overflowY: 'auto' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight="700" color="#1e293b">
                        All Notifications
                    </Typography>

                    {notifications.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteOutlineIcon />}
                            onClick={handleClearAll}
                            sx={{ textTransform: 'none', borderRadius: '8px' }}
                        >
                            Clear All
                        </Button>
                    )}
                </Stack>

                <Paper sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    {loading ? (
                        <Box p={6} display="flex" justifyContent="center">
                            <CircularProgress size={40} />
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Box p={8} textAlign="center">
                            <NotificationsNoneIcon sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" fontWeight="600">
                                You're all caught up!
                            </Typography>
                            <Typography variant="body2" color="#94a3b8" mt={1}>
                                There are no new notifications to display.
                            </Typography>
                            <Button variant="contained" sx={{ mt: 3, textTransform: 'none', bgcolor: '#5b4ddb' }} onClick={() => navigate('/dashboard')}>
                                Back to Dashboard
                            </Button>
                        </Box>
                    ) : (
                        <List sx={{ p: 0 }}>
                            {notifications.map((notif, index) => (
                                <React.Fragment key={notif.id}>
                                    <ListItem alignItems="flex-start" sx={{ px: 3, py: 2.5, "&:hover": { bgcolor: "#f8fafc" } }}>
                                        <ListItemAvatar sx={{ minWidth: 50 }}>
                                            <Avatar sx={{ bgcolor: "#f1f5f9", width: 40, height: 40 }}>
                                                {getIcon(notif.type)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" fontWeight={600} color="#1e293b" mb={0.5}>
                                                    {notif.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <React.Fragment>
                                                    <Typography component="span" variant="body2" color="#475569" display="block" mb={1} sx={{ fontSize: '14px' }}>
                                                        {notif.message}
                                                    </Typography>
                                                    <Typography component="span" variant="caption" color="#94a3b8" fontWeight="500">
                                                        {notif.time}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    {index < notifications.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
