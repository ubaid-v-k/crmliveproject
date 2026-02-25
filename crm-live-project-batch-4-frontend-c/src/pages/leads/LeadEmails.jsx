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
} from "@mui/icons-material";


const MOCK_EMAILS = [
    {
        id: 1,
        subject: "Hello There",
        from: "Maria Johnson",
        to: "Jane Cooper",
        date: "June 24, 2025 at 5:30PM",
        preview: "Hey Jane Cooper,",
        content: `Hey Jane Cooper,

Thank you for showing interest in CRM!
We noticed you recently filled out our demo request form on the website and wanted to reach out personally.

Our solution helps businesses like yours streamline sales workflows, track lead progress, and boost conversion rates by up to 40%.

I'd love to schedule a quick call to understand your needs better and show you how we can help. Are you available for a 15-minute chat this week?

You can book a time that works for you
If you have any specific questions or requirements, feel free to reply to this email directly.

Looking forward to connecting!

Warm regards,
Rajat Sharma
Senior Sales Executive
CRM Pvt. Ltd.
+91-9876543210
rajat@salestrackcrm.com
salestrackcrm.com`,
    },
    //     {
    //         id: 2,
    //         subject: "Hello There",
    //         from: "Maria Johnson",
    //         to: "Jane Cooper",
    //         date: "June 24, 2025 at 5:30PM",
    //         preview: "Hey Jane Cooper,",
    //         content: "Previous email content..."
    //     }
];

export default function LeadEmails({ onOpenCompose }) {
    const [expanded, setExpanded] = useState({ 1: true });

    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
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

            {MOCK_EMAILS.map((email) => (
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
                                    <span>Logged Email - {email.subject}</span>
                                    <span style={{ fontWeight: 400, color: "#64748b" }}>by {email.from}</span>
                                </Typography>
                                {/* Show preview if collapsed */}
                                {!expanded[email.id] && (
                                    <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
                                        {email.preview}
                                    </Typography>
                                )}
                                {/* Show 'To' if expanded */}
                                {expanded[email.id] && (
                                    <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
                                        To {email.to}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Typography variant="caption" color="#94a3b8" sx={{ whiteSpace: 'nowrap', ml: 2 }}>
                            {email.date}
                        </Typography>
                    </Box>

                    {/* Email Content */}
                    <Collapse in={expanded[email.id]}>
                        <Box sx={{ px: 5, pb: 4 }}>
                            <Typography
                                variant="body2"
                                color="#334155"
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: 1.6,
                                    fontFamily: "'Inter', sans-serif"
                                }}
                            >
                                {email.content}
                            </Typography>
                        </Box>
                    </Collapse>
                </Paper>
            ))}
        </Box>
    );
}
