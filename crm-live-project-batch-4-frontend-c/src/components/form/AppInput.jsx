import React from "react";
import { Box, Typography, TextField } from "@mui/material";

/**
 * Standardized Input Component
 * 
 * @param {string} label - Label text displayed above the input
 * @param {boolean} required - Show red asterisk
 * @param {object} props - Props passed to TextField
 */
export default function AppInput({ label, required, error, helperText, sx, ...props }) {
    return (
        <Box>
            {label && (
                <Typography variant="subtitle2" fontWeight={600} color="#1e293b" mb={1}>
                    {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
                </Typography>
            )}
            <TextField
                fullWidth
                variant="outlined"
                error={!!error}
                helperText={helperText}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        "& fieldset": { borderColor: error ? "#ef4444" : "#e2e8f0" },
                        "&:hover fieldset": { borderColor: error ? "#ef4444" : "#cbd5e1" },
                        "&.Mui-focused fieldset": { borderColor: error ? "#ef4444" : "#5B4DDB" },
                    },
                    "& .MuiFormHelperText-root": { marginLeft: 0 },
                    ...sx,
                }}
                {...props}
            />
        </Box>
    );
}
