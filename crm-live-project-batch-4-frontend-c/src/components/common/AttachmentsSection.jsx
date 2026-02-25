import React, { useState, useRef } from "react";
import {
    Box,
    Typography,
    Stack,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from "@mui/material";
import {
    KeyboardArrowDown as ArrowDownIcon,
    KeyboardArrowRight as ArrowRightIcon,
    Add as AddIcon,
    InsertDriveFile as FileIcon,
    Image as ImageIcon,
    Delete as DeleteIcon,
    AttachFile as AttachFileIcon,
} from "@mui/icons-material";

const PRIMARY = "#5B4DDB";

export default function AttachmentsSection() {
    const [isOpen, setIsOpen] = useState(true);
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleAddClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files).map((file) => ({
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file), // Create preview URL
        }));
        setFiles((prev) => [...prev, ...newFiles]);
        // Reset input so same file can be selected again if needed
        event.target.value = "";
    };

    const handleDelete = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const renderFileIcon = (type) => {
        if (type.startsWith("image/")) return <ImageIcon sx={{ color: PRIMARY }} />;
        return <FileIcon sx={{ color: "#64748b" }} />;
    };

    return (
        <Box>
            {/* Hidden File Input */}
            <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            {/* Header */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ cursor: "pointer" }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <ArrowDownIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                    ) : (
                        <ArrowRightIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                    )}
                    <Typography variant="subtitle2" fontWeight={700} color="#1e293b">
                        Attachments
                    </Typography>
                </Stack>
                <Button
                    size="small"
                    startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                    sx={{
                        textTransform: "none",
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        minWidth: "auto",
                        color: PRIMARY,
                        fontWeight: 600,
                    }}
                    onClick={handleAddClick}
                >
                    Add
                </Button>
            </Stack>

            {/* Content */}
            {isOpen && (
                <Box sx={{ pl: 0 }}>
                    {files.length === 0 ? (
                        <Typography variant="caption" color="#94a3b8" sx={{ pl: 3.5, display: "block" }}>
                            See the files attached to your activities or uploaded to this record.
                        </Typography>
                    ) : (
                        <List disablePadding>
                            {files.map((file, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        pl: 3.5,
                                        py: 0.5,
                                        "&:hover .delete-btn": { opacity: 1 },
                                    }}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            size="small"
                                            className="delete-btn"
                                            sx={{ opacity: 0, transition: "opacity 0.2s" }}
                                            onClick={() => handleDelete(index)}
                                        >
                                            <DeleteIcon fontSize="small" sx={{ fontSize: 16, color: "#ef4444" }} />
                                        </IconButton>
                                    }
                                >
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        {renderFileIcon(file.type)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body2"
                                                fontSize="13px"
                                                color="#334155"
                                                sx={{
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    maxWidth: "180px",
                                                    cursor: "pointer",
                                                    "&:hover": { textDecoration: "underline", color: PRIMARY }
                                                }}
                                                onClick={() => window.open(file.url, "_blank")}
                                            >
                                                {file.name}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            )}
        </Box>
    );
}
