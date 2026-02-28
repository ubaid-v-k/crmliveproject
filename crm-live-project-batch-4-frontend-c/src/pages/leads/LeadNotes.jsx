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
import { createActivity } from "../../api/activities.api";

export default function LeadNotes({ searchQuery = "", activities = [], entityType, entityId, refreshActivities }) {
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
        // Parent functionality if needed
        handleMenuClose();
    };

    const handleSaveNote = async (noteContent) => {
        try {
            await createActivity({
                type: "note",
                subject: `Note created on ${new Date().toLocaleDateString()}`,
                description: noteContent,
                [entityType]: entityId
            });
            if (refreshActivities) {
                refreshActivities();
            }
        } catch (error) {
            console.error("Failed to create note", error);
        }
        setExpanded((prev) => ({ ...prev, [Date.now()]: true }));
        setCreateOpen(false);
    };

    const handleDrawerClose = () => {
        setCreateOpen(false);
        setEditNoteContent(null);
        setSelectedNoteId(null);
    };

    // Filter notes based on search query
    const parsedNotes = activities.filter(a => a.type === "note");

    const filteredNotes = parsedNotes.filter((note) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            (note.description && note.description.toLowerCase().includes(query)) ||
            (note.subject && note.subject.toLowerCase().includes(query))
        );
    });

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

            {filteredNotes.map((note) => (
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
                                Note <span style={{ fontWeight: 400, color: "#64748b" }}>by {note.user || "System"} {note.subject ? `- ${note.subject}` : ''}</span>
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="caption" color="#94a3b8">
                                {note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}
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
                            <Box
                                sx={{
                                    typography: 'body2',
                                    color: '#64748b',
                                    '& ul': { paddingLeft: 2, margin: '8px 0' },
                                    '& ol': { paddingLeft: 2, margin: '8px 0' },
                                    '& img': { maxWidth: '100%', height: 'auto', borderRadius: '8px', mt: 1 },
                                    '& h1': { fontSize: '24px', fontWeight: 600, mt: 2, mb: 1, color: '#1e293b' },
                                    '& h2': { fontSize: '20px', fontWeight: 600, mt: 2, mb: 1, color: '#1e293b' },
                                    '& p': { margin: '0 0 8px 0' },
                                    '&:last-child > *:last-child': { marginBottom: 0 }
                                }}
                                dangerouslySetInnerHTML={{ __html: note.description || note.content || "No content" }}
                            />
                        </Box>
                    </Collapse>
                </Paper>
            ))}
        </Box>
    );
}
