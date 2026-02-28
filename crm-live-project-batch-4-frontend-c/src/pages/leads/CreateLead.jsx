import React, { useEffect } from "react";
import AppInput from "../../components/form/AppInput";
import AppSelect from "../../components/form/AppSelect";
import { useForm } from "../../hooks/useForm";
import { getCurrentUser } from "../../api/authService";
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
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const STATUS = ["New", "Open", "In Progress", "Qualified", "Lost", "Bad Info"];

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
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    title: "",
    owner: [],
    status: "",
};

const validate = (values) => {
    let tempErrors = {};
    if (!values.firstName) tempErrors.firstName = "First Name is required";
    if (!values.lastName) tempErrors.lastName = "Last Name is required";
    if (!values.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(values.email)) tempErrors.email = "Email is invalid";
    if (!values.phone) tempErrors.phone = "Phone is required";
    return tempErrors;
};

export default function CreateLead({ open, onClose, onSave, editData }) {
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
        true, // Validate on change
        validate
    );

    const currentUser = getCurrentUser();
    const currentUserName = currentUser ? (`${currentUser.firstName} ${currentUser.lastName}`.trim() || currentUser.email) : "";

    // Populate form on edit
    useEffect(() => {
        if (editData) {
            setValues({
                ...editData,
                owner: editData.owner ? (typeof editData.owner === 'string' ? editData.owner.split(',').map(s => s.trim()) : editData.owner) : [],
            });
        } else {
            resetForm();
            if (currentUserName) {
                setValues(prev => ({ ...prev, owner: [currentUserName] }));
            }
        }
    }, [editData, open, setValues, resetForm, currentUserName]);

    const MOCK_OWNERS = ["Jane Cooper", "Wade Warren", "Brooklyn Simmons"];
    const ownerOptions = [...MOCK_OWNERS];
    if (currentUserName && !ownerOptions.includes(currentUserName)) {
        ownerOptions.unshift(currentUserName);
    }
    (values.owner || []).forEach(o => {
        if (!ownerOptions.includes(o)) ownerOptions.push(o);
    });

    const onSubmit = (formData) => {
        const payload = {
            ...formData,
            owner: Array.isArray(formData.owner) ? formData.owner.join(", ") : formData.owner,
        };
        onSave(payload);
        toast.success(editData ? "Lead updated successfully" : "Lead created successfully");
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
                        {editData ? "Edit Lead" : "Create Lead"}
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
                        <CloseIcon />
                    </IconButton>
                </Stack>

                {/* BODY */}
                <Box px={3} py={4} sx={{ flex: 1, overflowY: "auto" }}>
                    <Stack spacing={3}>
                        {/* Email */}
                        <AppInput
                            label="Email"
                            required
                            placeholder="Enter"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            error={errors.email}
                            helperText={errors.email}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlinedIcon sx={{ color: "#94a3b8" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* First Name */}
                        <AppInput
                            label="First Name"
                            required
                            placeholder="Enter"
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            error={errors.firstName}
                            helperText={errors.firstName}
                        />

                        {/* Last Name */}
                        <AppInput
                            label="Last Name"
                            required
                            placeholder="Enter"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            error={errors.lastName}
                            helperText={errors.lastName}
                        />

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

                        {/* Job Title */}
                        <AppInput
                            label="Job Title"
                            placeholder="Enter"
                            name="title"
                            value={values.title}
                            onChange={handleChange}
                        />

                        {/* Contact Owner */}
                        <AppSelect
                            label="Contact Owner"
                            name="owner"
                            multiple
                            value={values.owner}
                            onChange={handleChange}
                            placeholder="Choose"
                            options={ownerOptions}
                        />

                        {/* City */}
                        <AppInput
                            label="City"
                            placeholder="Enter"
                            name="city"
                            value={values.city || ""}
                            onChange={handleChange}
                        />

                        {/* Lead Status */}
                        <AppSelect
                            label="Lead Status"
                            name="status"
                            value={values.status}
                            onChange={handleChange}
                            placeholder="Choose"
                            options={STATUS}
                            disabled={editData?.status === "Converted"}
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
