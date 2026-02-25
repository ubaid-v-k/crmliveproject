import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    TextField,
    Typography,
    IconButton,
    Button,
    Stack,
    Divider,
    InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextFormatIcon from '@mui/icons-material/TextFormat'; // Mock for 'A' icon

export default function ComposeEmail({ open, onClose }) {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    height: '600px', // Fixed height as per look
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
        >
            {/* Header */}
            <Box sx={{
                bgcolor: '#5B4DDB',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                py: 1.5
            }}>
                <Typography variant="subtitle1" fontWeight={600}>New Email</Typography>
                <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Content */}
            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>

                {/* Recipients */}
                <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, borderBottom: '1px solid #eef2f6' }}>
                    <Typography sx={{ width: '80px', color: '#64748b', fontSize: '14px' }}>Recipients</Typography>
                    <TextField
                        variant="standard"
                        fullWidth
                        InputProps={{ disableUnderline: true, sx: { fontSize: '14px' } }}
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                    <Stack direction="row" spacing={1}>
                        <Typography variant="caption" sx={{ color: '#64748b', cursor: 'pointer' }}>Cc</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', cursor: 'pointer' }}>Bcc</Typography>
                    </Stack>
                </Box>

                {/* Subject */}
                <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, borderBottom: '1px solid #eef2f6' }}>
                    <Typography sx={{ width: '80px', color: '#64748b', fontSize: '14px' }}>Subject</Typography>
                    <TextField
                        variant="standard"
                        fullWidth
                        InputProps={{ disableUnderline: true, sx: { fontSize: '14px' } }}
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </Box>

                {/* Body placeholder */}
                <Box sx={{ p: 3, flex: 1 }}>
                    <TextField
                        variant="standard"
                        fullWidth
                        multiline
                        placeholder="Body Text"
                        InputProps={{ disableUnderline: true, sx: { fontSize: '14px' } }}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </Box>

                {/* Footer Toolbar */}
                <Box sx={{ p: 2, borderTop: '1px solid #eef2f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: '#5B4DDB',
                                textTransform: 'none',
                                borderRadius: '6px',
                                padding: '6px 16px',
                                display: 'flex',
                                gap: 1
                            }}
                        >
                            Send
                            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                            <ArrowDropDownIcon fontSize="small" />
                        </Button>

                        <Stack direction="row" spacing={1} sx={{ color: '#64748b' }}>
                            <IconButton size="small"><TextFormatIcon fontSize="small" /></IconButton>
                            <IconButton size="small"><AttachFileIcon fontSize="small" /></IconButton>
                            <IconButton size="small"><InsertLinkIcon fontSize="small" /></IconButton>
                            <IconButton size="small"><SentimentSatisfiedAltIcon fontSize="small" /></IconButton>
                            <IconButton size="small"><InsertPhotoIcon fontSize="small" /></IconButton>
                        </Stack>
                    </Stack>

                    <IconButton size="small" sx={{ color: '#64748b' }}>
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Box>

            </DialogContent>
        </Dialog>
    );
}
