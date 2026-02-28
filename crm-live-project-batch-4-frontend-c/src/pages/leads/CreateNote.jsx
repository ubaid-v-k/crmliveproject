import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    Button,
    Drawer,
    Divider,
    Menu,
    MenuItem
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
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);

    // Effect to set initial data when drawer opens or data changes
    useEffect(() => {
        if (open) {
            const initial = initialData || "";
            setNote(initial);
            if (editorRef.current) {
                editorRef.current.innerHTML = initial;
            }
        }
    }, [open, initialData]);

    const handleSave = () => {
        // use content from editor as the final note if possible to avoid state lag
        const finalNote = editorRef.current ? editorRef.current.innerHTML : note;
        onSave(finalNote);
        setNote(""); // Reset after save
        if (editorRef.current) {
            editorRef.current.innerHTML = "";
        }
    };

    // Rich Text Commands
    const execCmd = (command, value = null) => {
        document.execCommand(command, false, value);
    };

    const handleContentChange = () => {
        if (editorRef.current) {
            setNote(editorRef.current.innerHTML);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgDataUrl = event.target.result;
                // Focus editor just in case
                if (editorRef.current) editorRef.current.focus();
                // Create an img tag, we can optionally wrap logic or style inline
                const imgTag = `<br/><img src="${imgDataUrl}" style="max-width: 100%; border-radius: 8px; margin-top: 8px;" /><br/>`;
                execCmd('insertHTML', imgTag);
            };
            reader.readAsDataURL(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Format Dropdown
    const [anchorEl, setAnchorEl] = useState(null);
    const handleFormatMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleFormatMenuClose = () => {
        setAnchorEl(null);
    };
    const applyFormatBlock = (tag) => {
        execCmd('formatBlock', tag);
        handleFormatMenuClose();
    };

    const ToolbarButton = ({ children, onClick }) => (
        <IconButton
            size="small"
            onMouseDown={(e) => {
                e.preventDefault(); // Prevent losing focus on editor
                if (onClick) onClick();
            }}
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

                    {/* Rich Text Editor Container */}
                    <Box
                        sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            height: "300px",
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
                            {/* Font Style Dropdown */}
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                                onClick={handleFormatMenuClick}
                                sx={{
                                    cursor: "pointer",
                                    mr: 1,
                                    color: "#64748b",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    "&:hover": { color: "#334155" }
                                }}
                            >
                                <Typography variant="caption" fontSize="13px">Normal text</Typography>
                                <KeyboardArrowDownIcon fontSize="small" />
                            </Stack>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleFormatMenuClose}
                            >
                                <MenuItem onClick={() => applyFormatBlock('P')}>Normal text</MenuItem>
                                <MenuItem onClick={() => applyFormatBlock('H1')}><Typography variant="h5">Heading 1</Typography></MenuItem>
                                <MenuItem onClick={() => applyFormatBlock('H2')}><Typography variant="h6">Heading 2</Typography></MenuItem>
                            </Menu>

                            <Divider orientation="vertical" flexItem sx={{ height: 20, my: "auto" }} />

                            <ToolbarButton onClick={() => execCmd('bold')}><FormatBoldIcon fontSize="small" /></ToolbarButton>
                            <ToolbarButton onClick={() => execCmd('italic')}><FormatItalicIcon fontSize="small" /></ToolbarButton>
                            <ToolbarButton onClick={() => execCmd('underline')}><FormatUnderlinedIcon fontSize="small" /></ToolbarButton>

                            <Divider orientation="vertical" flexItem sx={{ height: 20, my: "auto" }} />

                            <ToolbarButton onClick={() => execCmd('insertUnorderedList')}><FormatListBulletedIcon fontSize="small" /></ToolbarButton>
                            <ToolbarButton onClick={() => execCmd('insertOrderedList')}><FormatListNumberedIcon fontSize="small" /></ToolbarButton>

                            <Divider orientation="vertical" flexItem sx={{ height: 20, my: "auto" }} />

                            <ToolbarButton onClick={() => fileInputRef.current?.click()}><ImageIcon fontSize="small" /></ToolbarButton>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                            />
                        </Stack>

                        {/* Editor Content Area */}
                        <Box
                            ref={editorRef}
                            contentEditable
                            onInput={handleContentChange}
                            onBlur={handleContentChange}
                            sx={{
                                p: 2,
                                flex: 1,
                                overflowY: "auto",
                                fontSize: "14px",
                                color: "#334155",
                                outline: "none",
                                '&:empty:before': {
                                    content: '"Enter note here..."',
                                    color: '#94a3b8',
                                    pointerEvents: 'none',
                                },
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
                        disabled={!note.trim() && (!editorRef.current || !editorRef.current.innerText.trim())}
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
