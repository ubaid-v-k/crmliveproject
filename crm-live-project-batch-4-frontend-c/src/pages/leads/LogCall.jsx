import React, { useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    Stack,
    IconButton,
    Button,
    TextField,
    MenuItem,
    InputAdornment,
    Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ImageIcon from "@mui/icons-material/Image";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function LogCall({ open, onClose, onSave, leadName = "Jane Cooper" }) {
    const [outcome, setOutcome] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [note, setNote] = useState("");

    const handleSave = () => {
        onSave({
            outcome,
            date,
            time,
            note
        });
        // Reset and close
        setOutcome("");
        setNote("");
        onClose();
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: "500px" } // Fixed width as per other drawers
            }}
        >
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                {/* HEADER */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    p={3}
                    sx={{ borderBottom: "1px solid #e2e8f0" }}
                >
                    <Typography variant="h6" fontWeight={700} color="#1e293b">
                        Log Call
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
                        <CloseIcon />
                    </IconButton>
                </Stack>

                {/* BODY */}
                <Box px={3} py={4} sx={{ flex: 1, overflowY: "auto" }}>
                    <Stack spacing={3}>

                        {/* Connected To */}
                        <Box>
                            <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                                Connected *
                            </Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={leadName}
                                disabled
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#f1f5f9",
                                        borderRadius: "8px",
                                    },
                                    "& .MuiInputBase-input": {
                                        color: "#64748b",
                                        WebkitTextFillColor: "#64748b", // Fix for disabled text color in some browsers
                                    }
                                }}
                            />
                        </Box>

                        {/* Call Outcome */}
                        <Box>
                            <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                                Call Outcome *
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                value={outcome}
                                onChange={(e) => setOutcome(e.target.value)}
                                SelectProps={{ displayEmpty: true }}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                            >
                                <MenuItem value="" disabled>Choose</MenuItem>
                                <MenuItem value="Interested">Interested</MenuItem>
                                <MenuItem value="Not Interested">Not Interested</MenuItem>
                                <MenuItem value="No Answer">No Answer</MenuItem>
                                <MenuItem value="Left Voicemail">Left Voicemail</MenuItem>
                            </TextField>
                        </Box>

                        {/* Date & Time Row */}
                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                                    Date *
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Choose"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <CalendarTodayIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: "8px" }
                                    }}
                                />
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                                    Time *
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Choose"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
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

                    </Stack>
                </Box>

                {/* FOOTER */}
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={2}
                    p={3}
                    sx={{ borderTop: "1px solid #e2e8f0" }}
                >
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{
                            color: "#1e293b",
                            borderColor: "#e2e8f0",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": { borderColor: "#cbd5e1", bgcolor: "transparent" }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                            backgroundColor: "#5B4DDB",
                            textTransform: "none",
                            fontWeight: 600,
                            boxShadow: "0 4px 6px -1px rgba(91, 77, 219, 0.2)",
                            "&:hover": { backgroundColor: "#4f46e5" }
                        }}
                    >
                        Save
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
}
