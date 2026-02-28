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
    RadioButtonUnchecked as UncheckedIcon,
    CheckCircleOutlined as CheckIcon,
    TaskOutlined as TaskIcon,
    DateRange as DateRangeIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from "@mui/icons-material";
import CreateTask from "./CreateTask";
import { createActivity } from "../../api/activities.api";
import axios from "axios";

export default function LeadTasks({ searchQuery = "", activities = [], entityType, entityId, refreshActivities }) {
    const [expanded, setExpanded] = useState({ 1: true });
    const [isCreateOpen, setCreateOpen] = useState(false);

    // Edit/Delete State
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [editTaskData, setEditTaskData] = useState(null);

    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleMenuClick = (event, task) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedTaskId(task.id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTaskId(null);
    };

    const handleEditClick = () => {
        const taskToEdit = tasks.find(t => t.id === selectedTaskId);
        if (taskToEdit) {
            setEditTaskData(taskToEdit);
            setCreateOpen(true);
        }
        handleMenuClose();
    };

    const handleDeleteClick = () => {
        setTasks(prev => prev.filter(t => t.id !== selectedTaskId));
        handleMenuClose();
    };

    const handleSaveTask = async (taskData) => {
        if (editTaskData) {
            // Update logic (TBD if edit API exists)
            setEditTaskData(null);
        } else {
            // Create new
            try {
                // Determine if task is overdue immediately (simple logic for now)
                let taskStatus = "pending";
                if (taskData.dueDate && taskData.time) {
                    const dueDateTime = new Date(`${taskData.dueDate}T${taskData.time}`);
                    if (dueDateTime < new Date()) {
                        taskStatus = "overdue";
                    }
                }

                await createActivity({
                    type: "task",
                    subject: taskData.title,
                    description: taskData.note,
                    dueDate: taskData.dueDate ? `${taskData.dueDate}T${taskData.time || "00:00:00"}` : null,
                    [entityType]: entityId,
                    status: taskStatus
                });
                if (refreshActivities) {
                    refreshActivities();
                }
            } catch (error) {
                console.error("Failed to create task", error);
            }
        }
        setCreateOpen(false);
    };

    const handleDrawerClose = () => {
        setCreateOpen(false);
        setEditTaskData(null);
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem("crm_user_token");
            await axios.patch(`http://localhost:8000/api/core/activities/${taskId}/`, { status: "completed" }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (refreshActivities) {
                refreshActivities();
            }
        } catch (error) {
            console.error("Failed to complete task", error);
        }
    };

    // Filter tasks based on search query
    // In our backend, activities arrays likely contains ALL activities. We need to filter by activity_type="task"
    const parsedTasks = activities.filter(a => a.type === "task").map(activity => {
        // Map backend format to frontend format
        let status = activity.status || "pending";
        let displayDueDate = activity.dueDate;

        if (activity.dueDate) {
            const dateObj = new Date(activity.dueDate);
            displayDueDate = dateObj.toLocaleString([], { dateStyle: 'long', timeStyle: 'short' });

            if (dateObj < new Date() && status !== "completed") {
                status = "overdue";
            }
        }

        return {
            id: activity.id,
            title: activity.subject || "Unnamed Task",
            note: activity.description,
            dueDate: displayDueDate,
            rawDueDate: activity.dueDate,
            assignedTo: activity.user || "System",
            status: status,
            type: activity.task_type || "To-Do",
            priority: activity.priority || "Medium"
        }
    });

    const filteredTasks = parsedTasks.filter((task) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            (task.title && task.title.toLowerCase().includes(query)) ||
            (task.note && task.note.toLowerCase().includes(query)) ||
            (task.assignedTo && task.assignedTo.toLowerCase().includes(query))
        );
    });

    return (
        <Box>
            <CreateTask
                open={isCreateOpen}
                onClose={handleDrawerClose}
                onSave={handleSaveTask}
                initialData={editTaskData}
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
                    Tasks
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
                    Create Task
                </Button>
            </Stack>

            <Stack spacing={2}>
                {filteredTasks.map((task) => (
                    <Paper
                        key={task.id}
                        elevation={0}
                        sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            overflow: "hidden",
                        }}
                    >
                        {/* Task Header Area */}
                        <Box
                            onClick={() => toggleExpand(task.id)}
                            sx={{
                                p: 2,
                                cursor: "pointer",
                                backgroundColor: "#fff",
                            }}
                        >
                            {/* Top Row: Icon + Assigned To + Due Date + Menu */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconButton size="small" sx={{ color: "#5B4DDB", p: 0 }}>
                                        {expanded[task.id] ? (
                                            <ArrowDownIcon fontSize="small" />
                                        ) : (
                                            <ArrowRightIcon fontSize="small" />
                                        )}
                                    </IconButton>
                                    <Typography variant="body2" fontWeight={600} color="#334155">
                                        Task assigned to {task.assignedTo}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {/* Due Date Status */}
                                    {task.status === 'overdue' ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#ef4444' }}>
                                            <DateRangeIcon fontSize="inherit" />
                                            <Typography variant="caption" fontWeight={600}>
                                                Overdue : {task.dueDate}
                                            </Typography>
                                        </Box>
                                    ) : task.status === 'completed' ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#10b981' }}>
                                            <TaskIcon fontSize="inherit" />
                                            <Typography variant="caption" fontWeight={600}>
                                                Task Closed
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography variant="caption" color="#94a3b8">
                                            {task.dueDate}
                                        </Typography>
                                    )}

                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuClick(e, task)}
                                        sx={{ color: '#94a3b8', p: 0.5 }}
                                    >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>

                            {/* Second Row: Checkbox + Title */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 3.5 }}>
                                {task.status === 'completed' ? (
                                    <CheckIcon sx={{ color: '#10b981', fontSize: 20 }} />
                                ) : (
                                    <IconButton
                                        size="small"
                                        sx={{ p: 0 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCompleteTask(task.id);
                                        }}
                                    >
                                        <UncheckedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                    </IconButton>
                                )}
                                <Typography variant="body2" color="#64748b" sx={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                                    {task.title}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Expanded Details */}
                        <Collapse in={expanded[task.id]}>
                            <Box sx={{ px: 3, pb: 2, pt: 1, ml: 3.5 }}>
                                <Box sx={{ bgcolor: '#f1f5f9', borderRadius: '8px', p: 2, mb: 2 }}>
                                    <Grid container spacing={4}>
                                        <Grid item>
                                            <Typography variant="caption" color="#64748b" display="block" mb={0.5}>Due Date & Time</Typography>
                                            <Typography variant="body2" fontWeight={600} color="#1e293b">{task.dueDate}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="caption" color="#64748b" display="block" mb={0.5}>Priority</Typography>
                                            <Typography variant="body2" fontWeight={600} color="#1e293b">{task.priority}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="caption" color="#64748b" display="block" mb={0.5}>Type</Typography>
                                            <Typography variant="body2" fontWeight={600} color="#1e293b">{task.type}</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Typography variant="body2" color="#64748b" lineHeight={1.6}>
                                    {task.note}
                                </Typography>
                            </Box>
                        </Collapse>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
}
