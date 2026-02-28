import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Grid,
    Typography,
    Paper,
    Divider,
    Stack,
    IconButton,
    Avatar,
    Tabs,
    Tab,
    Button,
    Collapse,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
    List,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
    NoteOutlined as NoteIcon,
    EmailOutlined as EmailIcon,
    PhoneOutlined as PhoneIcon,
    TaskOutlined as TaskIcon,
    VideocamOutlined as VideocamIcon,
    Search as SearchIcon,
    RadioButtonUnchecked as UncheckedIcon,
    AutoAwesome as AutoAwesomeIcon,
} from "@mui/icons-material";

import { useTickets } from "../../context/TicketsContext";
import { createNotification } from "../../api/dashboard.api";
import { fetchActivities, generateAiSummary } from "../../api/activities.api";
import axios from "axios";
import ActivityFeed from "../../components/common/ActivityFeed";

// Reuse Lead components as requested
import LeadNotes from "../leads/LeadNotes";
import LeadEmails from "../leads/LeadEmails";
import LeadCalls from "../leads/LeadCalls";
import LeadTasks from "../leads/LeadTasks";
import LeadMeetings from "../leads/LeadMeetings";

// Components
import AttachmentsSection from "../../components/common/AttachmentsSection";
import ComposeEmailDialog from "../../components/common/ComposeEmailDialog";
import CreateTicket from "./CreateTicket";

const PRIMARY = "#5B4DDB";

export default function TicketDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getTicket, updateTicket } = useTickets();

    const ticket = getTicket(id);

    // UI state
    const [aboutOpen, setAboutOpen] = useState(true);
    const [composeOpen, setComposeOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [editOpen, setEditOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter states
    const [activities, setActivities] = useState([]);
    const [aiSummary, setAiSummary] = useState("Loading summary...");
    const [files, setFiles] = useState([]);

    const loadActivities = async () => {
        if (!ticket) return;
        const data = await fetchActivities('ticket', id);
        setActivities(data);
    };

    const loadSummary = async () => {
        if (!ticket) return;
        setAiSummary("Loading summary...");
        const summary = await generateAiSummary('ticket', id, files.length);
        setAiSummary(summary);
    };

    useEffect(() => {
        loadSummary();
    }, [files]);

    useEffect(() => {
        loadActivities();
        loadSummary();
    }, [id, ticket]);

    const completeTask = async (taskId) => {
        try {
            const token = localStorage.getItem("crm_user_token");
            await axios.patch(`http://localhost:8000/api/core/activities/${taskId}/`, { status: 'completed' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { toast } = require("react-toastify");
            toast.success("Task marked as completed");
            loadActivities(); // Refresh feed
            loadSummary();    // Refresh summary
        } catch (error) {
            const { toast } = require("react-toastify");
            toast.error("Failed to complete task");
        }
    };

    // Graceful fallback
    if (!ticket) {
        return (
            <Box p={4}>
                <Typography>Ticket not found.</Typography>
                <Button onClick={() => navigate("/tickets")}>Back to Tickets</Button>
            </Box>
        );
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Helper renderers
    const renderActivityIcon = (type) => {
        switch (type) {
            case "call": return <PhoneIcon sx={{ fontSize: 18, color: "#64748b" }} />;
            case "meeting": return <VideocamIcon sx={{ fontSize: 18, color: "#64748b" }} />;
            case "email": return <EmailIcon sx={{ fontSize: 18, color: "#64748b" }} />;
            case "note": return <NoteIcon sx={{ fontSize: 18, color: "#64748b" }} />;
            default: return <TaskIcon sx={{ fontSize: 18, color: "#64748b" }} />;
        }
    };

    // Status enforcement logic
    const [anchorEl, setAnchorEl] = useState(null);

    const handleStatusChange = (newStatus) => {
        setAnchorEl(null);
        if (newStatus === ticket.status) return;
        updateTicket(ticket.id, { status: newStatus });
    };

    return (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, height: { xs: "auto", md: "100%" }, alignItems: "stretch", overflow: { xs: "auto", md: "hidden" } }}>
            {/* 1. LEFT SIDEBAR (Info & Actions) */}
            <Box sx={{ width: { xs: "100%", md: "320px" }, borderRight: { xs: "none", md: "1px solid #e2e8f0" }, borderBottom: { xs: "1px solid #e2e8f0", md: "none" }, bgcolor: "#fff", p: 3, flexShrink: 0, overflowY: { xs: "visible", md: "auto" } }}>
                {/* Back Button */}
                <Button
                    startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                    onClick={() => navigate("/tickets")}
                    sx={{
                        color: "#64748b",
                        textTransform: "none",
                        fontSize: "14px",
                        p: 0,
                        minWidth: "auto",
                        mb: 2,
                        "&:hover": { bgcolor: "transparent", textDecoration: "underline" }
                    }}
                >
                    Tickets
                </Button>

                {/* Title & Info */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: "#e2e8f0",
                                borderRadius: "12px"
                            }}
                            variant="rounded"
                        >
                            <Box component="span" sx={{ fontSize: 24 }}>🎫</Box>
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={700} color="#1e293b" sx={{ lineHeight: 1.2 }}>
                                {ticket.subject}
                            </Typography>
                            <Typography variant="body2" color="#64748b" mt={0.5}>
                                Priority: {ticket.priority}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Status */}
                <Stack direction="row" alignItems="center" spacing={0.5} mb={3}>
                    <Typography variant="body2" color="#64748b">Status :</Typography>
                    <Box sx={{ position: "relative" }}>
                        <Button
                            size="small"
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                color: PRIMARY,
                                padding: 0,
                                minWidth: "auto",
                                "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                            }}
                        >
                            {ticket.status}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            {["Open", "In Progress", "Waiting on Customer", "Closed"].map((status) => (
                                <MenuItem
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    selected={status === ticket.status}
                                >
                                    {status}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" spacing={1.5} mb={4} sx={{ overflowX: "auto", pb: 1 }}>
                    {[
                        { label: "Note", icon: <NoteIcon fontSize="small" />, type: "note" },
                        { label: "Email", icon: <EmailIcon fontSize="small" />, type: "email" },
                        { label: "Call", icon: <PhoneIcon fontSize="small" />, type: "call" },
                        { label: "Task", icon: <TaskIcon fontSize="small" />, type: "task" },
                        { label: "Meeting", icon: <VideocamIcon fontSize="small" />, type: "meeting" }
                    ].map((action, i) => (
                        <Stack
                            key={i}
                            alignItems="center"
                            spacing={1}
                            sx={{ cursor: "pointer", minWidth: 50 }}
                            onClick={async () => {
                                if (action.type === "email") {
                                    setTabValue(2); // Emails tab
                                } else if (action.type === "call") {
                                    await createNotification("Outbound Call", `Initiated call regarding Ticket: ${ticket?.subject}`, "info");
                                    window.location.href = `tel:${ticket?.contactPhone || "+919497180892"}`;
                                } else if (action.type === "note") {
                                    setTabValue(1); // Notes tab
                                } else if (action.type === "task") {
                                    setTabValue(4); // Tasks tab
                                } else if (action.type === "meeting") {
                                    await createNotification("Google Meet Scheduled", `Started Meeting for Ticket: ${ticket?.subject}`, "info");
                                    window.open("https://meet.google.com/new", "_blank");
                                }
                            }}
                        >
                            <Box sx={{
                                width: 42,
                                height: 42,
                                borderRadius: "10px",
                                bgcolor: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: PRIMARY,
                                transition: "all 0.2s",
                                "&:hover": { borderColor: PRIMARY, bgcolor: "#e0e7ff" }
                            }}>
                                {action.icon}
                            </Box>
                            <Typography variant="caption" color="#64748b" fontSize="11px">{action.label}</Typography>
                        </Stack>
                    ))}
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* About This Ticket */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2, cursor: "pointer" }}
                    onClick={() => setAboutOpen(!aboutOpen)}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {aboutOpen ? (
                            <KeyboardArrowDownIcon fontSize="small" color="primary" />
                        ) : (
                            <KeyboardArrowRightIcon fontSize="small" color="primary" />
                        )}
                        <Typography variant="subtitle2" fontWeight={700} color="#1e293b">
                            About this Ticket
                        </Typography>
                    </Stack>
                    <IconButton size="small" onClick={() => setEditOpen(true)}>
                        <EditIcon fontSize="small" sx={{ fontSize: 16, color: PRIMARY }} />
                    </IconButton>
                </Stack>

                <Collapse in={aboutOpen}>
                    <Stack spacing={2.5} pl={1}>
                        {[
                            { label: "Subject", value: ticket.subject },
                            { label: "Assigned To", value: ticket.assignedTo },
                            { label: "Associated Company", value: ticket.associatedCompany },
                            { label: "Associated Contact", value: ticket.associatedContact },
                            { label: "Priority", value: ticket.priority },
                            { label: "Created Date", value: ticket.createdDate || "04/08/2025 2:31 PM GMT+5:30" },
                        ].map((field, i) => (
                            <Box key={i}>
                                <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>
                                    {field.label}
                                </Typography>
                                <Typography variant="body2" fontWeight={600} color="#1e293b">
                                    {field.value}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Collapse>
            </Box>

            {/* 2. CENTER CONTENT (Feed) */}
            <Box sx={{ flex: 1, bgcolor: "#fff", p: 3, borderRight: { xs: "none", md: "1px solid #e2e8f0" }, borderBottom: { xs: "1px solid #e2e8f0", md: "none" }, overflowY: { xs: "visible", md: "auto" } }}>
                {/* Search */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Search activities"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": { bgcolor: "#f8fafc", borderRadius: "8px" },
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="ticket tabs"
                        sx={{
                            "& .MuiTab-root": {
                                textTransform: "none",
                                fontWeight: 500,
                                fontSize: "0.9rem",
                                minWidth: "auto",
                                mr: 2,
                                color: "#64748b"
                            },
                            "& .Mui-selected": {
                                color: PRIMARY,
                                fontWeight: 600,
                            },
                            "& .MuiTabs-indicator": {
                                backgroundColor: PRIMARY,
                            },
                        }}
                    >
                        <Tab label="Activity" />
                        <Tab label="Notes" />
                        <Tab label="Emails" />
                        <Tab label="Calls" />
                        <Tab label="Tasks" />
                        <Tab label="Meetings" />
                    </Tabs>
                </Box>

                {/* Tab Panels */}
                {tabValue === 0 ? (
                    <Box>
                        <ActivityFeed activities={activities} searchQuery={searchQuery} onCompleteTask={completeTask} />
                    </Box>
                ) : tabValue === 1 ? (
                    <LeadNotes searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'note')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="ticket" entityId={id} />
                ) : tabValue === 2 ? (
                    <LeadEmails onOpenCompose={() => setComposeOpen(true)} searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'email')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="ticket" entityId={id} />
                ) : tabValue === 3 ? (
                    <LeadCalls searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'call')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="ticket" entityId={id} />
                ) : tabValue === 4 ? (
                    <LeadTasks searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'task')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="ticket" entityId={id} />
                ) : tabValue === 5 ? (
                    <LeadMeetings searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'meeting')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="ticket" entityId={id} />
                ) : null}
            </Box>

            {/* 3. RIGHT SIDEBAR (Widgets) */}
            <Box sx={{ width: { xs: "100%", md: "350px" }, bgcolor: "#fff", p: 3, flexShrink: 0, overflowY: { xs: "visible", md: "auto" } }}>
                {/* AI Ticket Summary */}
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        borderRadius: "12px",
                        borderColor: "#818cf8",
                        bgcolor: "#fff",
                        mb: 4,
                        boxShadow: "0 4px 12px rgba(91, 77, 219, 0.08)"
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                        <Box sx={{ display: "flex", p: 0.5, bgcolor: "#e0e7ff", borderRadius: "6px" }}>
                            <AutoAwesomeIcon sx={{ fontSize: 16, color: PRIMARY }} />
                        </Box>
                        <Typography variant="subtitle2" fontWeight={700} color={PRIMARY}>
                            AI Ticket Summary
                        </Typography>
                    </Stack>
                    <Typography variant="body2" color="#1e293b" fontSize="13px" sx={{ lineHeight: 1.5 }}>
                        {aiSummary}
                    </Typography>
                </Paper>

                {/* Attachments */}
                <AttachmentsSection files={files} onFilesChange={setFiles} />
            </Box>

            {/* Tracked Email Modal */}
            <ComposeEmailDialog
                open={composeOpen}
                onClose={() => setComposeOpen(false)}
                leadId={id}
                attachedFiles={files.map(f => f.file)}
            />
            {/* Edit Ticket Drawer */}
            <CreateTicket
                open={editOpen}
                onClose={() => setEditOpen(false)}
                editData={{
                    subject: ticket.subject,
                    assignedTo: ticket.assignedTo,
                    associatedCompany: ticket.associatedCompany,
                    associatedContact: ticket.associatedContact,
                    priority: ticket.priority,
                    status: ticket.status,
                }}
                onSave={(updatedTicket) => {
                    console.log("Updated ticket:", updatedTicket);
                }}
            />
        </Box>
    );
}
