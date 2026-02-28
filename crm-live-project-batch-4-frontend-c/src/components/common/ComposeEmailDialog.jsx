import React, { useState, useRef } from "react";
import {
    Dialog,
    Box,
    Typography,
    IconButton,
    InputBase,
    Divider,
    Button,
    ButtonGroup,
    Chip,
    Stack,
    CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LinkIcon from "@mui/icons-material/Link";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import ImageIcon from "@mui/icons-material/Image";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api";
const SESSION_KEY = "crm_user_token";

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(SESSION_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default function ComposeEmailDialog({ open, onClose, leadId, attachedFiles = [] }) {
    const TARGET_EMAIL = "ferraricrm30@gmail.com";

    const [subject, setSubject] = useState("");
    const [ccOpen, setCcOpen] = useState(false);
    const [bccOpen, setBccOpen] = useState(false);
    const [cc, setCc] = useState("");
    const [bcc, setBcc] = useState("");
    const [sending, setSending] = useState(false);

    // Attachments
    const [attachments, setAttachments] = useState([]);
    const fileInputRef = useRef(null);
    const editorRef = useRef(null);

    React.useEffect(() => {
        if (open) {
            setAttachments(attachedFiles);
        }
    }, [open]);

    const handleRemoveAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    // Rich Text Commands
    const triggerCommand = (command) => {
        document.execCommand(command, false, null);
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    const handleLink = () => {
        const url = prompt("Enter the link here: ", "http://");
        if (url) {
            document.execCommand("createLink", false, url);
        }
    };

    const insertEmoji = () => {
        document.execCommand("insertText", false, "😊");
    };

    const handleSend = async () => {
        if (!subject.trim()) {
            toast.error("Subject is required");
            return;
        }

        const bodyHtml = editorRef.current ? editorRef.current.innerHTML : "";
        if (!bodyHtml.trim()) {
            toast.error("Message body is required");
            return;
        }

        setSending(true);

        try {
            const formData = new FormData();
            formData.append("lead_id", leadId);
            formData.append("to", TARGET_EMAIL);
            if (cc) formData.append("cc", cc);
            if (bcc) formData.append("bcc", bcc);
            formData.append("subject", subject);
            formData.append("body", bodyHtml);

            attachments.forEach((file) => {
                formData.append("attachments", file);
            });

            // Let axios automatically figure out Content-Type and boundary for FormData
            const response = await api.post("/core/send-email/", formData);

            if (response.data.success || response.status === 200) {
                toast.success("Email sent successfully!");
                handleDiscard();
            } else {
                toast.error("Failed to send email");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.detail || "An error occurred while sending the email");
        } finally {
            setSending(false);
        }
    };

    const handleDiscard = () => {
        setSubject("");
        setCc("");
        setBcc("");
        setCcOpen(false);
        setBccOpen(false);
        setAttachments([]);
        if (editorRef.current) {
            editorRef.current.innerHTML = "";
        }
        if (!sending) onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={() => !sending && onClose()}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: "75vh",
                    display: "flex",
                    flexDirection: "column"
                }
            }}
        >
            {/* Header */}
            <Box sx={{
                bgcolor: "#6c5ce7",
                color: "#fff",
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <Typography variant="subtitle1" fontWeight={600}>
                    New Email
                </Typography>
                <IconButton size="small" onClick={() => !sending && onClose()} sx={{ color: "#fff" }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Content Area */}
            <Box sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>

                {/* Recipients Row */}
                <Box sx={{ display: "flex", alignItems: "center", px: 3, py: 1.5 }}>
                    <Typography variant="body2" sx={{ color: "#94a3b8", width: 80 }}>
                        Recipients
                    </Typography>
                    <InputBase
                        fullWidth
                        value={TARGET_EMAIL}
                        readOnly
                        sx={{ fontSize: "14px", color: "#334155" }}
                    />
                    <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
                        {!ccOpen && (
                            <Typography
                                variant="caption"
                                color="#64748b"
                                sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                                onClick={() => setCcOpen(true)}
                            >
                                Cc
                            </Typography>
                        )}
                        {!bccOpen && (
                            <Typography
                                variant="caption"
                                color="#64748b"
                                sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                                onClick={() => setBccOpen(true)}
                            >
                                Bcc
                            </Typography>
                        )}
                    </Stack>
                </Box>
                <Divider />

                {/* CC Row */}
                {ccOpen && (
                    <>
                        <Box sx={{ display: "flex", alignItems: "center", px: 3, py: 1.5 }}>
                            <Typography variant="body2" sx={{ color: "#94a3b8", width: 80 }}>Cc</Typography>
                            <InputBase
                                fullWidth
                                value={cc}
                                onChange={(e) => setCc(e.target.value)}
                                sx={{ fontSize: "14px", color: "#334155" }}
                                placeholder="cc@example.com"
                            />
                        </Box>
                        <Divider />
                    </>
                )}

                {/* BCC Row */}
                {bccOpen && (
                    <>
                        <Box sx={{ display: "flex", alignItems: "center", px: 3, py: 1.5 }}>
                            <Typography variant="body2" sx={{ color: "#94a3b8", width: 80 }}>Bcc</Typography>
                            <InputBase
                                fullWidth
                                value={bcc}
                                onChange={(e) => setBcc(e.target.value)}
                                sx={{ fontSize: "14px", color: "#334155" }}
                                placeholder="bcc@example.com"
                            />
                        </Box>
                        <Divider />
                    </>
                )}

                {/* Subject Row */}
                <Box sx={{ display: "flex", alignItems: "center", px: 3, py: 1.5 }}>
                    <Typography variant="body2" sx={{ color: "#94a3b8", width: 80 }}>
                        Subject
                    </Typography>
                    <InputBase
                        fullWidth
                        placeholder="Enter subject here"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        sx={{ fontSize: "14px", color: "#334155", fontWeight: 500 }}
                    />
                </Box>
                <Divider />

                {/* Message Body */}
                <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column" }}>
                    <Box
                        sx={{ mb: 1 }}
                        onClick={() => editorRef.current && editorRef.current.focus()}
                    >
                        {attachments.length === 0 && (
                            <Typography variant="body2" color="#cbd5e1" sx={{ position: "absolute", pointerEvents: "none" }}>
                                Body Text
                            </Typography>
                        )}
                        <div
                            ref={editorRef}
                            contentEditable={!sending}
                            style={{
                                width: "100%",
                                minHeight: "200px",
                                outline: "none",
                                border: "none",
                                fontSize: "14px",
                                color: "#334155",
                                lineHeight: "1.6",
                                zIndex: 1,
                                position: "relative"
                            }}
                            onInput={(e) => {
                                // hide placeholder text logic could go here
                                const pl = e.target.previousSibling;
                                if (pl) {
                                    pl.style.display = e.target.innerHTML.trim() ? "none" : "block";
                                }
                            }}
                        />
                    </Box>

                    {/* Attachment Chips */}
                    {attachments.length > 0 && (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2, pt: 2, borderTop: "1px dashed #e2e8f0" }}>
                            {attachments.map((file, idx) => (
                                <Chip
                                    key={idx}
                                    label={file.name}
                                    onDelete={() => handleRemoveAttachment(idx)}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Footer Toolbar */}
            <Box sx={{
                px: 3,
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#fff"
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* Send Button Group */}
                    <ButtonGroup variant="contained" disableElevation>
                        <Button
                            onClick={handleSend}
                            disabled={sending}
                            sx={{
                                bgcolor: "#6c5ce7",
                                textTransform: "none",
                                fontWeight: 600,
                                px: 3,
                                "&:hover": { bgcolor: "#5b4ddb" }
                            }}
                        >
                            {sending ? <CircularProgress size={20} color="inherit" /> : "Send"}
                        </Button>
                        <Button
                            size="small"
                            disabled={sending}
                            sx={{
                                bgcolor: "#6c5ce7",
                                px: 1,
                                "&:hover": { bgcolor: "#5b4ddb" }
                            }}
                        >
                            <ArrowDropDownIcon />
                        </Button>
                    </ButtonGroup>

                    {/* Formatting Icons */}
                    <Stack direction="row" spacing={0.5} sx={{ color: "#64748b" }}>
                        <IconButton size="small" onClick={() => triggerCommand("underline")}>
                            <FormatUnderlinedIcon fontSize="small" sx={{ color: "inherit" }} />
                        </IconButton>
                        <IconButton size="small" onClick={handleLink}>
                            <LinkIcon fontSize="small" sx={{ color: "inherit" }} />
                        </IconButton>
                        <IconButton size="small" onClick={insertEmoji}>
                            <EmojiEmotionsOutlinedIcon fontSize="small" sx={{ color: "inherit" }} />
                        </IconButton>
                    </Stack>
                </Box>

                {/* Trash Icon */}
                <IconButton size="small" onClick={handleDiscard} sx={{ color: "#64748b" }}>
                    <DeleteOutlineIcon fontSize="small" />
                </IconButton>
            </Box>
        </Dialog>
    );
}
