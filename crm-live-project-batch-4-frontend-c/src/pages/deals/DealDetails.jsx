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
    CheckCircleOutline,
    CircleOutlined,
} from "@mui/icons-material";

import { createNotification } from "../../api/dashboard.api";
import { fetchActivities, generateAiSummary } from "../../api/activities.api";
import axios from "axios";
import ActivityFeed from "../../components/common/ActivityFeed";

import { useDeals } from "../../context/DealsContext";
import { useToast } from "../../hooks/useToast";

// Reuse Lead components (as done in CompanyDetails)
import LeadNotes from "../leads/LeadNotes";
import LeadEmails from "../leads/LeadEmails";
import LeadCalls from "../leads/LeadCalls";
import LeadTasks from "../leads/LeadTasks";
import LeadMeetings from "../leads/LeadMeetings";

// Components
import AttachmentsSection from "../../components/common/AttachmentsSection";
import ComposeEmailDialog from "../../components/common/ComposeEmailDialog";
import CreateDeal from "./CreateDeal";

const PRIMARY = "#5B4DDB";

export default function DealDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getDeal } = useDeals();

    const deal = getDeal(id);

    // Filter states
    const [activities, setActivities] = useState([]);
    const [aiSummary, setAiSummary] = useState("Loading summary...");
    const [files, setFiles] = useState([]);

    const loadActivities = async () => {
        if (!deal) return;
        const data = await fetchActivities('deal', id);
        setActivities(data);
    };

    const loadSummary = async () => {
        if (!deal) return;
        setAiSummary("Loading summary...");
        const summary = await generateAiSummary('deal', id, files.length);
        setAiSummary(summary);
    };

    useEffect(() => {
        loadSummary();
    }, [files]);

    useEffect(() => {
        loadActivities();
        loadSummary();
    }, [id, deal]);

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

    // If no deal found (e.g., refresh on new ID not in separate persistence), handle gracefully
    if (!deal) {
        return (
            <Box p={4}>
                <Typography>Deal not found.</Typography>
                <Button onClick={() => navigate("/deals")}>Back to Deals</Button>
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

    // Stage enforcement logic
    const [anchorEl, setAnchorEl] = useState(null);
    const { updateDeal } = useDeals();
    const { toast } = useToast();

    const handleStageChange = (newStage) => {
        setAnchorEl(null);
        if (newStage === deal.stage) return;

        const restrictedStages = ["Contract Sent", "Closed Won", "Closed Lost"];

        if (restrictedStages.includes(newStage)) {
            if (activities.length === 0) {
                toast.error(`Cannot move to ${newStage} without at least one activity.`);
                return;
            }
        }

        updateDeal(deal.id, { stage: newStage });
    };

    return (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, height: { xs: "auto", md: "100%" }, alignItems: "stretch", overflow: { xs: "auto", md: "hidden" } }}>

            {/* 1. LEFT SIDEBAR (Info & Actions) */}
            <Box sx={{ width: { xs: "100%", md: "320px" }, borderRight: { xs: "none", md: "1px solid #e2e8f0" }, borderBottom: { xs: "1px solid #e2e8f0", md: "none" }, bgcolor: "#fff", p: 3, flexShrink: 0, overflowY: { xs: "visible", md: "auto" } }}>
                {/* Back Button */}
                <Button
                    startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                    onClick={() => navigate("/deals")}
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
                    Deals
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
                            {/* Placeholder icon or initial */}
                            <Box component="span" sx={{ fontSize: 24 }}>💰</Box>
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={700} color="#1e293b" sx={{ lineHeight: 1.2 }}>
                                {deal.name}
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="#1e293b" mt={0.5}>
                                ${deal.amount}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Status / Stage */}
                <Stack direction="row" alignItems="center" spacing={0.5} mb={3}>
                    <Typography variant="body2" color="#64748b">Stage :</Typography>
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
                                "&:hover": { bgcolor: "transparent", textDecoration: "underline" }
                            }}
                        >
                            {deal.stage}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            {[
                                "Contact",
                                "Qualified Lead",
                                "Proposal Sent",
                                "Negotiation",
                                "Closed Won",
                                "Closed Lost"
                            ].map((stage) => (
                                <MenuItem
                                    key={stage}
                                    onClick={() => handleStageChange(stage)}
                                    selected={stage === deal.stage}
                                >
                                    {stage}
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
                                    await createNotification("Outbound Call", `Initiated call to Deal: ${deal?.title}`, "info");
                                    window.location.href = `tel:${deal?.contactPhone || "+919497180892"}`;
                                } else if (action.type === "note") {
                                    setTabValue(1); // Notes tab
                                } else if (action.type === "task") {
                                    setTabValue(4); // Tasks tab
                                } else if (action.type === "meeting") {
                                    await createNotification("Google Meet Scheduled", `Started Meeting for Deal: ${deal?.title}`, "info");
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
                            About this Deal
                        </Typography>
                    </Stack>
                    <IconButton size="small" onClick={() => setEditOpen(true)}>
                        <EditIcon fontSize="small" sx={{ fontSize: 16, color: PRIMARY }} />
                    </IconButton>
                </Stack>

                <Collapse in={aboutOpen}>
                    <Stack spacing={2.5} pl={1}>
                        {[
                            { label: "Deal Description", value: "Description goes here" },
                            { label: "Deal Owner", value: deal.owner },
                            { label: "Priority", value: deal.priority || "Medium" },
                            { label: "Created Date", value: deal.created || "04/08/2025 2:31 PM GMT+5:30" },
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
                        aria-label="deal tabs"
                        variant="scrollable"
                        scrollButtons="auto"
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

                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                mt: 2,
                                mb: 2,
                            }}
                        >
                            <Typography variant="caption" color="#64748b">
                                This deal was created by <strong>{deal.owner}</strong> {deal.created}
                            </Typography>
                        </Paper>
                    </Box>
                ) : tabValue === 1 ? (
                    <LeadNotes searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'note')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="deal" entityId={id} />
                ) : tabValue === 2 ? (
                    <LeadEmails onOpenCompose={() => setComposeOpen(true)} searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'email')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="deal" entityId={id} />
                ) : tabValue === 3 ? (
                    <LeadCalls searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'call')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="deal" entityId={id} />
                ) : tabValue === 4 ? (
                    <LeadTasks searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'task')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="deal" entityId={id} />
                ) : tabValue === 5 ? (
                    <LeadMeetings searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'meeting')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="deal" entityId={id} />
                ) : null}
            </Box>

            {/* 3. RIGHT SIDEBAR (Widgets) */}
            <Box sx={{ width: { xs: "100%", md: "350px" }, bgcolor: "#fff", p: 3, flexShrink: 0, overflowY: { xs: "visible", md: "auto" } }}>
                {/* AI Deal Summary */}
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
                            AI Deal Summary
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
            {/* Edit Deal Drawer */}
            <CreateDeal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                editData={{
                    name: deal.name,
                    stage: deal.stage,
                    amount: deal.amount,
                    owner: deal.owner,
                    closeDate: deal.closeDate || "2025-06-24", // Mock fallback
                    priority: deal.priority || "Medium",
                }}
                onSave={(updatedDeal) => {
                    console.log("Updated deal:", updatedDeal);
                }}
            />
        </Box>
    );
}
