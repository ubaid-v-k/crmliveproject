import React from 'react';
import {
    Drawer,
    Box,
    Typography,
    Stack,
    IconButton,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * A reusable right-side drawer for creating or editing entities (Tasks, Meetings, etc.).
 * 
 * @param {boolean} open - Whether the drawer is open
 * @param {function} onClose - Function to close the drawer
 * @param {string} title - Title displayed in the header
 * @param {function} onSave - Function called when saving
 * @param {string} [saveLabel="Save"] - Label for the save button
 * @param {string} [width="500px"] - Width of the drawer
 * @param {React.ReactNode} children - The form content
 */
export default function EntityDrawer({
    open,
    onClose,
    title,
    onSave,
    saveLabel = "Save",
    width = "500px",
    footer,
    children
}) {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: width }
            }}
        >
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                {/* HEADER */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    p={3}
                    sx={{ borderBottom: "1px solid #e2e8f0" }}
                >
                    <Typography variant="h6" fontWeight={700} color="#1e293b">
                        {title}
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
                        <CloseIcon />
                    </IconButton>
                </Stack>

                {/* BODY */}
                <Box px={3} py={4} sx={{ flex: 1, overflowY: "auto" }}>
                    <Stack spacing={3}>
                        {children}
                    </Stack>
                </Box>

                {/* FOOTER */}
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={2}
                    p={3}
                    sx={{ borderTop: "1px solid #e2e8f0" }}
                >
                    {footer ? footer : (
                        <>
                            <Button
                                variant="outlined"
                                onClick={onClose}
                                sx={{
                                    color: "#1e293b",
                                    borderColor: "#e2e8f0",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    "&:hover": { borderColor: "#cbd5e1", bgcolor: "transparent" }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={onSave}
                                sx={{
                                    backgroundColor: "#5B4DDB",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    boxShadow: "0 4px 6px -1px rgba(91, 77, 219, 0.2)",
                                    "&:hover": { backgroundColor: "#4f46e5" }
                                }}
                            >
                                {saveLabel}
                            </Button>
                        </>
                    )}
                </Stack>
            </Box>
        </Drawer>
    );
}
