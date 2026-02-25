import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: "'Inter', sans-serif",
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },
    palette: {
        primary: {
            main: "#5B4DDB",
        },
        text: {
            primary: "#1e293b",
            secondary: "#64748b",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "16px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                },
            },
        },
    },
});

export default theme;
