import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    IconButton,
    Collapse,
    TextField,
    MenuItem,
    InputAdornment,
} from "@mui/material";
import {
    KeyboardArrowDown as ArrowDownIcon,
    KeyboardArrowRight as ArrowRightIcon,
    AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import LogCall from "./LogCall";

const MOCK_CALLS = [
    {
        id: 1,
        title: "Call from Maria Johnson",
        description: "Brought Jane through our latest product line. He's interested and is going to get back to me.",
        date: "June 24, 2025 at 5:30PM",
        outcome: "",
        duration: "",
    },
    {
        id: 2,
        title: "Call from Maria Johnson",
        description: "Brought Jane through our latest product line. He's interested and is going to get back to me.",
        date: "June 24, 2025 at 5:30PM",
        outcome: "",
        duration: "",
    }
];

export default function LeadCalls() {
    const [calls, setCalls] = useState(MOCK_CALLS);
    const [expanded, setExpanded] = useState({ 1: true });
    const [isLogCallOpen, setLogCallOpen] = useState(false);

    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSaveCall = (callData) => {
        const newCall = {
            id: Date.now(),
            title: "Call from You",
            description: callData.note,
            date: new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }),
            outcome: callData.outcome,
            duration: "" // Mock duration or add field if needed
        };
        setCalls(prev => [newCall, ...prev]);
        setExpanded(prev => ({ ...prev, [newCall.id]: true }));
    };

    return (
        <Box>
            <LogCall
                open={isLogCallOpen}
                onClose={() => setLogCallOpen(false)}
                onSave={handleSaveCall}
            />

            {/* Header Row */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h6" fontWeight={700} color="#1e293b">
                    Calls
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => setLogCallOpen(true)}
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
                    Make a Phone Call
                </Button>
            </Stack>

            {/* Group: June 2025 */}
            <Typography variant="subtitle2" fontWeight={700} color="#1e293b" mb={2}>
                June 2025
            </Typography>

            {calls.map((call) => (
                <Paper
                    key={call.id}
                    elevation={0}
                    sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        overflow: "hidden",
                        mb: 2,
                    }}
                >
                    {/* Call Header */}
                    <Box
                        onClick={() => toggleExpand(call.id)}
                        sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                            <IconButton size="small" sx={{ color: "#5B4DDB", p: 0, mt: 0 }}>
                                {expanded[call.id] ? (
                                    <ArrowDownIcon fontSize="small" />
                                ) : (
                                    <ArrowRightIcon fontSize="small" />
                                )}
                            </IconButton>

                            <Box>
                                <Typography variant="body2" fontWeight={600} color="#334155">
                                    {call.title}
                                </Typography>
                                <Typography variant="caption" color="#64748b" sx={{ display: 'block', mt: 0.5 }}>
                                    {call.description}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="caption" color="#94a3b8" sx={{ whiteSpace: 'nowrap', ml: 2 }}>
                            {call.date}
                        </Typography>
                    </Box>

                    {/* Expanded Content: Log Details */}
                    <Collapse in={expanded[call.id]}>
                        <Box sx={{ px: 5, pb: 3, display: 'flex', gap: 2 }}>

                            {/* Outcome Input */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                                    Outcome *
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    defaultValue=""
                                    SelectProps={{ displayEmpty: true }}
                                    InputProps={{
                                        sx: { borderRadius: '8px', fontSize: '14px', color: '#64748b' }
                                    }}
                                >
                                    <MenuItem value="" disabled>Choose</MenuItem>
                                    <MenuItem value="connected">Connected</MenuItem>
                                    <MenuItem value="no_answer">No Answer</MenuItem>
                                    <MenuItem value="left_voicemail">Left Voicemail</MenuItem>
                                    <MenuItem value="wrong_number">Wrong Number</MenuItem>
                                </TextField>
                            </Box>

                            {/* Duration Input */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="#ef4444" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                                    Duration *
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Choose"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <AccessTimeIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: '8px', fontSize: '14px' }
                                    }}
                                />
                            </Box>

                        </Box>
                    </Collapse>
                </Paper>
            ))}
        </Box>
    );
}
