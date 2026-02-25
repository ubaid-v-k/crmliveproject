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

export default function CreateMeeting({ open, onClose, onSave, initialData }) {
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [attendees, setAttendees] = useState([]);
    const [location, setLocation] = useState("");
    const [reminder, setReminder] = useState("");
    const [note, setNote] = useState("");

    React.useEffect(() => {
        if (open) {
            if (initialData) {
                setTitle(initialData.title || "");
                // Parsing mock date string: "June 24, 2025 at 5:30PM"
                const parts = initialData.date ? initialData.date.split(" at ") : [];
                setStartDate(parts[0] || "");
                setStartTime(parts[1] || "");
                setEndTime("");

                setAttendees(initialData.attendeesCount ? ["Maria Johnson", "Jane Cooper"] : []);
                setLocation(initialData.location || "");
                setReminder(initialData.reminder || "");
                setNote(initialData.description || "");
            } else {
                setTitle("");
                setStartDate("");
                setStartTime("");
                setEndTime("");
                setAttendees([]);
                setLocation("");
                setReminder("");
                setNote("");
            }
        }
    }, [open, initialData]);

    const handleSave = () => {
        onSave({
            title,
            startDate,
            startTime,
            endTime,
            attendees,
            location,
            reminder,
            note
        });
        // Reset and close
        setTitle("");
        setStartDate("");
        setStartTime("");
        setEndTime("");
        setAttendees([]);
        setLocation("");
        setReminder("");
        setNote("");
        onClose();
    };

    return (
        <EntityDrawer
            open={open}
            onClose={onClose}
            title="Schedule Meeting"
            onSave={handleSave}
        >
            {/* Title */}
            <Box>
                <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                    Title *
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Enter"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
            </Box>

            {/* Start Date */}
            <Box>
                <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                    Start Date *
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Choose"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <CalendarTodayIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: "8px" }
                    }}
                />
            </Box>

            {/* Time Row */}
            <Grid container spacing={2}>
                <Grid size={6}>
                    <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                        Start Time *
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Choose"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <AccessTimeIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: "8px" }
                        }}
                    />
                </Grid>
                <Grid size={6}>
                    <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                        End Time *
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Choose"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <AccessTimeIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: "8px" }
                        }}
                    />
                </Grid>
            </Grid>

            {/* Attendees */}
            <Box>
                <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                    Attendees *
                </Typography>
                <TextField
                    select
                    fullWidth
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    SelectProps={{
                        multiple: true,
                        renderValue: (selected) => selected.join(', '),
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                >
                    <MenuItem value="Maria Johnson">Maria Johnson</MenuItem>
                    <MenuItem value="Jane Cooper">Jane Cooper</MenuItem>
                    <MenuItem value="MikeRoss">Mike Ross</MenuItem>
                </TextField>
            </Box>

            {/* Location */}
            <Box>
                <Typography variant="caption" fontWeight={500} sx={{ mb: 0.5, display: 'block', color: '#64748b' }}>
                    Location
                </Typography>
                <TextField
                    select
                    fullWidth
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    SelectProps={{ displayEmpty: true }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                >
                    <MenuItem value="" disabled>Choose</MenuItem>
                    <MenuItem value="Google Meet">Google Meet</MenuItem>
                    <MenuItem value="Zoom">Zoom</MenuItem>
                    <MenuItem value="Office">Office</MenuItem>
                </TextField>
            </Box>

            {/* Reminder */}
            <Box>
                <Typography variant="caption" fontWeight={500} sx={{ mb: 0.5, display: 'block', color: '#64748b' }}>
                    Reminder
                </Typography>
                <TextField
                    select
                    fullWidth
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    SelectProps={{ displayEmpty: true }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                >
                    <MenuItem value="" disabled>Choose</MenuItem>
                    <MenuItem value="15 mins before">15 mins before</MenuItem>
                    <MenuItem value="30 mins before">30 mins before</MenuItem>
                    <MenuItem value="1 hour before">1 hour before</MenuItem>
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
