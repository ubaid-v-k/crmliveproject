import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Grid,
    Typography,
    Paper,
    Stack,
    IconButton,
    Tabs,
    Tab,
    Button,
    Collapse,
    Avatar,
    Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
    NoteOutlined as NoteIcon,
    EmailOutlined as EmailIcon,
    PhoneOutlined as PhoneIcon,
    TaskOutlined as TaskIcon,
    VideocamOutlined as VideocamIcon,
    CheckCircleOutline,
    CircleOutlined,
} from "@mui/icons-material";

import { createNotification } from "../../api/dashboard.api";

import { useTickets } from "../../context/TicketsContext";

// Reusing Lead components for consistency
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

// Mock Activities
const UPCOMING_ACTIVITIES = [
    {
        id: 1,
        title: "Ticket activity",
        description: "Maria Johnson moved ticket to new",
        date: "June 24, 2025 at 5:30PM",
    },
];

export default function TicketDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getTicket } = useTickets();

    const ticket = getTicket(id);

    // Graceful fallback
    if (!ticket) {
        return (
            <Box p={4}>
                <Typography>Ticket not found.</Typography>
                <Button onClick={() => navigate("/tickets")}>Back to Tickets</Button>
            </Box>
        );
    }

    // UI state
    const [aboutOpen, setAboutOpen] = useState(true);
    const [composeOpen, setComposeOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [editOpen, setEditOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
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
                                {ticket.title}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Status */}
                <Stack direction="row" alignItems="center" spacing={0.5} mb={3}>
                    <Typography variant="body2" color="#64748b">Status :</Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography variant="body2" color={PRIMARY} fontWeight={600}>
                            {ticket.status}
                        </Typography>
                        <KeyboardArrowDownIcon fontSize="small" color="action" />
                    </Stack>
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
                                    await createNotification("Outbound Call", `Initiated call regarding Ticket: ${ticket?.title}`, "info");
                                    window.location.href = `tel:+919497180892`;
                                } else if (action.type === "note") {
                                    setTabValue(1); // Notes tab
                                } else if (action.type === "task") {
                                    setTabValue(4); // Tasks tab
                                } else if (action.type === "meeting") {
                                    await createNotification("Google Meet Scheduled", `Started Meeting for Ticket: ${ticket?.title}`, "info");
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
                            <KeyboardArrowUpIcon fontSize="small" color="primary" />
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
                            { label: "Ticket Description", value: ticket.description || "Description goes here" },
                            { label: "Ticket Owner", value: ticket.owner },
                            { label: "Association", value: ticket.companyId ? "Company: Acme Corp" : ticket.dealId ? "Deal: Big Merger" : "None" }, // Mock label lookup
                            { label: "Priority", value: ticket.priority },
                            { label: "Created Date", value: ticket.created || "04/08/2025 2:31 PM GMT+5:30" },
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
                {/* Search Activities */}
                <Box sx={{ mb: 3 }}>
                    <Box
                        sx={{
                            p: 1,
                            px: 2,
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            backgroundColor: "#f8fafc",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "#94a3b8"
                        }}
                    >
                        <Box component="span">🔍</Box>
                        <input
                            placeholder="Search activities"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: '#334155' }}
                        />
                    </Box>

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
                {tabValue === 0 && (
                    <Box>
                        <Typography variant="subtitle2" fontWeight={700} color="#1e293b" mb={2}>
                            Upcoming
                        </Typography>

                        {/* Activity Cards */}
                        {UPCOMING_ACTIVITIES
                            .filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.description.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((activity) => (
                                <Paper
                                    key={activity.id}
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        mb: 2,
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="flex-start"
                                    >
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={600} color="#1e293b" gutterBottom>
                                                {activity.title}
                                            </Typography>
                                            <Typography variant="body2" color="#64748b">
                                                {activity.description}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" color="#94a3b8">
                                            {activity.date}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            ))}

                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                mb: 2,
                            }}
                        >
                            <Typography variant="caption" color="#64748b">
                                This ticket was created by <strong>{ticket.owner}</strong> {ticket.created}
                            </Typography>
                        </Paper>
                    </Box>
                )}
                {tabValue === 1 && <LeadNotes />}
                {tabValue === 2 && <LeadEmails onOpenCompose={() => setComposeOpen(true)} />}
                {tabValue === 3 && <LeadCalls />}
                {tabValue === 4 && <LeadTasks />}
                {tabValue === 5 && <LeadMeetings />}
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
                            <Box component="span" sx={{ fontSize: 16 }}>✨</Box>
                        </Box>
                        <Typography variant="subtitle2" fontWeight={700} color={PRIMARY}>
                            AI Ticket Summary
                        </Typography>
                    </Stack>
                    <Typography variant="body2" color="#1e293b" fontSize="13px" sx={{ lineHeight: 1.5 }}>
                        The ticket titled "{ticket.title}" currently has no associated conversation, call, or note transcripts. There are no additional details or properties available for this ticket at this time.
                    </Typography>
                </Paper>

                {/* Attachments */}
                <AttachmentsSection />
            </Box>

            {/* Tracked Email Modal */}
            <ComposeEmailDialog
                open={composeOpen}
                onClose={() => setComposeOpen(false)}
                leadId={id}
            />
            {/* Edit Ticket Drawer */}
            <CreateTicket
                open={editOpen}
                onClose={() => setEditOpen(false)}
                editData={{
                    title: ticket.title,
                    description: ticket.description,
                    status: ticket.status,
                    source: ticket.source || "Email",
                    priority: ticket.priority,
                    owner: ticket.owner,
                    companyId: ticket.companyId,
                    dealId: ticket.dealId,
                }}
                onSave={(updatedTicket) => {
                    console.log("Updated ticket:", updatedTicket);
                }}
            />
        </Box>
    );
}
