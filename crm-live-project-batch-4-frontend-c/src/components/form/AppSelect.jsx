import { Box, Typography, FormControl, Select, MenuItem, FormHelperText } from "@mui/material";

/**
 * Standardized Select Component
 * 
 * @param {string} label - Label text displayed above the input
 * @param {boolean} required - Show red asterisk
 * @param {Array} options - Array of { value, label } or strings
 * @param {string} placeholder - Placeholder text
 * @param {object} props - Props passed to Select
 */
export default function AppSelect({
    label,
    required,
    error,
    helperText,
    options = [],
    placeholder = "Choose",
    sx,
    value,
    onChange,
    children, // Allow manual MenuItems children
    ...props
}) {
    return (
        <Box>
            {label && (
                <Typography variant="subtitle2" fontWeight={600} color="#1e293b" mb={1}>
                    {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
                </Typography>
            )}
            <FormControl fullWidth error={!!error}>
                <Select
                    displayEmpty
                    value={value}
                    onChange={onChange}
                    sx={{
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: error ? "#ef4444" : "#e2e8f0" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: error ? "#ef4444" : "#cbd5e1" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: error ? "#ef4444" : "#5B4DDB" },
                        ...sx,
                    }}
                    renderValue={(selected) => {
                        if (!selected || selected.length === 0) {
                            return <span style={{ color: "#94a3b8" }}>{placeholder}</span>;
                        }
                        if (Array.isArray(selected)) {
                            return selected.join(", ");
                        }
                        return selected;
                    }}
                    {...props}
                >
                    <MenuItem value="" disabled>
                        {placeholder}
                    </MenuItem>

                    {children ? children : options.map((opt) => {
                        const val = typeof opt === 'object' ? opt.value : opt;
                        const lbl = typeof opt === 'object' ? opt.label : opt;
                        return (
                            <MenuItem key={val} value={val}>
                                {lbl}
                            </MenuItem>
                        );
                    })}
                </Select>
                {helperText && <FormHelperText sx={{ ml: 0 }}>{helperText}</FormHelperText>}
            </FormControl>
        </Box>
    );
}
