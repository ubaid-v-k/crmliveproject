import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    IconButton,
    Tabs,
    Tab,
    List,
    Avatar,
    TextField,
    InputAdornment,
    Stack,
    Divider,
} from '@mui/material';
import {
    NoteOutlined as NoteIcon,
    EmailOutlined as EmailIcon,
    PhoneOutlined as PhoneIcon,
    TaskOutlined as TaskIcon,
    VideocamOutlined as VideocamIcon,
    Edit as EditIcon,
    Search as SearchIcon,
    ContentCopy as CopyIcon,
    KeyboardArrowDown as ArrowDownIcon,
    KeyboardArrowRight as ArrowRightIcon,
    RadioButtonUnchecked as UncheckedIcon,
    AutoAwesome as AutoAwesomeIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCompanies } from '../../context/CompaniesContext';

import { fetchActivities, generateAiSummary } from "../../api/activities.api";
import axios from "axios";
import ActivityFeed from "../../components/common/ActivityFeed";

// Reuse Lead components as requested
import LeadNotes from '../leads/LeadNotes';
import LeadEmails from '../leads/LeadEmails';
import LeadCalls from '../leads/LeadCalls';
import LeadTasks from '../leads/LeadTasks';
import LeadMeetings from '../leads/LeadMeetings';
import ComposeEmailDialog from '../../components/common/ComposeEmailDialog';
import CreateCompany from './CreateCompany';
import { createNotification } from '../../api/dashboard.api';

/* ================= THEME ================= */

import AttachmentsSection from '../../components/common/AttachmentsSection';

const PRIMARY = "#5B4DDB";

const CompanyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getCompany } = useCompanies();
    const [activeTab, setActiveTab] = useState(0);
    const [aboutOpen, setAboutOpen] = useState(true);
    const [company, setCompany] = useState(null);
    const [composeOpen, setComposeOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter states
    const [activities, setActivities] = useState([]);
    const [aiSummary, setAiSummary] = useState("Loading summary...");
    const [files, setFiles] = useState([]);

    const loadActivities = async () => {
        if (!company) return;
        const data = await fetchActivities('company', id);
        setActivities(data);
    };

    const loadSummary = async () => {
        if (!company) return;
        setAiSummary("Loading summary...");
        const summary = await generateAiSummary('company', id, files.length);
        setAiSummary(summary);
    };

    useEffect(() => {
        loadSummary();
    }, [files]);

    useEffect(() => {
        const data = getCompany(id);
        if (data) {
            setCompany(data);
        }
    }, [id, getCompany]);

    useEffect(() => {
        if (company) {
            loadActivities();
            loadSummary();
        }
    }, [company]);

    const completeTask = async (taskId) => {
        try {
            const token = localStorage.getItem("crm_user_token");
            await axios.patch(`http://localhost:8000/api/core/activities/${taskId}/`, { status: 'completed' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Task marked as completed");
            loadActivities(); // Refresh feed
            loadSummary();    // Refresh summary
        } catch (error) {
            toast.error("Failed to complete task");
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Helper renderers
    const renderActivityIcon = (type) => {
        switch (type) {
            case 'call': return <PhoneIcon sx={{ fontSize: 18, color: '#64748b' }} />;
            case 'meeting': return <VideocamIcon sx={{ fontSize: 18, color: '#64748b' }} />;
            case 'email': return <EmailIcon sx={{ fontSize: 18, color: '#64748b' }} />;
            case 'note': return <NoteIcon sx={{ fontSize: 18, color: '#64748b' }} />;
            default: return <TaskIcon sx={{ fontSize: 18, color: '#64748b' }} />;
        }
    };

    if (!company) {
        return <Box p={3}>Loading...</Box>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: "column", md: "row" }, height: { xs: "auto", md: "100%" }, alignItems: 'stretch', overflow: { xs: "auto", md: "hidden" } }}>

            {/* 1. LEFT SIDEBAR (Info) */}
            <Box sx={{ width: { xs: "100%", md: "320px" }, borderRight: { xs: "none", md: "1px solid #e2e8f0" }, borderBottom: { xs: "1px solid #e2e8f0", md: "none" }, bgcolor: '#fff', p: 3, flexShrink: 0, overflowY: { xs: "visible", md: "auto" } }}>
                {/* Back Button */}
                <Button
                    startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                    onClick={() => navigate('/companies')}
                    sx={{
                        color: '#64748b',
                        textTransform: 'none',
                        fontSize: '14px',
                        p: 0,
                        minWidth: 'auto',
                        mb: 2,
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                    }}
                >
                    Companies
                </Button>

                {/* Title & Info */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: '#e2e8f0',
                                borderRadius: '12px'
                            }}
                            variant="rounded"
                        />
                        <Box>
                            <Typography variant="h6" fontWeight={700} color="#1e293b" sx={{ lineHeight: 1.2 }}>
                                {company.name}
                            </Typography>
                            <Typography variant="body2" color="#64748b">
                                {company.industry}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                                <Typography variant="caption" color="#64748b">
                                    {company.domain || "website.com"}
                                </Typography>
                                <CopyIcon
                                    sx={{ fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(company.domain || "website.com");
                                        toast.success("Domain copied to clipboard");
                                    }}
                                />
                            </Stack>
                        </Box>
                    </Box>
                </Box>

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
                                    setActiveTab(2); // Emails tab
                                } else if (action.type === "call") {
                                    await createNotification("Outbound Call", `Initiated call to Company: ${company?.name}`, "info");
                                    window.location.href = `tel:${company?.phone || "+919497180892"}`;
                                } else if (action.type === "note") {
                                    setActiveTab(1); // Notes tab
                                } else if (action.type === "task") {
                                    setActiveTab(4); // Tasks tab
                                } else if (action.type === "meeting") {
                                    await createNotification("Google Meet Scheduled", `Started Meeting for Company: ${company?.name}`, "info");
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

                {/* About This Company */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} onClick={() => setAboutOpen(!aboutOpen)} sx={{ cursor: 'pointer' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {aboutOpen ? <ArrowDownIcon fontSize="small" color="action" /> : <ArrowRightIcon fontSize="small" color="action" />}
                        <Typography variant="subtitle2" fontWeight={700} color="#1e293b">About this Company</Typography>
                    </Stack>
                    <IconButton size="small" sx={{ color: PRIMARY }} onClick={() => setEditOpen(true)}>
                        <EditIcon fontSize="small" sx={{ fontSize: 16 }} />
                    </IconButton>
                </Stack>

                {aboutOpen && (
                    <Stack spacing={2.5} pl={1}>
                        {[
                            { label: 'Company Domain Name', value: company.domain || "N/A" },
                            { label: 'Company Name', value: company.name },
                            { label: 'Industry', value: company.industry },
                            { label: 'Phone number', value: company.phone },
                            { label: 'Company Owner', value: company.owner },
                            { label: 'City', value: company.city },
                            { label: 'Country/Region', value: company.country },
                            { label: 'No of Employees', value: company.employees || "N/A" },
                            { label: 'Annual Revenue', value: company.revenue || "N/A" },
                            { label: 'Created Date', value: company.created },
                        ].map((field, i) => (
                            <Box key={i}>
                                <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>
                                    {field.label}
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography variant="body2" fontWeight={600} color="#1e293b">
                                        {field.value}
                                    </Typography>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>

            {/* 2. CENTER CONTENT (Feed) */}
            <Box sx={{ flex: 1, bgcolor: '#fff', p: 3, borderRight: { xs: "none", md: "1px solid #e2e8f0" }, borderBottom: { xs: "1px solid #e2e8f0", md: "none" }, overflowY: { xs: "visible", md: "auto" } }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Search activities"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": { bgcolor: "#f8fafc", borderRadius: "8px" },
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" }
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} /></InputAdornment>
                        }}
                    />

                </Box>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        mb: 3,
                        borderBottom: "1px solid #e2e8f0",
                        "& .MuiTab-root": { textTransform: "none", fontSize: "14px", fontWeight: 500, color: "#64748b", minWidth: "auto", mr: 2 },
                        "& .Mui-selected": { color: "#5B4DDB" },
                        "& .MuiTabs-indicator": { backgroundColor: "#5B4DDB" }
                    }}
                >
                    {['Activity', 'Notes', 'Emails', 'Calls', 'Tasks', 'Meetings'].map((t) => (
                        <Tab key={t} label={t} />
                    ))}
                </Tabs>

                {activeTab === 0 ? (
                    <ActivityFeed activities={activities} searchQuery={searchQuery} onCompleteTask={completeTask} />
                ) : activeTab === 1 ? (
                    <LeadNotes searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'note')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="company" entityId={id} />
                ) : activeTab === 2 ? (
                    <LeadEmails onOpenCompose={() => setComposeOpen(true)} searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'email')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="company" entityId={id} />
                ) : activeTab === 3 ? (
                    <LeadCalls searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'call')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="company" entityId={id} />
                ) : activeTab === 4 ? (
                    <LeadTasks searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'task')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="company" entityId={id} />
                ) : activeTab === 5 ? (
                    <LeadMeetings searchQuery={searchQuery} activities={activities.filter(a => a.activity_type === 'meeting')} refreshActivities={() => { loadActivities(); loadSummary(); }} entityType="company" entityId={id} />
                ) : null}

            </Box>

            {/* 3. RIGHT SIDEBAR (Widgets) */}
            <Box sx={{ width: { xs: "100%", md: "350px" }, bgcolor: '#fff', p: 3, flexShrink: 0, overflowY: { xs: "visible", md: "auto" } }}>
                {/* AI Summary */}
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        borderRadius: "12px",
                        borderColor: "#818cf8", // using hex for PRIMARY accent or similar
                        bgcolor: "#fff",
                        mb: 4,
                        boxShadow: '0 4px 12px rgba(91, 77, 219, 0.08)'
                    }}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                        <Box sx={{ display: "flex", p: 0.5, bgcolor: "#e0e7ff", borderRadius: "6px" }}>
                            <AutoAwesomeIcon sx={{ color: PRIMARY, fontSize: 16 }} />
                        </Box>
                        <Typography variant="subtitle2" fontWeight={700} color={PRIMARY}>AI Company Summary</Typography>
                    </Stack>
                    <Typography variant="body2" color="#1e293b" fontSize="13px" lineHeight={1.5}>
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
            {/* Edit Company Drawer */}
            <CreateCompany
                open={editOpen}
                onClose={() => setEditOpen(false)}
                editData={{
                    domain: company.domain,
                    name: company.name,
                    owner: company.owner,
                    industry: company.industry,
                    type: company.type || "Private",
                    city: company.city,
                    country: company.country,
                    employees: company.employees,
                    revenue: company.revenue,
                    phone: company.phone,
                }}
                onSave={(updatedCompany) => {
                    console.log("Updated company:", updatedCompany);
                }}
            />
        </Box>
    );
};

export default CompanyDetails;
