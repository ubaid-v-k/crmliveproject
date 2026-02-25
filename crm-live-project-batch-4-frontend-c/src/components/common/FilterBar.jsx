import React from "react";
import { Stack, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const FilterBar = ({
    search,
    onSearchChange,
    searchPlaceholder = "Search...",
    children,
    sx = {}
}) => {
    return (
        <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            mb={3}
            gap={2}
            flexWrap="wrap"
            sx={sx}
        >
            {/* Search Input */}
            <TextField
                size="small"
                placeholder={searchPlaceholder}
                value={search}
                onChange={onSearchChange}
                sx={{
                    width: { xs: "100%", md: 300 },
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#e2e8f0" },
                        "&:hover fieldset": { borderColor: "#cbd5e1" },
                        "&.Mui-focused fieldset": { borderColor: "#5B4DDB" }, // Primary color
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Additional Filters / Children */}
            {children && (
                <Stack direction="row" spacing={2} flexWrap="wrap" gap={2} alignItems="center">
                    {children}
                </Stack>
            )}
        </Stack>
    );
};

export default FilterBar;
