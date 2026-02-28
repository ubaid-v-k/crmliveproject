import React from "react";
import { Box, Typography, List, Paper } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    NoteOutlined as NoteIcon,
    EmailOutlined as EmailIcon,
    PhoneOutlined as PhoneIcon,
    TaskOutlined as TaskIcon,
    VideocamOutlined as VideocamIcon,
    RadioButtonUnchecked as UncheckedIcon,
    CheckCircleOutline as CheckedIcon
} from "@mui/icons-material";
import { format, isPast, isToday, isFuture, parseISO } from "date-fns";

export default function ActivityFeed({ activities, searchQuery, onCompleteTask }) {
    // Helper to render correct icon
    const renderActivityIcon = (type) => {
        switch (type) {
            case 'call': return <PhoneIcon sx={{ fontSize: 18, color: '#64748b' }} />;
            case 'meeting': return <VideocamIcon sx={{ fontSize: 18, color: '#64748b' }} />;
            case 'email': return <EmailIcon sx={{ fontSize: 18, color: '#64748b' }} />;
            case 'note': return <NoteIcon sx={{ fontSize: 18, color: '#64748b' }} />;
            case 'task': return <TaskIcon sx={{ fontSize: 18, color: '#64748b' }} />;
            default: return <TaskIcon sx={{ fontSize: 18, color: '#64748b' }} />;
        }
    };

    // Filter by search query
    const filteredActivities = activities.filter((a) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            (a.subject && a.subject.toLowerCase().includes(q)) ||
            (a.description && a.description.toLowerCase().includes(q)) ||
            (a.activity_type && a.activity_type.toLowerCase().includes(q))
        );
    });

    // Grouping
    const upcoming = [];
    const pastGroups = {}; // Keyed by "Month Year"

    filteredActivities.forEach((act) => {
        // Condition for Upcoming: Task that is pending (could be overdue or future) OR Meeting in the future
        let isUpcoming = false;

        if (act.activity_type === 'task' && act.status !== 'completed') {
            isUpcoming = true; // All pending tasks show in upcoming to ensure they are visible
        } else if (act.activity_type === 'meeting' && act.due_date) {
            const mDate = new Date(act.due_date);
            if (isFuture(mDate)) {
                isUpcoming = true;
            }
        }

        if (isUpcoming) {
            upcoming.push(act);
        } else {
            // Group into Past by Month Year string
            let d = new Date(act.created_at);
            if (act.activity_type === 'task' || act.activity_type === 'meeting') {
                d = act.due_date ? new Date(act.due_date) : d;
            }
            const monthYear = format(d, 'MMMM yyyy');

            if (!pastGroups[monthYear]) {
                pastGroups[monthYear] = [];
            }
            pastGroups[monthYear].push(act);
        }
    });

    // Sort upcoming (oldest due dates first if overdue)
    upcoming.sort((a, b) => {
        const dA = a.due_date ? new Date(a.due_date).getTime() : new Date(a.created_at).getTime();
        const dB = b.due_date ? new Date(b.due_date).getTime() : new Date(b.created_at).getTime();
        return dA - dB;
    });

    return (
        <Box>
            {/* UPCOMING SECTION */}
            {(upcoming.length > 0 || !searchQuery) && (
                <>
                    <Typography variant="subtitle2" fontWeight={700} color="#1e293b" mb={2}>Upcoming</Typography>
                    {upcoming.length === 0 && (
                        <Typography variant="body2" color="#64748b" mb={2}>No upcoming activities.</Typography>
                    )}
                    <List sx={{ mb: 4, p: 0 }}>
                        {upcoming.map((item) => {
                            const isTask = item.activity_type === 'task';
                            const dateToPrint = item.due_date ? format(new Date(item.due_date), 'MMMM d, yyyy \\a\\t h:mma') : format(new Date(item.created_at), 'MMMM d, yyyy');
                            const isOverdue = isTask && item.due_date && isPast(new Date(item.due_date)) && !isToday(new Date(item.due_date));

                            return (
                                <Paper
                                    key={item.id}
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        mb: 2,
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                    }}
                                >
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <KeyboardArrowDownIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                                            <Typography variant="body2" fontWeight={600} color="#334155">
                                                {item.subject}
                                            </Typography>
                                        </Box>
                                        {isOverdue && (
                                            <Typography variant="caption" sx={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <TaskIcon fontSize="inherit" /> Overdue : {dateToPrint}
                                            </Typography>
                                        )}
                                        {!isOverdue && (
                                            <Typography variant="caption" sx={{ color: "#64748b", display: "flex", alignItems: "center", gap: 0.5 }}>
                                                {dateToPrint}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box sx={{ pl: 4, display: "flex", alignItems: "center", gap: 1.5 }}>
                                        {isTask ? (
                                            <Box sx={{ cursor: 'pointer' }} onClick={() => onCompleteTask(item.id)}>
                                                <UncheckedIcon sx={{ color: "#94a3b8", fontSize: 20, "&:hover": { color: "#10b981" } }} />
                                            </Box>
                                        ) : (
                                            renderActivityIcon(item.activity_type)
                                        )}
                                        <Typography variant="body2" color="#64748b">
                                            {item.description}
                                        </Typography>
                                    </Box>
                                </Paper>
                            );
                        })}
                    </List>
                </>
            )}

            {/* PAST SECTION (Grouped by Month) */}
            {Object.keys(pastGroups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map(monthYear => (
                <Box key={monthYear} mb={3}>
                    <Typography variant="subtitle2" fontWeight={700} color="#1e293b" mb={2}>{monthYear}</Typography>
                    <List sx={{ p: 0 }}>
                        {pastGroups[monthYear]
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Newest first within month
                            .map((item) => {
                                const isTask = item.activity_type === 'task';
                                const dateToPrint = format(new Date(item.created_at), 'MMMM d, yyyy \\a\\t h:mma');

                                return (
                                    <Paper
                                        key={item.id}
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <Box sx={{ display: "flex", gap: 1.5 }}>
                                                <KeyboardArrowDownIcon fontSize="small" sx={{ color: "#94a3b8", mt: 0.5 }} />
                                                <Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                                        {isTask && item.status === 'completed' ? (
                                                            <CheckedIcon sx={{ fontSize: 18, color: '#10b981' }} />
                                                        ) : (
                                                            renderActivityIcon(item.activity_type)
                                                        )}
                                                        <Typography variant="body2" fontWeight={600} color="#334155" sx={{ textDecoration: isTask && item.status === 'completed' ? 'line-through' : 'none', color: isTask && item.status === 'completed' ? '#94a3b8' : '#334155' }}>
                                                            {item.subject}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="#64748b" sx={{ fontSize: "13px" }}>
                                                        {item.description}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant="caption" color="#94a3b8">
                                                {dateToPrint}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                );
                            })
                        }
                    </List>
                </Box>
            ))}
        </Box>
    );
}
