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
    TaskOutlined as TaskIcon,
    DateRange as DateRangeIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from "@mui/icons-material";
import CreateTask from "./CreateTask";

const MOCK_TASKS = [
    {
        id: 1,
        assignedTo: "Maria Johnson",
        title: "Prepare quote for Jane Cooper",
        dueDate: "June 24, 2025 at 5:30PM",
        priority: "High",
        type: "To-Do",
        note: "He's interested in our new product line and wants our very best price. Please include a detailed breakdown of costs.",
        status: "overdue",
    },
    {
        id: 2,
        assignedTo: "Maria Johnson",
        title: "Prepare quote for Jane Cooper",
        dueDate: "June 24, 2025 at 5:30PM",
        priority: "Medium",
        type: "To-Do",
        note: "Description here...",
        status: "overdue",
    }
];

export default function LeadTasks() {
    const [tasks, setTasks] = useState(MOCK_TASKS);
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

    const handleSaveTask = (taskData) => {
        if (editTaskData) {
            // Update existing
            setTasks(prev => prev.map(t =>
                t.id === editTaskData.id
                    ? {
                        ...t,
                        assignedTo: taskData.assignedTo,
                        title: taskData.title,
                        dueDate: `${taskData.dueDate} at ${taskData.time}`,
                        priority: taskData.priority,
                        type: taskData.type,
                        note: taskData.note,
                    }
                    : t
            ));
            setEditTaskData(null);
        } else {
            // Create new
            const newTask = {
                id: Date.now(),
                assignedTo: taskData.assignedTo,
                title: taskData.title,
                dueDate: `${taskData.dueDate} at ${taskData.time}`,
                priority: taskData.priority,
                type: taskData.type,
                note: taskData.note,
                status: "pending"
            };
            setTasks(prev => [newTask, ...prev]);
            setExpanded(prev => ({ ...prev, [newTask.id]: true }));
        }
        setCreateOpen(false);
    };

    const handleDrawerClose = () => {
        setCreateOpen(false);
        setEditTaskData(null);
    };

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
                {tasks.map((task) => (
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
                                <UncheckedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                <Typography variant="body2" color="#64748b">
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
