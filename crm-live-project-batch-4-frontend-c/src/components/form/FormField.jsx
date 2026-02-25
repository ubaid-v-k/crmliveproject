import React from "react";
import { Typography } from "@mui/material";

const FormField = ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    required = false,
    className = "form-control auth-input",
    ...props
}) => {
    return (
        <div className="mb-3">
            {label && (
                <label className="form-label text-muted small fw-bold mb-1">
                    {label} {required && <span className="text-danger">*</span>}
                </label>
            )}
            <input
                type={type}
                className={`${className} ${error ? "is-invalid" : ""}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                style={{
                    borderColor: error ? "#dc3545" : undefined, // Explicit red border if error
                    boxShadow: error ? "0 0 0 0.25rem rgba(220, 53, 69, 0.25)" : undefined
                }}
                {...props}
            />
            {error && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                    {error}
                </Typography>
            )}
        </div>
    );
};

export default FormField;
