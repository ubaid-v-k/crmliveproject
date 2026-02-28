import React, { useState } from "react";
import {
    Box,
    Typography,
    Stack,
    Button,
    TextField,
    MenuItem,
    InputAdornment,
    Grid,
    IconButton
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ImageIcon from "@mui/icons-material/Image";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EntityDrawer from "../../components/common/EntityDrawer";

export default function CreateTask({ open, onClose, onSave, initialData }) {
    const [taskName, setTaskName] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [time, setTime] = useState("");
    const [taskType, setTaskType] = useState("");
    const [priority, setPriority] = useState("");
    const [assignedTo, setAssignedTo] = useState("Maria Johnson");
    const [note, setNote] = useState("");

    React.useEffect(() => {
        if (open) {
            if (initialData) {
                setTaskName(initialData.title || "");
                // Parsing mock date string: "June 24, 2025 at 5:30PM"
                const parts = initialData.dueDate ? initialData.dueDate.split(" at ") : [];
                setDueDate(parts[0] || "");
                setTime(parts[1] || "");

                setTaskType(initialData.type || "");
                setPriority(initialData.priority || "");
                setAssignedTo(initialData.assignedTo || "Maria Johnson");
                setNote(initialData.note || "");
            } else {
                setTaskName("");
                setDueDate("");
                setTime("");
                setTaskType("");
                setPriority("");
                setAssignedTo("Maria Johnson");
                setNote("");
            }
        }
    }, [open, initialData]);

    const handleSave = () => {
        onSave({
            title: taskName,
            dueDate,
            time,
            type: taskType,
            priority,
            assignedTo,
            note
        });
        // Reset and close
        setTaskName("");
        setDueDate("");
        setTime("");
        setTaskType("");
        setPriority("");
        setNote("");
        onClose();
    };

    return (
        <EntityDrawer
            open={open}
            onClose={onClose}
            title="Create Task"
            onSave={handleSave}
        >
            {/* Task Name */}
            <Box>
                <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                    Task Name *
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Enter"
                    variant="outlined"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
            </Box>

            {/* Date & Time Row */}
            <Grid container spacing={2}>
                <Grid size={6}>
                    <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                        Due Date *
                    </Typography>
                    <TextField
                        fullWidth
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: "8px" }
                        }}
                    />
                </Grid>
                <Grid size={6}>
                    <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                        Time *
                    </Typography>
                    <TextField
                        fullWidth
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: "8px" }
                        }}
                    />
                </Grid>
            </Grid>

            {/* Type & Priority Row */}
            <Grid container spacing={2}>
                <Grid size={6}>
                    <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                        Task Type *
                    </Typography>
                    <TextField
                        select
                        fullWidth
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}
                        SelectProps={{ displayEmpty: true }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    >
                        <MenuItem value="" disabled>Choose</MenuItem>
                        <MenuItem value="To-Do">To-Do</MenuItem>
                        <MenuItem value="Follow-up">Follow-up</MenuItem>
                        <MenuItem value="Meeting">Meeting</MenuItem>
                    </TextField>
                </Grid>
                <Grid size={6}>
                    <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                        Priority *
                    </Typography>
                    <TextField
                        select
                        fullWidth
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        SelectProps={{ displayEmpty: true }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    >
                        <MenuItem value="" disabled>Choose</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            {/* Assigned To */}
            <Box>
                <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                    Assigned to *
                </Typography>
                <TextField
                    select
                    fullWidth
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                >
                    <MenuItem value="Maria Johnson">Maria Johnson</MenuItem>
                    <MenuItem value="You">You</MenuItem>
                </TextField>
            </Box>

            {/* Note (Rich Text Mock) */}
            <Box>
                <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                    Note *
                </Typography>
                <Box
                    sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        height: "200px",
                        "&:focus-within": {
                            borderColor: "#5B4DDB",
                            boxShadow: "0 0 0 2px rgba(91, 77, 219, 0.1)"
                        }
                    }}
                >
                    {/* Toolbar */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                            p: 1,
                            borderBottom: "1px solid #e2e8f0",
                            bgcolor: "#fff"
                        }}
                    >
                        <Button
                            size="small"
                            endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                            sx={{ textTransform: "none", color: "#64748b", minWidth: "auto", fontSize: "12px" }}
                        >
                            Normal text
                        </Button>
                        <Box sx={{ width: "1px", height: "20px", bgcolor: "#e2e8f0", mx: 1 }} />
                        {[FormatBoldIcon, FormatItalicIcon, FormatUnderlinedIcon].map((Icon, i) => (
                            <IconButton key={i} size="small" sx={{ p: 0.5, color: "#64748b" }}>
                                <Icon fontSize="small" />
                            </IconButton>
                        ))}
                        <Box sx={{ width: "1px", height: "20px", bgcolor: "#e2e8f0", mx: 1 }} />
                        {[FormatListBulletedIcon, ImageIcon].map((Icon, i) => (
                            <IconButton key={i} size="small" sx={{ p: 0.5, color: "#64748b" }}>
                                <Icon fontSize="small" />
                            </IconButton>
                        ))}
                    </Stack>

                    {/* Text Area */}
                    <TextField
                        multiline
                        fullWidth
                        rows={6}
                        placeholder="Enter"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                p: 2,
                                fontSize: "14px",
                                alignItems: "flex-start",
                                overflowY: "auto",
                                height: "100%"
                            }
                        }}
                    />
                </Box>
            </Box>

        </EntityDrawer>
    );
}
