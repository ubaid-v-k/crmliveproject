import React, { useEffect, useState } from "react";
import { Box, Stack, Button, RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";
import EntityDrawer from "../../components/common/EntityDrawer";
import AppInput from "../../components/form/AppInput";
import AppSelect from "../../components/form/AppSelect";
import { useForm } from "../../hooks/useForm";
import { getCurrentUser } from "../../api/authService";
import { useToast } from "../../hooks/useToast";
import { useCompanies } from "../../context/CompaniesContext";
import { useDeals } from "../../context/DealsContext";

const TICKET_STATUSES = [
    { value: "New", label: "New" },
    { value: "Waiting on contact", label: "Waiting on contact" },
    { value: "Waiting on us", label: "Waiting on us" },
    { value: "Closed", label: "Closed" },
];

const SOURCES = [
    { value: "Chat", label: "Chat" },
    { value: "Email", label: "Email" },
    { value: "Phone", label: "Phone" },
    { value: "Web Form", label: "Web Form" },
];

const PRIORITIES = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Critical", label: "Critical" },
];

const OWNERS = [
    { value: "Jane Cooper", label: "Jane Cooper" },
    { value: "Wade Warren", label: "Wade Warren" },
    { value: "Brooklyn Simmons", label: "Brooklyn Simmons" },
    { value: "Leslie Alexander", label: "Leslie Alexander" },
    { value: "Jenny Wilson", label: "Jenny Wilson" },
    { value: "Guy Hawkins", label: "Guy Hawkins" },
    { value: "Robert Fox", label: "Robert Fox" },
    { value: "Cameron Williamson", label: "Cameron Williamson" },
];

const INITIAL_FORM_STATE = {
    title: "",
    description: "",
    status: "",
    source: "",
    priority: "",
    owner: [],
    associationType: "company", // 'company' or 'deal'
    companyId: "",
    dealId: "",
};

const validate = (values) => {
    let tempErrors = {};
    if (!values.title) tempErrors.title = "Ticket Name is required";
    if (!values.status) tempErrors.status = "Status is required";
    if (!values.source) tempErrors.source = "Source is required";
    if (!values.priority) tempErrors.priority = "Priority is required";
    if (!values.owner) tempErrors.owner = "Owner is required";

    // Enforce Exclusive Association
    if (values.associationType === "company" && !values.companyId) {
        tempErrors.companyId = "Company is required";
    }
    if (values.associationType === "deal" && !values.dealId) {
        tempErrors.dealId = "Deal is required";
    }

    return tempErrors;
};

export default function CreateTicket({ open, onClose, onSave, editData }) {
    const toast = useToast();
    const { companies } = useCompanies();
    const { deals } = useDeals();

    const {
        values,
        setValues,
        errors,
        handleChange,
        handleSubmit,
        resetForm,
    } = useForm(INITIAL_FORM_STATE, true, validate);

    const currentUser = getCurrentUser();
    const currentUserName = currentUser ? (`${currentUser.firstName} ${currentUser.lastName}`.trim() || currentUser.email) : "";

    useEffect(() => {
        if (editData) {
            setValues({
                title: editData.title || "",
                description: editData.description || "",
                status: editData.status || "",
                source: editData.source || "",
                priority: editData.priority || "",
                owner: editData.owner ? (typeof editData.owner === 'string' ? editData.owner.split(',').map(s => s.trim()) : editData.owner) : [],
                associationType: editData.dealId ? "deal" : "company",
                companyId: editData.companyId || "",
                dealId: editData.dealId || "",
            });
        } else {
            resetForm();
            if (currentUserName) {
                setValues(prev => ({ ...prev, owner: [currentUserName] }));
            }
        }
    }, [editData, open, setValues, resetForm, currentUserName]);

    const ownerOptions = OWNERS.map(o => o.value);
    if (currentUserName && !ownerOptions.includes(currentUserName)) {
        ownerOptions.unshift(currentUserName);
    }
    (values.owner || []).forEach(o => {
        if (!ownerOptions.includes(o)) ownerOptions.push(o);
    });

    const handleAssociationTypeChange = (e) => {
        const type = e.target.value;
        setValues(prev => ({
            ...prev,
            associationType: type,
            companyId: type === "company" ? prev.companyId : "",
            dealId: type === "deal" ? prev.dealId : "",
        }));
    };

    const onSubmit = (formData) => {
        // Ensure exclusivity in final data (UI handles it but good to be safe)
        const finalData = {
            ...formData,
            owner: Array.isArray(formData.owner) ? formData.owner.join(", ") : formData.owner,
            companyId: formData.associationType === "company" ? formData.companyId : null,
            dealId: formData.associationType === "deal" ? formData.dealId : null,
        };
        onSave(finalData);
        toast.success(editData ? "Ticket updated successfully" : "Ticket created successfully");
        onClose();
    };

    return (
        <EntityDrawer
            open={open}
            onClose={onClose}
            title={editData ? "Edit Ticket" : "Create Ticket"}
            width={500}
            footer={
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ width: "100%" }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            borderColor: "#e2e8f0",
                            color: "#1e293b",
                            "&:hover": { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit(onSubmit)}
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            backgroundColor: "#5B4DDB",
                            "&:hover": { backgroundColor: "#4f46e5" },
                        }}
                    >
                        Save
                    </Button>
                </Stack>
            }
        >
            <Stack spacing={3} sx={{ mt: 2 }}>
                <AppInput
                    label="Ticket Name"
                    required
                    placeholder="Enter"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    error={errors.title}
                    helperText={errors.title}
                />

                <AppInput
                    label="Description"
                    placeholder="Enter"
                    name="description"
                    multiline
                    rows={3}
                    value={values.description}
                    onChange={handleChange}
                />

                <Stack direction="row" spacing={2}>
                    <Box sx={{ width: "50%" }}>
                        <AppSelect
                            label="Ticket Status"
                            required
                            placeholder="Choose"
                            name="status"
                            value={values.status}
                            onChange={handleChange}
                            options={TICKET_STATUSES.map(s => s.value)}
                            error={errors.status}
                            helperText={errors.status}
                        />
                    </Box>
                    <Box sx={{ width: "50%" }}>
                        <AppSelect
                            label="Source"
                            required
                            placeholder="Choose"
                            name="source"
                            value={values.source}
                            onChange={handleChange}
                            options={SOURCES.map(s => s.value)}
                            error={errors.source}
                            helperText={errors.source}
                        />
                    </Box>
                </Stack>

                <Box>
                    <AppSelect
                        label="Priority"
                        required
                        placeholder="Choose"
                        name="priority"
                        value={values.priority}
                        onChange={handleChange}
                        options={PRIORITIES.map(p => p.value)}
                        error={errors.priority}
                        helperText={errors.priority}
                    />
                </Box>

                <Box>
                    <AppSelect
                        label="Ticket Owner"
                        required
                        multiple
                        placeholder="Choose"
                        name="owner"
                        value={values.owner}
                        onChange={handleChange}
                        options={ownerOptions}
                        error={errors.owner}
                        helperText={errors.owner}
                    />
                </Box>

                {/* Association Section */}
                <Box sx={{ p: 2, border: "1px solid #e2e8f0", borderRadius: "8px", bgcolor: "#f8fafc" }}>
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Associate With
                    </Typography>
                    <RadioGroup
                        row
                        name="associationType"
                        value={values.associationType}
                        onChange={handleAssociationTypeChange}
                        sx={{ mb: 2 }}
                    >
                        <FormControlLabel value="company" control={<Radio size="small" />} label="Company" />
                        <FormControlLabel value="deal" control={<Radio size="small" />} label="Deal" />
                    </RadioGroup>

                    {values.associationType === "company" && (
                        <AppSelect
                            label="Select Company"
                            required
                            placeholder="Choose Company"
                            name="companyId"
                            value={values.companyId}
                            onChange={handleChange}
                            options={companies.map(c => ({ value: c.id, label: c.name }))}
                            error={errors.companyId}
                            helperText={errors.companyId}
                        />
                    )}

                    {values.associationType === "deal" && (
                        <AppSelect
                            label="Select Deal"
                            required
                            placeholder="Choose Deal"
                            name="dealId"
                            value={values.dealId}
                            onChange={handleChange}
                            options={deals.map(d => ({ value: d.id, label: d.name }))}
                            error={errors.dealId}
                            helperText={errors.dealId}
                        />
                    )}
                </Box>
            </Stack>
        </EntityDrawer>
    );
}
