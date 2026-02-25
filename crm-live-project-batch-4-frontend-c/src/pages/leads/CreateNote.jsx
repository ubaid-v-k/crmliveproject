import React, { useState } from "react";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    Button,
    Drawer,
    InputBase,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ImageIcon from "@mui/icons-material/Image";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function CreateNote({ open, onClose, onSave, initialData }) {
    const [note, setNote] = useState("");

    // Effect to set initial data when drawer opens or data changes
    React.useEffect(() => {
        if (open) {
            setNote(initialData || "");
        }
    }, [open, initialData]);

    const handleSave = () => {
        onSave(note);
        setNote(""); // Reset after save
    };

    const ToolbarButton = ({ children }) => (
        <IconButton
            size="small"
            sx={{
                color: "#64748b",
                padding: "4px",
                borderRadius: "4px",
                "&:hover": { backgroundColor: "#f1f5f9", color: "#334155" },
            }}
        >
            {children}
        </IconButton>
    );

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box
                sx={{
                    width: 500,
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
                    px={3}
                    py={3}
                    sx={{ borderBottom: "1px solid #e2e8f0" }}
                >
                    <Typography variant="h6" fontWeight={700} color="#1e293b">
                        {initialData ? "Edit Note" : "Create Note"}
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
                        <CloseIcon />
                    </IconButton>
                </Stack>

                {/* BODY */}
                <Box px={3} py={4} sx={{ flex: 1, overflowY: "auto" }}>
                    <Typography
                        variant="body2"
                        fontWeight={500}
                        color="#334155"
                        mb={1}
                        sx={{ fontSize: "14px" }}
                    >
                        Note <span style={{ color: "#ef4444" }}>*</span>
                    </Typography>

                    {/* Rich Text Editor Mock Container */}
                    <Box
                        sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            height: "300px", // Fixed height for editor feel
                            "&:focus-within": {
                                borderColor: "#5B4DDB",
                                boxShadow: "0 0 0 2px rgba(91, 77, 219, 0.1)"
                            },
                            transition: "all 0.2s"
                        }}
                    >
                        {/* Editor Toolbar */}
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{
                                borderBottom: "1px solid #e2e8f0",
                                backgroundColor: "#f8fafc",
                                p: 1,
                            }}
                        >
                            {/* Font Style Dropdown Mock */}
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                                sx={{
                                    cursor: "pointer",
                                    mr: 1,
                                    color: "#64748b",
                                    fontSize: "13px",
                                    fontWeight: 500
                                }}
                            >
                                <Typography variant="caption" fontSize="13px">Normal text</Typography>
                                <KeyboardArrowDownIcon fontSize="small" />
                            </Stack>

                            <Divider orientation="vertical" flexItem sx={{ height: 20, my: "auto" }} />

                            <ToolbarButton><FormatBoldIcon fontSize="small" /></ToolbarButton>
                            <ToolbarButton><FormatItalicIcon fontSize="small" /></ToolbarButton>
                            <ToolbarButton><FormatUnderlinedIcon fontSize="small" /></ToolbarButton>

                            <Divider orientation="vertical" flexItem sx={{ height: 20, my: "auto" }} />

                            <ToolbarButton><FormatListBulletedIcon fontSize="small" /></ToolbarButton>
                            <ToolbarButton><FormatListNumberedIcon fontSize="small" /></ToolbarButton>

                            <Divider orientation="vertical" flexItem sx={{ height: 20, my: "auto" }} />

                            <ToolbarButton><ImageIcon fontSize="small" /></ToolbarButton>
                        </Stack>

                        {/* Editor Content Area */}
                        <InputBase
                            multiline
                            placeholder="Enter"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            sx={{
                                p: 2,
                                flex: 1,
                                alignItems: "flex-start",
                                fontSize: "14px",
                                color: "#334155",
                                overflowY: "auto",
                                "& textarea": { height: "100% !important" }
                            }}
                        />
                    </Box>
                </Box>

                {/* FOOTER */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    px={3}
                    py={3}
                    sx={{ borderTop: "1px solid #e2e8f0" }}
                >
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{
                            width: "48%",
                            borderColor: "#e2e8f0",
                            color: "#64748b",
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "15px",
                            padding: "10px",
                            borderRadius: "8px",
                            "&:hover": { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={!note.trim()}
                        sx={{
                            width: "48%",
                            backgroundColor: "#5B4DDB",
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "15px",
                            padding: "10px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(91, 77, 219, 0.2)",
                            "&:hover": { backgroundColor: "#4f46e5" },
                            "&:disabled": { backgroundColor: "#cbd5e1", color: "#f1f5f9" }
                        }}
                    >
                        Save
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
}
