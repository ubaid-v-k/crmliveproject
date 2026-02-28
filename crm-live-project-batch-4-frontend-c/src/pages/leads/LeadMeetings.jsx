import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    IconButton,
    Collapse,
    Grid,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import {
    KeyboardArrowDown as ArrowDownIcon,
    KeyboardArrowRight as ArrowRightIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from "@mui/icons-material";
import CreateMeeting from "./CreateMeeting";
import { createActivity } from "../../api/activities.api";

export default function LeadMeetings({ searchQuery = "", activities = [], entityType, entityId, refreshActivities }) {
    const [expanded, setExpanded] = useState({ 1: true });
    const [isCreateOpen, setCreateOpen] = useState(false);

    // Edit/Delete State
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMeetingId, setSelectedMeetingId] = useState(null);
    const [editMeetingData, setEditMeetingData] = useState(null);

    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleMenuClick = (event, meeting) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedMeetingId(meeting.id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedMeetingId(null);
    };

    const handleEditClick = () => {
        const meetingToEdit = meetings.find(m => m.id === selectedMeetingId);
        if (meetingToEdit) {
            setEditMeetingData(meetingToEdit);
            setCreateOpen(true);
        }
        handleMenuClose();
    };

    const handleDeleteClick = () => {
        setMeetings(prev => prev.filter(m => m.id !== selectedMeetingId));
        handleMenuClose();
    };

    const handleSaveMeeting = async (meetingData) => {
        if (editMeetingData) {
            // Update
            setEditMeetingData(null);
        } else {
            // Create
            try {
                await createActivity({
                    type: "meeting",
                    subject: meetingData.title,
                    description: meetingData.note,
                    dueDate: meetingData.startDate && meetingData.startTime ? `${meetingData.startDate}T${meetingData.startTime}:00` : null,
                    [entityType]: entityId
                });
                if (refreshActivities) {
                    refreshActivities();
                }
            } catch (error) {
                console.error("Failed to create meeting", error);
            }
        }
        setCreateOpen(false);
    };

    const handleDrawerClose = () => {
        setCreateOpen(false);
        setEditMeetingData(null);
    };

    // Filter meetings based on search query
    const parsedMeetings = activities.filter(a => a.type === "meeting").map(activity => {
        let displayDate = activity.dueDate;

        if (activity.dueDate) {
            const dateObj = new Date(activity.dueDate);
            displayDate = dateObj.toLocaleString([], { dateStyle: 'long', timeStyle: 'short' });
        }

        return {
            id: activity.id,
            title: activity.subject || "Unnamed Meeting",
            description: activity.description,
            date: displayDate,
            rawDate: activity.dueDate,
            organizer: activity.user || "System",
            attendees: 1, // Placeholder
            duration: "1 hr" // Placeholder
        }
    });

    const filteredMeetings = parsedMeetings.filter((meeting) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            (meeting.title && meeting.title.toLowerCase().includes(query)) ||
            (meeting.description && meeting.description.toLowerCase().includes(query)) ||
            (meeting.organizer && meeting.organizer.toLowerCase().includes(query))
        );
    });

    return (
        <Box>
            <CreateMeeting
                open={isCreateOpen}
                onClose={handleDrawerClose}
                onSave={handleSaveMeeting}
                initialData={editMeetingData}
            />

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleEditClick}>
                    <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                    <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            {/* Header Row */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h6" fontWeight={700} color="#1e293b">
                    Meeting
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => setCreateOpen(true)}
                    sx={{
                        backgroundColor: "#5B4DDB",
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "8px",
                        padding: "8px 24px",
                        boxShadow: "0 4px 6px -1px rgba(91, 77, 219, 0.2)",
                        "&:hover": { backgroundColor: "#4f46e5" },
                    }}
                >
                    Create Meeting
                </Button>
            </Stack>

            <Stack spacing={2}>
                {filteredMeetings.map((meeting) => (
                    <Paper
                        key={meeting.id}
                        elevation={0}
                        sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            overflow: "hidden",
                        }}
                    >
                        {/* Meeting Header Area */}
                        <Box
                            onClick={() => toggleExpand(meeting.id)}
                            sx={{
                                p: 2,
                                cursor: "pointer",
                                backgroundColor: "#fff",
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <IconButton size="small" sx={{ color: "#5B4DDB", p: 0, mt: 0.5 }}>
                                        {expanded[meeting.id] ? (
                                            <ArrowDownIcon fontSize="small" />
                                        ) : (
                                            <ArrowRightIcon fontSize="small" />
                                        )}
                                    </IconButton>
                                    <Box>
                                        <Typography variant="body2" fontWeight={600} color="#334155">
                                            {meeting.title}
                                        </Typography>
                                        <Typography variant="caption" color="#64748b" display="block">
                                            {meeting.description}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="caption" color="#94a3b8">
                                        {meeting.date}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuClick(e, meeting)}
                                        sx={{ color: '#94a3b8', p: 0.5 }}
                                    >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>

                        {/* Expanded Details */}
                        <Collapse in={expanded[meeting.id]}>
                            <Box sx={{ px: 3, pb: 2, ml: 3.5, mr: 3 }}>
                                {meeting.organizer && (
                                    <Typography variant="caption" color="#5B4DDB" display="block" mb={2}>
                                        Organized by {meeting.organizer}
                                    </Typography>
                                )}
                                <Box sx={{ bgcolor: '#f1f5f9', borderRadius: '8px', p: 2, mb: 2 }}>
                                    <Grid container spacing={4}>
                                        <Grid size={4}>
                                            <Typography variant="caption" color="#64748b" display="block" mb={0.5}>Date & Time</Typography>
                                            <Typography variant="body2" fontWeight={600} color="#1e293b">{meeting.date}</Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="caption" color="#64748b" display="block" mb={0.5}>Duration</Typography>
                                            <Typography variant="body2" fontWeight={600} color="#1e293b">{meeting.duration}</Typography>
                                        </Grid>
                                        <Grid size={4}>
                                            <Typography variant="caption" color="#64748b" display="block" mb={0.5}>Attendees</Typography>
                                            <Typography variant="body2" fontWeight={600} color="#1e293b">{meeting.attendees}</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Typography variant="body2" color="#64748b" lineHeight={1.6}>
                                    Let's discuss our new product line.
                                </Typography>
                            </Box>
                        </Collapse>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
}
