import React from "react";
import { Box } from "@mui/material";

const PageContainer = ({ children, sx = {} }) => {
    return (
        <Box
            sx={{
                p: { xs: 2, md: 4 },
                backgroundColor: "#f8fafc", // Light gray background for the page area
                minHeight: "100%",
                ...sx,
            }}
        >
            {children}
        </Box>
    );
};

export default PageContainer;
