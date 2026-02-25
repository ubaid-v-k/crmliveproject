import React, { useState } from 'react';
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
  MenuItem,
  Select,
} from '@mui/material';
import {
  NoteOutlined as NoteIcon,
  EmailOutlined as EmailIcon,
  PhoneOutlined as PhoneIcon,
  TaskOutlined as TaskIcon,
  VideocamOutlined as VideocamIcon,
  Add as AddIcon,
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

import LeadNotes from './LeadNotes';
import LeadEmails from './LeadEmails';
import LeadCalls from './LeadCalls';
import LeadTasks from './LeadTasks';
import LeadMeetings from './LeadMeetings';
import { createNotification } from "../../api/dashboard.api";
import AttachmentsSection from '../../components/common/AttachmentsSection';
import ComposeEmailDialog from '../../components/common/ComposeEmailDialog';
import CreateLead from './CreateLead';

/* ================= THEME ================= */
const PRIMARY = "#5B4DDB";

/* ================= MOCK DATA ================= */
const ACTIVITIES = [
  {
    id: 1,
    type: 'task',
    title: 'Task assigned to Maria Johnson',
    subtitle: 'Prepare quote for Jane Cooper',
    date: 'June 24, 2025 at 5:30PM',
    status: 'overdue', // overdue, completed, pending
  },
  {
    id: 2,
    type: 'task',
    title: 'Task assigned to Maria Johnson',
    subtitle: 'Prepare quote for Jane Cooper',
    date: 'June 24, 2025 at 5:30PM',
    status: 'overdue',
  },
  {
    id: 3,
    type: 'call',
    title: 'Call from Maria Johnson',
    subtitle: 'Brought Maria through our latest product line. She\'s interested and is going to get back to me.',
    date: 'June 24, 2025 at 5:30PM',
  },
  {
    id: 4,
    type: 'meeting',
    title: 'Meeting Maria Johnson and Jane Cooper',
    subtitle: 'Let\'s discuss our new product line.',
    date: 'June 24, 2025 at 5:30PM',
  },
  {
    id: 5,
    type: 'email',
    title: 'Email tracking',
    subtitle: 'Jane Cooper opened Hello there',
    date: 'June 24, 2025 at 5:30PM',
  },
  {
    id: 6,
    type: 'note',
    title: 'Note by Maria Johnson',
    subtitle: 'Sample Note',
    date: 'June 24, 2025 at 5:30PM',
  },
];

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock lead data
  const lead = {
    id: id,
    name: 'Jane Cooper',
    firstName: 'Jane',
    lastName: 'Cooper',
    email: 'janecooper@gmail.com',
    phone: '078 5432 8505',
    status: 'New',
    jobTitle: 'Salesperson',
    createdDate: '04/08/2025 2:31 PM GMT+5:30',
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

  return (
    <Box sx={{ display: 'flex', height: '100%', alignItems: 'stretch' }}>

      {/* 1. LEFT SIDEBAR (Info) */}
      <Box sx={{ width: '320px', borderRight: '1px solid #e2e8f0', bgcolor: '#fff', p: 3, flexShrink: 0 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
          onClick={() => navigate('/leads')}
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
          Leads
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
                {lead.name}
              </Typography>
              <Typography variant="body2" color="#64748b">
                {lead.jobTitle}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Status Dropdown (Styled text like DealDetails) */}
        <Stack direction="row" alignItems="center" spacing={0.5} mb={3}>
          <Typography variant="body2" color="#64748b">Status :</Typography>
          <Select
            variant="standard"
            disableUnderline
            value={lead.status}
            // onChange handler would go here
            IconComponent={ArrowDownIcon}
            sx={{
              color: PRIMARY,
              fontWeight: 500,
              fontSize: "14px",
              "& .MuiSelect-select": { py: 0, paddingRight: "24px !important" },
              "& .MuiSvgIcon-root": { color: PRIMARY, fontSize: 18 }
            }}
          >
            {['New', 'Contacted', 'Qualified', 'Lost'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </Stack>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1.5} mb={4}>
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
              sx={{ cursor: "pointer" }}
              onClick={async () => {
                if (action.type === "email") {
                  setActiveTab(2); // Emails tab
                } else if (action.type === "call") {
                  await createNotification("Outbound Call", `Initiated call to Lead: ${lead?.firstName} ${lead?.lastName}`, "info");
                  window.location.href = `tel:${lead?.phone || "+919497180892"}`;
                } else if (action.type === "note") {
                  setActiveTab(1); // Notes tab
                } else if (action.type === "task") {
                  setActiveTab(4); // Tasks tab
                } else if (action.type === "meeting") {
                  await createNotification("Google Meet Scheduled", `Started Meeting with Lead: ${lead?.firstName} ${lead?.lastName}`, "info");
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

        {/* About This Lead */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} onClick={() => setAboutOpen(!aboutOpen)} sx={{ cursor: 'pointer' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {aboutOpen ? <ArrowDownIcon fontSize="small" color="action" /> : <ArrowRightIcon fontSize="small" color="action" />}
            <Typography variant="subtitle2" fontWeight={700} color="#1e293b">About this Lead</Typography>
          </Stack>
          <IconButton size="small" sx={{ color: PRIMARY }} onClick={() => setEditOpen(true)}>
            <EditIcon fontSize="small" sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>

        {aboutOpen && (
          <Stack spacing={2.5} pl={1}>
            {[
              { label: 'Email', value: lead.email },
              { label: 'First Name', value: lead.firstName },
              { label: 'Last Name', value: lead.lastName },
              { label: 'Phone number', value: lead.phone },
              { label: 'Job Title', value: lead.jobTitle },
              { label: 'Created Date', value: lead.createdDate },
            ].map((field, i) => (
              <Box key={i}>
                <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>
                  {field.label}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" fontWeight={600} color="#1e293b">
                    {field.value}
                  </Typography>
                  {field.label === 'Email' && (
                    <CopyIcon
                      sx={{ fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}
                      onClick={() => {
                        navigator.clipboard.writeText(field.value);
                        toast.success("Email copied to clipboard");
                      }}
                    />
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      {/* 2. CENTER CONTENT (Feed) */}
      <Box sx={{ flex: 1, bgcolor: '#fff', p: 3, borderRight: '1px solid #e2e8f0', overflowY: 'auto' }}>
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

          <Button
            variant="outlined"
            sx={{
              borderColor: PRIMARY,
              color: PRIMARY,
              textTransform: 'none',
              borderRadius: '8px',
              px: 3,
              whiteSpace: 'nowrap'
            }}
          >
            Convert
          </Button>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
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
          <Box>
            <Typography variant="subtitle2" fontWeight={700} color="#1e293b" mb={2}>Upcoming</Typography>

            <List sx={{ mb: 4, p: 0 }}>
              {ACTIVITIES.filter((a) => a.type === "task" && (a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))).map((item, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ArrowDownIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                      <Typography variant="body2" fontWeight={600} color="#334155">
                        {item.title}
                      </Typography>
                    </Box>
                    {item.status === "overdue" && (
                      <Typography variant="caption" sx={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 0.5 }}>
                        <TaskIcon fontSize="inherit" /> Overdue : {item.date}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ pl: 4, display: "flex", alignItems: "center", gap: 1.5 }}>
                    <UncheckedIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                    <Typography variant="body2" color="#64748b">
                      {item.subtitle}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </List>

            <Typography variant="subtitle2" fontWeight={700} color="#1e293b" mb={2}>June 2025</Typography>
            <List sx={{ p: 0 }}>
              {ACTIVITIES.filter((a) => a.type !== "task" && (a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))).map((item, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <ArrowDownIcon fontSize="small" sx={{ color: "#94a3b8", mt: 0.5 }} />
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          {renderActivityIcon(item.type)}
                          <Typography variant="body2" fontWeight={600} color="#334155">
                            {item.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="#64748b" sx={{ fontSize: "13px" }}>
                          {item.subtitle}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="#94a3b8">
                      {item.date}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </List>
          </Box>
        ) : activeTab === 1 ? (
          <LeadNotes />
        ) : activeTab === 2 ? (
          <LeadEmails onOpenCompose={() => setComposeOpen(true)} />
        ) : activeTab === 3 ? (
          <LeadCalls />
        ) : activeTab === 4 ? (
          <LeadTasks />
        ) : activeTab === 5 ? (
          <LeadMeetings />
        ) : null}

      </Box>

      {/* 3. RIGHT SIDEBAR (Widgets) */}
      <Box sx={{ width: '350px', bgcolor: '#fff', p: 3, flexShrink: 0 }}>
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
            <Typography variant="subtitle2" fontWeight={700} color={PRIMARY}>AI Lead Summary</Typography>
          </Stack>
          <Typography variant="body2" color="#1e293b" fontSize="13px" lineHeight={1.5}>
            There are no activities associated with this lead and further details are needed to provide a comprehensive summary.
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
      {/* Edit Lead Drawer */}
      <CreateLead
        open={editOpen}
        onClose={() => setEditOpen(false)}
        editData={{
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          title: lead.jobTitle,
          status: lead.status,
          owner: "Jane Cooper"
        }}
        onSave={(updatedLead) => {
          console.log("Updated lead:", updatedLead);
          // In a real app, update state or refetch data here
        }}
      />
    </Box>
  );
};

export default LeadDetailPage;
