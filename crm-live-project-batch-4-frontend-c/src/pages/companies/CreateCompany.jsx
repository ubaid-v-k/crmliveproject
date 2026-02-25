import React, { useEffect } from "react";
import AppInput from "../../components/form/AppInput";
import AppSelect from "../../components/form/AppSelect";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../hooks/useToast";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    Button,
    Drawer,
    InputAdornment,
    MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const INDUSTRIES = [
    "Legal Services",
    "Healthcare",
    "Real Estate",
    "Financial Advisory",
    "Retail & E-commerce",
    "Logistics & Supply Chain",
    "Marketing Agencies",
    "Education Technology",
    "Technology",
    "Other",
];

const COMPANY_TYPES = ["Public", "Private", "Non-Profit", "Government", "Other"];

// Simple Flag Icon Component
const FlagIcon = () => (
    <img
        src="https://flagcdn.com/w20/in.png"
        srcSet="https://flagcdn.com/w40/in.png 2x"
        width="24"
        alt="India"
        style={{ borderRadius: "2px" }}
    />
);

const INITIAL_VALUES = {
    domain: "",
    name: "",
    owner: "",
    industry: "",
    type: "",
    city: "",
    country: "",
    employees: "",
    revenue: "",
    phone: "",
};

const validate = (values) => {
    let tempErrors = {};
    if (!values.domain) tempErrors.domain = "Domain Name is required";
    if (!values.name) tempErrors.name = "Company Name is required";
    if (!values.owner) tempErrors.owner = "Company Owner is required";
    if (!values.industry) tempErrors.industry = "Industry is required";
    if (!values.type) tempErrors.type = "Type is required";
    if (!values.phone) tempErrors.phone = "Phone is required";
    return tempErrors;
};

export default function CreateCompany({ open, onClose, onSave, editData }) {
    const toast = useToast();

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleChange,
        handleSubmit,
        resetForm,
    } = useForm(
        INITIAL_VALUES,
        true,
        validate
    );

    useEffect(() => {
        if (editData) {
            setValues(editData);
        } else {
            resetForm();
        }
    }, [editData, open, setValues, resetForm]);

    const onSubmit = (formData) => {
        onSave(formData);
        toast.success(editData ? "Company updated successfully" : "Company created successfully");
        onClose();
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box
                sx={{
                    width: 500,
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
                    px={3}
                    py={3}
                    sx={{ borderBottom: "1px solid #e2e8f0" }}
                >
                    <Typography variant="h6" fontWeight={700} color="#1e293b">
                        {editData ? "Edit Company" : "Create Company"}
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
                        <CloseIcon />
                    </IconButton>
                </Stack>

                {/* BODY */}
                <Box px={3} py={4} sx={{ flex: 1, overflowY: "auto" }}>
                    <Stack spacing={3}>

                        {/* Domain Name */}
                        <AppInput
                            label="Domain Name"
                            required
                            placeholder="Enter"
                            name="domain"
                            value={values.domain}
                            onChange={handleChange}
                            error={errors.domain}
                            helperText={errors.domain}
                        />

                        {/* Company Name */}
                        <AppInput
                            label="Company Name"
                            required
                            placeholder="Enter"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            error={errors.name}
                            helperText={errors.name}
                        />

                        {/* Company Owner */}
                        <AppSelect
                            label="Company Owner"
                            required
                            name="owner"
                            value={values.owner}
                            onChange={handleChange}
                            placeholder="Enter"
                            error={errors.owner}
                            helperText={errors.owner}
                        >
                            <MenuItem value="Jane Cooper">Jane Cooper</MenuItem>
                            <MenuItem value="Wade Warren">Wade Warren</MenuItem>
                            <MenuItem value="Brooklyn Simmons">Brooklyn Simmons</MenuItem>
                            <MenuItem value="Leslie Alexander">Leslie Alexander</MenuItem>
                            <MenuItem value="Jenny Wilson">Jenny Wilson</MenuItem>
                            <MenuItem value="Guy Hawkins">Guy Hawkins</MenuItem>
                            <MenuItem value="Robert Fox">Robert Fox</MenuItem>
                            <MenuItem value="Cameron Williamson">Cameron Williamson</MenuItem>
                        </AppSelect>

                        {/* Row: Industry & Type */}
                        <Stack direction="row" spacing={2}>
                            <Box sx={{ width: "50%" }}>
                                <AppSelect
                                    label="Industry"
                                    required
                                    name="industry"
                                    value={values.industry}
                                    onChange={handleChange}
                                    placeholder="Choose"
                                    options={INDUSTRIES}
                                    error={errors.industry}
                                    helperText={errors.industry}
                                />
                            </Box>
                            <Box sx={{ width: "50%" }}>
                                <AppSelect
                                    label="Type"
                                    required
                                    name="type"
                                    value={values.type}
                                    onChange={handleChange}
                                    placeholder="Choose"
                                    options={COMPANY_TYPES}
                                    error={errors.type}
                                    helperText={errors.type}
                                />
                            </Box>
                        </Stack>

                        {/* Row: City & Country/Region */}
                        <Stack direction="row" spacing={2}>
                            <Box sx={{ width: "50%" }}>
                                <AppInput
                                    label="City"
                                    placeholder="Enter"
                                    name="city"
                                    value={values.city}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box sx={{ width: "50%" }}>
                                <AppInput
                                    label="Country/Region"
                                    placeholder="Enter"
                                    name="country"
                                    value={values.country}
                                    onChange={handleChange}
                                />
                            </Box>
                        </Stack>

                        {/* Row: No of Employees & Annual Revenue */}
                        <Stack direction="row" spacing={2}>
                            <Box sx={{ width: "50%" }}>
                                <AppInput
                                    label="No of Employees"
                                    placeholder="Enter"
                                    name="employees"
                                    value={values.employees}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box sx={{ width: "50%" }}>
                                <AppInput
                                    label="Annual Revenue"
                                    placeholder="Enter"
                                    name="revenue"
                                    value={values.revenue}
                                    onChange={handleChange}
                                />
                            </Box>
                        </Stack>

                        {/* Phone Number */}
                        <AppInput
                            label="Phone Number"
                            required
                            placeholder="Enter"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            error={errors.phone}
                            helperText={errors.phone}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={0.5}
                                            sx={{
                                                cursor: "pointer",
                                                paddingRight: "8px",
                                                borderRight: "1px solid #e2e8f0",
                                                marginRight: "8px",
                                            }}
                                        >
                                            <FlagIcon />
                                            <KeyboardArrowDownIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                                        </Stack>
                                    </InputAdornment>
                                ),
                            }}
                        />

                    </Stack>
                </Box>

                {/* FOOTER */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    px={3}
                    py={3}
                    sx={{ borderTop: "1px solid #e2e8f0" }}
                >
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{
                            width: "48%",
                            borderColor: "#e2e8f0",
                            color: "#64748b",
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "15px",
                            padding: "10px",
                            borderRadius: "8px",
                            "&:hover": { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit(onSubmit)}
                        sx={{
                            width: "48%",
                            backgroundColor: "#5B4DDB",
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "15px",
                            padding: "10px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(91, 77, 219, 0.2)",
                            "&:hover": { backgroundColor: "#4f46e5" },
                        }}
                    >
                        Save
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
}
