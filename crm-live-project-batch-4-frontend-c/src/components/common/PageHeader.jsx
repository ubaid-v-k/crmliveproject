import React from "react";
import { Stack, Typography, Box } from "@mui/material";

const PageHeader = ({ title, actions, sx = {} }) => {
    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            mb={3}
            gap={2}
            sx={sx}
        >
            <Typography variant="h5" fontWeight={700} color="#1e293b">
                {title}
            </Typography>

            {actions && (
                <Box>
                    {actions}
                </Box>
            )}
        </Stack>
    );
};

export default PageHeader;
