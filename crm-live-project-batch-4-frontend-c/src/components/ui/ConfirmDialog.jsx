import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Delete",
    cancelText = "Cancel",
    confirmColor = "error" // 'error', 'primary', 'secondary' etc.
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    padding: "8px",
                    minWidth: "400px"
                }
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3, pb: 1 }}>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: '#fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                    }}
                >
                    <WarningAmberRoundedIcon sx={{ color: '#dc2626', fontSize: 28 }} />
                </Box>
                <DialogTitle id="confirm-dialog-title" sx={{ p: 0, fontWeight: 700, fontSize: '1.125rem' }}>
                    {title}
                </DialogTitle>
            </Box>

            <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
                <DialogContentText id="confirm-dialog-description" sx={{ color: '#64748b' }}>
                    {message}
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 1.5 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        borderColor: "#e2e8f0",
                        color: "#64748b",
                        fontWeight: 600,
                        padding: "8px 24px",
                        "&:hover": { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
                    }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={confirmColor}
                    autoFocus
                    sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 600,
                        padding: "8px 24px",
                        boxShadow: "none",
                        "&:hover": { boxShadow: "0 4px 6px -1px rgba(220, 38, 38, 0.2)" },
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
