import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    IconButton,
    Collapse,
    Avatar,
    Divider,
} from "@mui/material";
import {
    KeyboardArrowDown as ArrowDownIcon,
    KeyboardArrowRight as ArrowRightIcon,
    AttachFile as AttachFileIcon,
} from "@mui/icons-material";
import { Chip } from "@mui/material";


export default function LeadEmails({ onOpenCompose, searchQuery = "", activities = [] }) {
    const [expanded, setExpanded] = useState({ 1: true });

    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Filter emails based on search query
    const filteredEmails = activities.filter((email) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            (email.subject && email.subject.toLowerCase().includes(query)) ||
            (email.description && email.description.toLowerCase().includes(query))
        );
    });

    const parseEmailContent = (description) => {
        if (!description) return { cleanText: description, attachedFiles: [] };

        let cleanText = description;
        let attachedFiles = [];

        const attachedFilesMatch = cleanText.match(/Attached Files:\s*(.+)$/m);
        if (attachedFilesMatch && attachedFilesMatch[1] && attachedFilesMatch[1].trim() !== "None") {
            attachedFiles = attachedFilesMatch[1].split(',').map(f => f.trim());
        }

        // Clean up the meta text from the description body so it looks like a real email
        cleanText = cleanText.replace(/Attachments:\s*\d+\s*\n?/g, '');
        cleanText = cleanText.replace(/Attached Files:\s*(.+)\s*\n?/g, '');

        return { cleanText: cleanText.trim(), attachedFiles };
    };

    return (
        <Box>
            {/* Header Row */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h6" fontWeight={700} color="#1e293b">
                    Emails
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => {
                        if (onOpenCompose) {
                            onOpenCompose();
                        }
                    }}
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
                    Create Email
                </Button>
            </Stack>

            {/* Group: June 2025 */}
            <Typography variant="subtitle2" fontWeight={700} color="#1e293b" mb={2}>
                June 2025
            </Typography>

            {filteredEmails.map((email) => (
                <Paper
                    key={email.id}
                    elevation={0}
                    sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        overflow: "hidden",
                        mb: 2,
                    }}
                >
                    {/* Email Header */}
                    <Box
                        onClick={() => toggleExpand(email.id)}
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
                            <IconButton size="small" sx={{ color: "#5B4DDB", p: 0, mt: 0.5 }}>
                                {expanded[email.id] ? (
                                    <ArrowDownIcon fontSize="small" />
                                ) : (
                                    <ArrowRightIcon fontSize="small" />
                                )}
                            </IconButton>

                            <Box>
                                <Typography variant="body2" fontWeight={700} color="#1e293b" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span>Logged Email - {email.subject || "No Subject"}</span>
                                </Typography>
                                {/* Show preview if collapsed */}
                                {!expanded[email.id] && (
                                    <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
                                        {email.description ? email.description.substring(0, 80) + "..." : ""}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Typography variant="caption" color="#94a3b8" sx={{ whiteSpace: 'nowrap', ml: 2 }}>
                            {email.createdAt ? new Date(email.createdAt).toLocaleString() : ""}
                        </Typography>
                    </Box>

                    {/* Email Content */}
                    <Collapse in={expanded[email.id]}>
                        <Box sx={{ px: 5, pb: 4 }}>
                            {(() => {
                                const { cleanText, attachedFiles } = parseEmailContent(email.description);
                                return (
                                    <>
                                        <Typography
                                            variant="body2"
                                            color="#334155"
                                            sx={{
                                                whiteSpace: 'pre-wrap',
                                                lineHeight: 1.6,
                                                fontFamily: "'Inter', sans-serif"
                                            }}
                                        >
                                            {cleanText || "No content body available."}
                                        </Typography>

                                        {attachedFiles.length > 0 && (
                                            <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed #e2e8f0' }}>
                                                <Typography variant="caption" color="#64748b" fontWeight={600} display="block" mb={1}>
                                                    Attachments ({attachedFiles.length})
                                                </Typography>
                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                    {attachedFiles.map((fileName, idx) => (
                                                        <Chip
                                                            key={idx}
                                                            icon={<AttachFileIcon sx={{ fontSize: '14px !important' }} />}
                                                            label={fileName}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                bgcolor: '#f8fafc',
                                                                color: '#475569',
                                                                borderColor: '#e2e8f0',
                                                                borderRadius: '6px',
                                                                fontWeight: 500,
                                                                "& .MuiChip-icon": { color: '#64748b' }
                                                            }}
                                                        />
                                                    ))}
                                                </Stack>
                                            </Box>
                                        )}
                                    </>
                                );
                            })()}
                        </Box>
                    </Collapse>
                </Paper>
            ))}
        </Box>
    );
}
