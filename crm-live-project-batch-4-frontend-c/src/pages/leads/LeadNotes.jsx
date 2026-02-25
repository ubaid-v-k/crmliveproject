import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    IconButton,
    Collapse,
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
import CreateNote from "./CreateNote";

export default function LeadNotes() {
    const [notes, setNotes] = useState([
        {
            id: 1,
            author: "Maria Johnson",
            date: "June 24, 2025 at 5:30PM",
            content: "Sample Note",
            month: "June 2025",
        }
    ]);
    const [expanded, setExpanded] = useState({ 1: true });
    const [isCreateOpen, setCreateOpen] = useState(false);

    // Edit/Delete State
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [editNoteContent, setEditNoteContent] = useState(null);

    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleMenuClick = (event, note) => {
        event.stopPropagation(); // Prevent toggling expand
        setAnchorEl(event.currentTarget);
        setSelectedNoteId(note.id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedNoteId(null);
    };

    const handleEditClick = () => {
        const noteToEdit = notes.find(n => n.id === selectedNoteId);
        if (noteToEdit) {
            setEditNoteContent(noteToEdit.content);
            setCreateOpen(true);
        }
        handleMenuClose();
    };

    const handleDeleteClick = () => {
        setNotes(prev => prev.filter(n => n.id !== selectedNoteId));
        handleMenuClose();
    };

    const handleSaveNote = (noteContent) => {
        if (editNoteContent !== null) {
            // Updating existing note
            setNotes(prev => prev.map(n =>
                n.id === selectedNoteId ? { ...n, content: noteContent } : n
            ));
            setEditNoteContent(null);
            setSelectedNoteId(null);
        } else {
            // Creating new note
            const newNote = {
                id: Date.now(),
                author: "You",
                date: new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }),
                content: noteContent,
                month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
            };
            setNotes((prev) => [newNote, ...prev]);
            setExpanded((prev) => ({ ...prev, [newNote.id]: true }));
        }
        setCreateOpen(false);
    };

    const handleDrawerClose = () => {
        setCreateOpen(false);
        setEditNoteContent(null); // Reset edit state on close
        setSelectedNoteId(null);
    };

    return (
        <Box>
            <CreateNote
                open={isCreateOpen}
                onClose={handleDrawerClose}
                onSave={handleSaveNote}
                initialData={editNoteContent}
            />

            {/* Menu for Edit/Delete */}
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
                    Notes
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
                    Create Note
                </Button>
            </Stack>

            {/* Group Header */}
            <Typography variant="subtitle2" fontWeight={700} color="#1e293b" mb={2}>
                Recent Notes
            </Typography>

            {notes.map((note) => (
                <Paper
                    key={note.id}
                    elevation={0}
                    sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        overflow: "hidden",
                        mb: 2,
                    }}
                >
                    {/* Note Header */}
                    <Box
                        onClick={() => toggleExpand(note.id)}
                        sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton size="small" sx={{ color: "#5B4DDB", p: 0 }}>
                                {expanded[note.id] ? (
                                    <ArrowDownIcon fontSize="small" />
                                ) : (
                                    <ArrowRightIcon fontSize="small" />
                                )}
                            </IconButton>
                            <Typography variant="body2" fontWeight={600} color="#334155">
                                Note <span style={{ fontWeight: 400, color: "#64748b" }}>by {note.author}</span>
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="caption" color="#94a3b8">
                                {note.date}
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={(e) => handleMenuClick(e, note)}
                                sx={{ color: '#94a3b8', p: 0.5 }}
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Note Content */}
                    <Collapse in={expanded[note.id]}>
                        <Box sx={{ px: 5, pb: 2 }}>
                            <Typography variant="body2" color="#64748b">
                                {note.content}
                            </Typography>
                        </Box>
                    </Collapse>
                </Paper>
            ))}
        </Box>
    );
}
