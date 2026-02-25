import React, { useEffect } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import EntityDrawer from "../../components/common/EntityDrawer";
import AppInput from "../../components/form/AppInput";
import AppSelect from "../../components/form/AppSelect";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../hooks/useToast";

const DEAL_STAGES = [
    { value: "Appointment Scheduled", label: "Appointment Scheduled" },
    { value: "Qualified to Buy", label: "Qualified to Buy" },
    { value: "Presentation Scheduled", label: "Presentation Scheduled" },
    { value: "Decision Maker Bought In", label: "Decision Maker Bought In" },
    { value: "Contract Sent", label: "Contract Sent" },
    { value: "Closed Won", label: "Closed Won" },
    { value: "Closed Lost", label: "Closed Lost" },
];

const DEAL_OWNERS = [
    { value: "Jane Cooper", label: "Jane Cooper" },
    { value: "Wade Warren", label: "Wade Warren" },
    { value: "Brooklyn Simmons", label: "Brooklyn Simmons" },
    { value: "Leslie Alexander", label: "Leslie Alexander" },
    { value: "Jenny Wilson", label: "Jenny Wilson" },
    { value: "Guy Hawkins", label: "Guy Hawkins" },
    { value: "Robert Fox", label: "Robert Fox" },
    { value: "Cameron Williamson", label: "Cameron Williamson" },
];

const PRIORITIES = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
];

const INITIAL_FORM_STATE = {
    name: "",
    stage: "",
    amount: "",
    owner: "",
    closeDate: "",
    priority: "",
};

const validate = (values) => {
    let tempErrors = {};
    if (!values.name) tempErrors.name = "Deal Name is required";
    if (!values.stage) tempErrors.stage = "Stage is required";
    if (!values.amount) tempErrors.amount = "Amount is required";
    if (!values.owner) tempErrors.owner = "Owner is required";
    if (!values.closeDate) tempErrors.closeDate = "Close Date is required";
    if (!values.priority) tempErrors.priority = "Priority is required";
    return tempErrors;
};

export default function CreateDeal({ open, onClose, onSave, editData }) {
    const toast = useToast();

    const {
        values,
        setValues,
        errors,
        handleChange,
        handleSubmit,
        resetForm,
    } = useForm(INITIAL_FORM_STATE, true, validate);

    useEffect(() => {
        if (editData) {
            setValues({
                name: editData.name || "",
                stage: editData.stage || "",
                amount: editData.amount || "",
                owner: editData.owner || "",
                closeDate: editData.closeDate || "",
                priority: editData.priority || "",
            });
        } else {
            resetForm();
        }
    }, [editData, open, setValues, resetForm]);

    const onSubmit = (formData) => {
        onSave(formData);
        toast.success(editData ? "Deal updated successfully" : "Deal created successfully");
        onClose();
    };

    return (
        <EntityDrawer
            open={open}
            onClose={onClose}
            title={editData ? "Edit Deal" : "Create Deal"}
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
                            backgroundColor: "#5B4DDB", // PRIMARY
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
                    label="Deal Name"
                    required
                    placeholder="Enter"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    error={errors.name}
                    helperText={errors.name}
                />

                <AppSelect
                    label="Deal Stage"
                    required
                    placeholder="Choose"
                    name="stage"
                    value={values.stage}
                    onChange={handleChange}
                    options={DEAL_STAGES.map(s => s.value)}
                    error={errors.stage}
                    helperText={errors.stage}
                />

                <AppInput
                    label="Amount"
                    required
                    placeholder="Enter"
                    name="amount"
                    value={values.amount}
                    onChange={handleChange}
                    error={errors.amount}
                    helperText={errors.amount}
                />

                <AppSelect
                    label="Deal Owner"
                    required
                    placeholder="Choose"
                    name="owner"
                    value={values.owner}
                    onChange={handleChange}
                    options={DEAL_OWNERS.map(o => o.value)}
                    error={errors.owner}
                    helperText={errors.owner}
                />

                <Stack direction="row" spacing={2}>
                    <Box sx={{ width: "50%" }}>
                        <AppInput
                            label="Close Date"
                            required
                            type="date"
                            placeholder="Choose"
                            name="closeDate"
                            value={values.closeDate}
                            onChange={handleChange}
                            error={errors.closeDate}
                            helperText={errors.closeDate}
                        />
                    </Box>
                    <Box sx={{ width: "50%" }}>
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
                </Stack>
            </Stack>
        </EntityDrawer>
    );
}
